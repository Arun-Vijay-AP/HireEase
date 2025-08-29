import os
import json
import time
import shutil
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from uuid import uuid4

# ============================
# Config
# ============================
load_dotenv()

app = FastAPI(title="HireEase Backend", version="1.0")

LLAMAPARSE_API_KEY = os.getenv("LLAMAPARSE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SHEETS_WEBAPP_URL = os.getenv("SHEETS_WEBAPP_URL")
DEPLOYMENT_ID = os.getenv("DEPLOYMENT_ID")
BASE_URL = f"https://script.google.com/macros/s/AKfycbyVdjip5gy69aJzo3dOCWC4LJHcXO7Py-diakM-tNog1dUxKBNYh6RkeGQDp0KBpQEH/exec"

UPLOAD_URL = "https://api.cloud.llamaindex.ai/api/v1/parsing/upload"
JOB_URL = "https://api.cloud.llamaindex.ai/api/v1/parsing/job"

headers = {
    "Authorization": f"Bearer {LLAMAPARSE_API_KEY}",
    "Accept": "application/json"
}

# ============================
# In-memory Rounds Storage (for demo)
# ============================
ROUNDS = []

class Round(BaseModel):
    id: str
    jobId: str
    name: str
    type: str
    description: str
    duration: int
    order: int
    isActive: Optional[bool] = True

# ============================
# Job Posting Feature
# ============================
JOBS_FILE = "jobs.json"

def load_jobs():
    if not os.path.exists(JOBS_FILE):
        with open(JOBS_FILE, "w") as f:
            json.dump([], f)
    with open(JOBS_FILE, "r") as f:
        return json.load(f)

def save_jobs(jobs):
    with open(JOBS_FILE, "w") as f:
        json.dump(jobs, f, indent=2)

class Job(BaseModel):
    id: str
    title: str
    department: str
    location: str
    type: str
    description: str
    requirements: Optional[list] = []
    minSalary: Optional[float] = 0
    maxSalary: Optional[float] = 0
    minExperience: Optional[float] = 0
    maxExperience: Optional[float] = 0
    education: Optional[list] = []
    skills: Optional[list] = []
    benefits: Optional[list] = []

@app.post("/jobs")
def create_job(job: Job):
    jobs = load_jobs()
    job.id = str(uuid4())
    jobs.append(job.dict())
    save_jobs(jobs)
    return job

@app.get("/jobs")
def get_jobs():
    return load_jobs()

@app.post("/jobs", response_model=Job)
def create_job(job: Job):
    jobs = load_jobs()
    job_dict = job.dict()
    job_dict["id"] = str(uuid4())   # generate UUID
    jobs.append(job_dict)
    save_jobs(jobs)
    return job_dict


# ============================
# LlamaParse Helper functions
# ============================
def upload_file_backend(file_path, file_name, file_type):
    """Upload file to LlamaParse and return job_id"""
    with open(file_path, "rb") as f:
        files = {"file": (file_name, f, file_type)}
        resp = requests.post(UPLOAD_URL, headers=headers, files=files)
    resp.raise_for_status()
    data = resp.json()
    return data.get("id") or data.get("job_id")

def poll_result(job_id, max_retries=15):
    """Poll job until completion with backoff"""
    status_url = f"{JOB_URL}/{job_id}"
    result_url = f"{JOB_URL}/{job_id}/result/markdown"
    delay = 2

    for attempt in range(max_retries):
        try:
            r = requests.get(status_url, headers=headers, timeout=30)
            r.raise_for_status()
            data = r.json()
            status = data.get("status", "").lower()

            if status in ["completed", "done", "success"]:
                r2 = requests.get(result_url, headers=headers, timeout=30)
                r2.raise_for_status()
                return r2.text
            elif status == "failed":
                raise Exception("❌ Parsing failed: " + str(data))
        except requests.exceptions.RequestException:
            pass
        time.sleep(delay)
        delay = min(delay * 1, 30)

    raise TimeoutError("❌ Job did not finish in time")

# ============================
# Gemini Helper
# ============================
def structure_with_gemini(text):
    """Use Gemini to structure parsed text into clean JSON dict"""
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    You are an expert recruitment assistant.
    Extract structured candidate information from the following text.
    Return ONLY valid JSON (no code fences, no markdown, no explanation)
    with these fields:
    - Full Name
    - Email
    - Phone
    - Position Applied
    - Years of Experience
    - Skills
    - Preferred Location
    - Availability

    Text:
    {text}
    """

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Remove accidental code fences if Gemini adds them
    if raw.startswith("```"):
        raw = raw.strip("`")
        raw = raw.replace("json", "", 1).strip()

    try:
        structured = json.loads(raw)
    except Exception as e:
        raise ValueError(f"❌ Gemini did not return valid JSON: {raw}") from e

    # Normalize: ensure arrays are strings for Sheets
    for k, v in structured.items():
        if isinstance(v, list):
            structured[k] = ", ".join(map(str, v))
        elif v is None:
            structured[k] = ""

    return structured

# ============================
# Application Storage
# ============================
APPLICATIONS_FILE = "applications.json"
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_applications():
    if not os.path.exists(APPLICATIONS_FILE):
        with open(APPLICATIONS_FILE, "w") as f:
            json.dump([], f)
    with open(APPLICATIONS_FILE, "r") as f:
        return json.load(f)

def save_applications(applications):
    with open(APPLICATIONS_FILE, "w") as f:
        json.dump(applications, f, indent=2)

def save_resume_file(file: UploadFile):
    file_ext = os.path.splitext(file.filename)[-1]
    unique_name = f"{uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return unique_name, file_path

from datetime import datetime

class Application(BaseModel):
    id: str
    jobId: str
    position: str
    company: str
    status: str
    appliedDate: str
    lastUpdate: str
    resume_filename: Optional[str] = None

# ============================
# Resume Processing & Application Endpoints
# ============================

@app.post("/process/")
async def process_resume(file: UploadFile = File(...)):
    """Process resume for validation - simple validation endpoint"""
    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload PDF, DOC, or DOCX files only.")
    
    # Save the resume file temporarily for validation
    resume_filename, file_path = save_resume_file(file)
    
    try:
        # Basic validation - just check if file was saved successfully
        if os.path.exists(file_path):
            # Clean up temporary file after validation
            os.remove(file_path)
            return {"success": True, "message": "Resume validated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to process resume file")
    except Exception as e:
        # Clean up on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Resume processing failed: {str(e)}")

@app.post("/apply/")
async def apply_with_resume(
    jobId: str = Query(...),
    position: str = Query(...),
    company: str = Query(...),
    file: UploadFile = File(...)
):
    """Apply for a job with resume - includes full processing and Google Sheets integration"""
    
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload PDF, DOC, or DOCX files only.")
    
    # Save resume file
    resume_filename, file_path = save_resume_file(file)
    
    try:
        # Step 1: Upload to LlamaParse
        if not LLAMAPARSE_API_KEY:
            raise HTTPException(status_code=500, detail="LlamaParse API key not configured")
        
        llamaparse_job_id = upload_file_backend(file_path, file.filename, file.content_type)
        
        # Step 2: Poll for parsing result
        parsed_text = poll_result(llamaparse_job_id)
        
        # Step 3: Structure with Gemini
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        structured_data = structure_with_gemini(parsed_text)
        
        # Step 4: Add job-specific information to structured data
        structured_data["Position Applied"] = position
        structured_data["Company"] = company
        structured_data["Job ID"] = jobId
        structured_data["Status"] = "Applied"
        structured_data["Applied Date"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Step 5: Send to Google Sheets
        if SHEETS_WEBAPP_URL:
            try:
                sheets_response = send_to_sheets(structured_data)
                print(f"Successfully sent to Google Sheets: {sheets_response}")
            except Exception as sheets_error:
                print(f"Warning: Failed to send to Google Sheets: {sheets_error}")
                # Continue processing even if Sheets fails
        
        # Step 6: Save application locally
        applications = load_applications()
        app_data = {
            "id": str(uuid4()),
            "jobId": jobId,
            "position": position,
            "company": company,
            "status": "applied",
            "appliedDate": datetime.now().isoformat(),
            "lastUpdate": datetime.now().isoformat(),
            "resume_filename": resume_filename,
            "structured_data": structured_data
        }
        applications.append(app_data)
        save_applications(applications)
        
        return {
            "success": True,
            "message": "Application submitted successfully",
            "application": app_data,
            "structured_data": structured_data
        }
        
    except Exception as e:
        # Clean up file on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Application failed: {str(e)}")
    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get("/applications")
def get_applications():
    return load_applications()

@app.get("/applications/{application_id}")
def get_application(application_id: str):
    applications = load_applications()
    app = next((a for a in applications if a["id"] == application_id), None)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@app.put("/applications/{application_id}")
def update_application_status(application_id: str, status_data: dict = Body(...)):
    applications = load_applications()
    app_index = next((i for i, a in enumerate(applications) if a["id"] == application_id), None)
    
    if app_index is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update application status
    applications[app_index]["status"] = status_data.get("status", applications[app_index]["status"])
    applications[app_index]["lastUpdate"] = datetime.now().isoformat()
    
    save_applications(applications)
    return applications[app_index]

@app.post("/applications")
def create_application(app: Application):
    applications = load_applications()
    app.id = str(uuid4())
    applications.append(app.dict())
    save_applications(applications)
    return app

# ============================
# Google Sheets Integration
# ============================
def send_to_sheets(data: dict):
    """Send structured JSON to Google Apps Script Web App (Sheets)"""
    if not SHEETS_WEBAPP_URL:
        raise ValueError("❌ SHEETS_WEBAPP_URL not set in .env")

    # Make a copy and ensure Status is set
    sheet_data = dict(data)
    if "Status" not in sheet_data:
        sheet_data["Status"] = "Applied"

    try:
        resp = requests.post(
            SHEETS_WEBAPP_URL,
            json=sheet_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to send data to Google Sheets: {str(e)}")

# ============================
# Shortlisting Feature
# ============================
class ShortlistRequest(BaseModel):
    filters: dict = {}
    limit: Optional[int] = None
    offset: Optional[int] = None

@app.post("/shortlist")
def shortlist_candidates(payload: ShortlistRequest):
    # Prepare GET params
    params = {}
    if payload.filters:
        params["filters"] = json.dumps(payload.filters)
    if payload.limit:
        params["limit"] = payload.limit
    if payload.offset:
        params["offset"] = payload.offset

    # GET filtered data
    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()
        headers = [h.strip() for h in data.get("headers", [])]
        rows = [[str(cell).strip() for cell in row] for row in data.get("rows", [])]
    except Exception as e:
        return {"error": f"Error fetching data: {e}"}

    # POST shortlist
    try:
        post_body = {
            "method": "SHORTLIST",
            "criteria": payload.filters
        }
        post_response = requests.post(BASE_URL, json=post_body)
        message = post_response.json().get("message", "Shortlisting done")
    except Exception as e:
        message = f"Shortlisting error: {e}"

    return {
        "headers": headers,
        "rows": rows,
        "message": message
    }

# ============================
# FastAPI App Middleware
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "HireEase Backend is running."}

# ============================
# Original Resume Parsing Endpoints (kept for backward compatibility)
# ============================
@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not LLAMAPARSE_API_KEY:
        raise HTTPException(status_code=400, detail="LLAMAPARSE_API_KEY not set")
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        job_id = upload_file_backend(temp_path, file.filename, file.content_type)
        return {"job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/parse/{job_id}")
def parse_resume(job_id: str):
    try:
        parsed_text = poll_result(job_id)
        return {"parsed_text": parsed_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/structure")
def structure_resume(data: dict = Body(...)):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY not set")
    text = data.get("text", "")
    try:
        structured = structure_with_gemini(text)
        return {"structured": structured}
    except Exception as e:
        print("Gemini error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save")
def save_to_sheets_endpoint(data: dict = Body(...)):
    try:
        result = send_to_sheets(data)
        return {"result": result}
    except Exception as e:
        print("Google Sheets error:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ============================
# Rounds CRUD Endpoints
# ============================
@app.get("/rounds", response_model=List[Round])
def get_rounds(job_id: str = Query(...)):
    return [r for r in ROUNDS if r["jobId"] == job_id]

@app.post("/rounds", response_model=Round)
def create_round(round: Round):
    round.id = str(uuid4())
    ROUNDS.append(round.dict())
    return round

@app.put("/rounds/{round_id}", response_model=Round)
def update_round(round_id: str, round: Round):
    for idx, r in enumerate(ROUNDS):
        if r["id"] == round_id:
            ROUNDS[idx] = round.dict()
            return round
    raise HTTPException(status_code=404, detail="Round not found")

@app.delete("/rounds/{round_id}")
def delete_round(round_id: str):
    global ROUNDS
    ROUNDS = [r for r in ROUNDS if r["id"] != round_id]
    return {"message": "Round deleted successfully"}
import streamlit as st
import requests
import time
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# ============================
# Config
# ============================
load_dotenv()

LLAMAPARSE_API_KEY = os.getenv("LLAMAPARSE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SHEETS_WEBAPP_URL = os.getenv("SHEETS_WEBAPP_URL")   # <-- Add your deployed Google Apps Script Web App URL

UPLOAD_URL = "https://api.cloud.llamaindex.ai/api/v1/parsing/upload"
JOB_URL = "https://api.cloud.llamaindex.ai/api/v1/parsing/job"

headers = {
    "Authorization": f"Bearer {LLAMAPARSE_API_KEY}",
    "Accept": "application/json"
}

# ============================
# LlamaParse Helper functions
# ============================
def upload_file(file):
    """Upload file to LlamaParse and return job_id"""
    files = {"file": (file.name, file, file.type)}
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

            st.write(f"⏳ Job status: {status}, retrying in {delay}s...")

        except requests.exceptions.RequestException as e:
            st.warning(f"⚠️ Polling error (attempt {attempt+1}): {e}")

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
# Google Sheets POST
# ============================
def send_to_sheets(data: dict):
    """Send structured JSON to Google Apps Script Web App (Sheets)"""
    if not SHEETS_WEBAPP_URL:
        raise ValueError("❌ SHEETS_WEBAPP_URL not set in .env")
    
    resp = requests.post(
        SHEETS_WEBAPP_URL,
        json=data,  # Send JSON payload
        headers={"Content-Type": "application/json"}
    )
    resp.raise_for_status()
    return resp.json()

# ============================
# Streamlit UI
# ============================
st.title("📄 Resume / Intake Form Parser → Gemini Structuring → Google Sheets")

uploaded_file = st.file_uploader("Upload a resume or intake form (PDF/DOCX)", type=["pdf", "docx","jpg","png","jpeg"])

if uploaded_file is not None:
    if not LLAMAPARSE_API_KEY:
        st.error("❌ No API key found. Please set LLAMAPARSE_API_KEY in your environment or secrets.toml")
    elif not GEMINI_API_KEY:
        st.error("❌ No Gemini API key found. Please set GEMINI_API_KEY in your environment or secrets.toml")
    elif not SHEETS_WEBAPP_URL:
        st.error("❌ No Sheets Web App URL found. Please set SHEETS_WEBAPP_URL in your environment or secrets.toml")
    else:
        with st.spinner("Uploading to LlamaParse..."):
            try:
                job_id = upload_file(uploaded_file)
                st.write(f"Job ID: `{job_id}`")
                st.info("Waiting for LlamaParse to finish parsing...")

                parsed_text = poll_result(job_id)
                st.success("✅ Parsing completed!")

                st.subheader("Parsed Text (Markdown):")
                st.text_area("Output", value=parsed_text, height=300)

                # 🔹 Pass to Gemini for structuring
                with st.spinner("Structuring with Gemini..."):
                    structured_output = structure_with_gemini(parsed_text)

                st.subheader("📑 Structured Candidate Data (Gemini):")
                st.json(structured_output)

                # 🔹 Send to Google Sheets
                with st.spinner("Sending to Google Sheets..."):
                    result = send_to_sheets(structured_output)

                st.success("✅ Data saved to Google Sheets!")
                st.write(result)

            except Exception as e:
                st.error(f"Error: {e}")

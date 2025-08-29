// src/pages/CandidateDashboard.jsx
import React, { useRef, useState, useEffect } from "react";
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Download,
    Calendar,
    Briefcase,
    MapPin,
    Search,
    Building2,
    ClipboardList,
    Bookmark,
    BookmarkCheck,
    User,
    Edit2,
    Save,
    Loader,
    AlertCircle
} from "lucide-react";

// Mock jobs and initial profile for demo
const mockJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Acme Corp",
        location: "Remote",
        description: "Build and maintain React applications. Collaborate with UX/UI teams.",
        postedBy: "recruiter@acme.com",
    },
    {
        id: 2,
        title: "Backend Engineer",
        company: "Tech Solutions",
        location: "Bangalore",
        description: "Develop REST APIs and work with Node.js and MongoDB.",
        postedBy: "recruiter@techsolutions.com",
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "Designify",
        location: "Chennai",
        description: "Design user interfaces and experiences for web and mobile apps.",
        postedBy: "recruiter@designify.com",
    },
];

const initialProfile = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "9876543210",
    education: "B.Tech Computer Science",
    experience: "2 years at Acme Corp",
    skills: "React, Node.js, UI/UX",
    resume: "",
};

const CandidateDashboard = () => {
    // Profile Management
    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem("candidateProfile");
        return stored ? JSON.parse(stored) : initialProfile;
    });
    const [editProfile, setEditProfile] = useState(false);
    const [profileForm, setProfileForm] = useState(profile);

    // Jobs, Applications, Saved Jobs
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState(() => {
        const stored = localStorage.getItem("savedJobs");
        return stored ? JSON.parse(stored) : [];
    });
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("jobs");

    // Resume upload state
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [processingStatus, setProcessingStatus] = useState("");
    const fileInputRef = useRef(null);
    const [pendingJob, setPendingJob] = useState(null);

    // Load data on mount
    useEffect(() => {
        setJobs(mockJobs);
        loadApplicationsFromBackend();
    }, []);

    // Load applications from backend
    const loadApplicationsFromBackend = async () => {
        try {
            const response = await fetch("http://localhost:8000/applications");
            if (response.ok) {
                const backendApps = await response.json();
                setApplications(backendApps);
            } else {
                // Fallback to localStorage if backend is unavailable
                const storedApps = localStorage.getItem("candidateApplications");
                if (storedApps) setApplications(JSON.parse(storedApps));
            }
        } catch (error) {
            console.warn("Failed to load applications from backend, using localStorage:", error);
            const storedApps = localStorage.getItem("candidateApplications");
            if (storedApps) setApplications(JSON.parse(storedApps));
        }
    };

    useEffect(() => {
        localStorage.setItem("candidateApplications", JSON.stringify(applications));
    }, [applications]);

    useEffect(() => {
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    }, [savedJobs]);

    useEffect(() => {
        localStorage.setItem("candidateProfile", JSON.stringify(profile));
    }, [profile]);

    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase()) ||
            job.location.toLowerCase().includes(search.toLowerCase())
    );

    // Apply/Unapply with resume upload and backend integration
    const handleApplyToggle = (job) => {
        const alreadyApplied = applications.some(app => app.jobId === job.id);
        if (alreadyApplied) {
            // Remove application (unapply)
            setApplications(applications.filter(app => app.jobId !== job.id));
        } else {
            // Start application process
            setPendingJob(job);
            setUploadError("");
            setUploadSuccess("");
            setProcessingStatus("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    // Handle file upload with full backend processing
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !pendingJob) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|doc|docx)$/)) {
            setUploadError("Please upload only PDF, DOC, or DOCX files.");
            return;
        }

        setUploading(true);
        setUploadError("");
        setUploadSuccess("");
        setProcessingStatus("Uploading resume...");

        try {
            // Create FormData with job details
            const formData = new FormData();
            formData.append("file", file);

            // Use the new /apply/ endpoint with query parameters
            const queryParams = new URLSearchParams({
                jobId: pendingJob.id.toString(),
                position: pendingJob.title,
                company: pendingJob.company
            });

            setProcessingStatus("Processing resume with AI...");

            const response = await fetch(`http://localhost:8000/apply/?${queryParams}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Application failed");
            }

            const result = await response.json();
            
            setProcessingStatus("Sending data to Google Sheets...");

            // Add to local applications state
            const newApplication = {
                id: result.application.id,
                jobId: pendingJob.id,
                position: pendingJob.title,
                company: pendingJob.company,
                status: "applied",
                appliedDate: new Date().toISOString(),
                lastUpdate: new Date().toISOString(),
                structured_data: result.structured_data || null
            };

            setApplications([newApplication, ...applications]);
            setUploadSuccess(`Application submitted successfully! Your resume has been processed and sent to Google Sheets for ${pendingJob.company}.`);
            
            if (result.structured_data) {
                console.log("Structured data extracted:", result.structured_data);
            }

        } catch (err) {
            console.error("Application error:", err);
            setUploadError(err.message || "Application failed. Please try again.");
        } finally {
            setUploading(false);
            setProcessingStatus("");
            setPendingJob(null);
        }
    };

    // Save/Unsave Jobs
    const handleSaveJob = (jobId) => {
        if (savedJobs.includes(jobId)) {
            setSavedJobs(savedJobs.filter(id => id !== jobId));
        } else {
            setSavedJobs([...savedJobs, jobId]);
        }
    };

    // Application Status
    const getJobStatus = (jobId) => {
        const app = applications.find(a => a.jobId === jobId);
        return app ? app.status : null;
    };

    // Application Stats
    const stats = {
        total: applications.length,
        pending: applications.filter((app) =>
            ["applied", "screening", "interview"].includes(app.status)
        ).length,
        hired: applications.filter((app) => app.status === "hired").length,
        rejected: applications.filter((app) => app.status === "rejected").length,
    };

    // Status Color/Icon
    const getStatusColor = (status) => {
        switch (status) {
            case "applied":
                return "bg-blue-100 text-blue-800";
            case "screening":
                return "bg-yellow-100 text-yellow-800";
            case "interview":
                return "bg-purple-100 text-purple-800";
            case "hired":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "applied":
                return <Clock className="w-4 h-4" />;
            case "screening":
                return <Eye className="w-4 h-4" />;
            case "interview":
                return <Calendar className="w-4 h-4" />;
            case "hired":
                return <CheckCircle className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Profile Form Handlers
    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };
    const handleProfileSave = () => {
        setProfile(profileForm);
        setEditProfile(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            {/* Profile Management */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                    <div className="bg-blue-100 rounded-full p-4 mb-2">
                        <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="font-bold text-lg">{profile.name}</div>
                    <div className="text-gray-500 text-sm">{profile.email}</div>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-blue-900">Profile Details</div>
                        {!editProfile ? (
                            <button
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                    setEditProfile(true);
                                    setProfileForm(profile);
                                }}
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                        ) : (
                            <button
                                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                                onClick={handleProfileSave}
                            >
                                <Save className="w-4 h-4" /> Save
                            </button>
                        )}
                    </div>
                    {!editProfile ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                            <div><span className="font-medium">Phone:</span> {profile.phone}</div>
                            <div><span className="font-medium">Education:</span> {profile.education}</div>
                            <div><span className="font-medium">Experience:</span> {profile.experience}</div>
                            <div><span className="font-medium">Skills:</span> {profile.skills}</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                                className="border rounded px-2 py-1"
                                name="name"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                placeholder="Name"
                            />
                            <input
                                className="border rounded px-2 py-1"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                placeholder="Email"
                            />
                            <input
                                className="border rounded px-2 py-1"
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileChange}
                                placeholder="Phone"
                            />
                            <input
                                className="border rounded px-2 py-1"
                                name="education"
                                value={profileForm.education}
                                onChange={handleProfileChange}
                                placeholder="Education"
                            />
                            <input
                                className="border rounded px-2 py-1"
                                name="experience"
                                value={profileForm.experience}
                                onChange={handleProfileChange}
                                placeholder="Experience"
                            />
                            <input
                                className="border rounded px-2 py-1"
                                name="skills"
                                value={profileForm.skills}
                                onChange={handleProfileChange}
                                placeholder="Skills"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Applications
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.total}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                In Progress
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.pending}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hired</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.hired}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.rejected}
                            </p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${
                        activeTab === "jobs"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-blue-700 hover:bg-blue-50"
                    }`}
                    onClick={() => setActiveTab("jobs")}
                >
                    <Briefcase className="w-5 h-5" />
                    Available Jobs
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${
                        activeTab === "applications"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-blue-700 hover:bg-blue-50"
                    }`}
                    onClick={() => setActiveTab("applications")}
                >
                    <ClipboardList className="w-5 h-5" />
                    Application History
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${
                        activeTab === "saved"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-blue-700 hover:bg-blue-50"
                    }`}
                    onClick={() => setActiveTab("saved")}
                >
                    <Bookmark className="w-5 h-5" />
                    Saved Jobs
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "jobs" && (
                <>
                    {/* Search Bar */}
                    <div className="mb-6 flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search jobs by title, company, or location"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    {/* Resume upload input (hidden) */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    
                    {/* Processing Status */}
                    {uploading && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                            <div className="text-blue-700">
                                {processingStatus || "Processing your application..."}
                            </div>
                        </div>
                    )}
                    
                    {/* Error Message */}
                    {uploadError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <div className="text-red-700">{uploadError}</div>
                        </div>
                    )}
                    
                    {/* Success Message */}
                    {uploadSuccess && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div className="text-green-700">{uploadSuccess}</div>
                        </div>
                    )}
                    
                    {/* Job Listings */}
                    <div className="space-y-6">
                        {filteredJobs.length === 0 && (
                            <div className="text-gray-500 text-center py-10">
                                No jobs found.
                            </div>
                        )}
                        {filteredJobs.map((job) => {
                            const status = getJobStatus(job.id);
                            const isApplied = !!status;
                            const isSaved = savedJobs.includes(job.id);
                            return (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-blue-500" />
                                            {job.title}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" /> {job.company}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {job.location}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-gray-700">
                                            {job.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={() => handleApplyToggle(job)}
                                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                                isApplied
                                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                    : "bg-blue-600 text-white hover:bg-blue-500"
                                            }`}
                                            disabled={uploading}
                                        >
                                            {uploading && pendingJob?.id === job.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    Applying...
                                                </div>
                                            ) : (
                                                isApplied ? "Unapply" : "Apply Now"
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSaveJob(job.id)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                isSaved
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                            {isSaved ? "Saved" : "Save"}
                                        </button>
                                        {isApplied && (
                                            <span
                                                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    status
                                                )}`}
                                            >
                                                {getStatusIcon(status)}
                                                <span className="capitalize">{status}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {activeTab === "applications" && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Application History
                        </h2>
                        <span className="text-sm text-gray-500">
                            {applications.length === 0
                                ? "No applications yet."
                                : `${applications.length} job${applications.length > 1 ? "s" : ""} applied`}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Update
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {app.position}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {app.company}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                    app.status
                                                )}`}
                                            >
                                                {getStatusIcon(app.status)}
                                                <span className="capitalize">
                                                    {app.status}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.appliedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.lastUpdate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                                onClick={() => handleApplyToggle(jobs.find(j => j.id === app.jobId))}
                                            >
                                                Unapply
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-500 p-1 rounded ml-2">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No applications submitted yet. Start applying to jobs above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "saved" && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-800">Saved Jobs</h2>
                    {savedJobs.length === 0 ? (
                        <p className="text-gray-500">You haven't saved any jobs yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {jobs
                                .filter(job => savedJobs.includes(job.id))
                                .map(job => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                    >
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-blue-500" />
                                                {job.title}
                                            </h2>
                                            <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-4 h-4" /> {job.company}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" /> {job.location}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-gray-700">
                                                {job.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => handleSaveJob(job.id)}
                                                className="flex items-center gap-1 px-3 py-1 rounded bg-yellow-100 text-yellow-700"
                                            >
                                                <BookmarkCheck className="w-4 h-4" />
                                                Unsave
                                            </button>
                                            <button
                                                onClick={() => handleApplyToggle(job)}
                                                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                                    getJobStatus(job.id)
                                                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                        : "bg-blue-600 text-white hover:bg-blue-500"
                                                }`}
                                                disabled={uploading}
                                            >
                                                {getJobStatus(job.id) ? "Unapply" : "Apply Now"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
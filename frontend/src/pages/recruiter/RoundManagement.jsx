import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Plus,
    Edit,
    Trash2,
    Clock,
    Users,
    CheckCircle,
    AlertCircle,
    Calendar,
    MessageCircle,
    UploadCloud,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

const jobs = [
    { id: "job-1", title: "Senior Frontend Developer", department: "Engineering" },
    { id: "job-2", title: "Product Manager", department: "Product" },
    { id: "job-3", title: "UI/UX Designer", department: "Design" },
];

const candidatesByRound = {
    "1": { total: 15, completed: 12, pending: 3 },
    "2": { total: 12, completed: 8, pending: 4 },
    "3": { total: 8, completed: 5, pending: 3 },
    "4": { total: 5, completed: 2, pending: 3 },
};

const getRoundTypeColor = (type) => {
    switch (type) {
        case "screening":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "technical":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "hr":
            return "bg-green-100 text-green-800 border-green-200";
        case "final":
            return "bg-orange-100 text-orange-800 border-orange-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getRoundTypeIcon = (type) => {
    switch (type) {
        case "screening":
            return <Users className="w-4 h-4" />;
        case "technical":
            return <CheckCircle className="w-4 h-4" />;
        case "hr":
            return <MessageCircle className="w-4 h-4" />;
        case "final":
            return <AlertCircle className="w-4 h-4" />;
        default:
            return <Clock className="w-4 h-4" />;
    }
};

const RoundManagement = () => {
    const [selectedJob, setSelectedJob] = useState("job-1");
    const [rounds, setRounds] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRound, setEditingRound] = useState(null);
    const [form, setForm] = useState({
        name: "",
        type: "screening",
        description: "",
        duration: 60,
        order: 1,
    });

    // Resume parsing states
    const [resumeFile, setResumeFile] = useState(null);
    const [jobId, setJobId] = useState("");
    const [parsedText, setParsedText] = useState("");
    const [structured, setStructured] = useState(null);
    const [sheetResult, setSheetResult] = useState(null);
    const [resumeStep, setResumeStep] = useState(1);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeError, setResumeError] = useState("");

    // Shortlisting states
    const [filters, setFilters] = useState([{ column: "", operator: "=", value: "" }]);
    const [limit, setLimit] = useState("");
    const [offset, setOffset] = useState("");
    const [shortlistResult, setShortlistResult] = useState(null);
    const [shortlistLoading, setShortlistLoading] = useState(false);
    const [shortlistError, setShortlistError] = useState("");

    // Fetch rounds from backend
    useEffect(() => {
        axios
            .get(`${API_BASE}/rounds`, { params: { job_id: selectedJob } })
            .then((res) => setRounds(res.data))
            .catch(() => setRounds([]));
    }, [selectedJob]);

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Open modal for create or edit
    const openModal = (round = null) => {
        setEditingRound(round);
        setForm(
            round
                ? { ...round }
                : {
                      name: "",
                      type: "screening",
                      description: "",
                      duration: 60,
                      order: rounds.length + 1,
                  }
        );
        setShowCreateModal(true);
    };

    // Create or update round
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingRound) {
            await axios.put(`${API_BASE}/rounds/${editingRound.id}`, {
                ...form,
                jobId: selectedJob,
            });
        } else {
            await axios.post(`${API_BASE}/rounds`, {
                ...form,
                jobId: selectedJob,
            });
        }
        setShowCreateModal(false);
        setEditingRound(null);
        const res = await axios.get(`${API_BASE}/rounds`, { params: { job_id: selectedJob } });
        setRounds(res.data);
    };

    // Delete round
    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE}/rounds/${id}`);
        setRounds(rounds.filter((r) => r.id !== id));
    };

    // Resume upload/parse/structure/save handlers
    const handleResumeFileChange = (e) => {
        setResumeFile(e.target.files[0]);
        setResumeError("");
        setResumeStep(1);
        setParsedText("");
        setStructured(null);
        setSheetResult(null);
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return setResumeError("Please select a file.");
        setResumeLoading(true);
        setResumeError("");
        try {
            const formData = new FormData();
            formData.append("file", resumeFile);
            const res = await axios.post(`${API_BASE}/upload`, formData);
            setJobId(res.data.job_id);
            setResumeStep(2);
        } catch (err) {
            setResumeError("Upload failed.");
        }
        setResumeLoading(false);
    };

    const handleResumeParse = async () => {
        if (!jobId) return setResumeError("No job ID.");
        setResumeLoading(true);
        setResumeError("");
        try {
            const res = await axios.get(`${API_BASE}/parse/${jobId}`);
            setParsedText(res.data.parsed_text);
            setResumeStep(3);
        } catch (err) {
            setResumeError("Parsing failed.");
        }
        setResumeLoading(false);
    };

    const handleResumeStructure = async () => {
        if (!parsedText) return setResumeError("No parsed text.");
        setResumeLoading(true);
        setResumeError("");
        try {
            const res = await axios.post(`${API_BASE}/structure`, { text: parsedText });
            setStructured(res.data.structured);
            setResumeStep(4);
        } catch (err) {
            setResumeError("Structuring failed.");
        }
        setResumeLoading(false);
    };

    const handleResumeSave = async () => {
        if (!structured) return setResumeError("No structured data.");
        setResumeLoading(true);
        setResumeError("");
        try {
            const res = await axios.post(`${API_BASE}/save`, structured);
            setSheetResult(res.data.result);
            setResumeStep(5);
        } catch (err) {
            setResumeError("Saving to Sheets failed.");
        }
        setResumeLoading(false);
    };

    // Shortlisting handlers
    const handleFilterChange = (idx, field, value) => {
        setFilters((prev) =>
            prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
        );
    };
    const addFilter = () => setFilters((prev) => [...prev, { column: "", operator: "=", value: "" }]);
    const removeFilter = (idx) => setFilters((prev) => prev.filter((_, i) => i !== idx));

    const handleShortlist = async () => {
        setShortlistLoading(true);
        setShortlistError("");
        setShortlistResult(null);
        // Build filters dict
        let filtersDict = {};
        filters.forEach((f) => {
            if (f.column && f.operator && f.value) {
                let val = f.value;
                if (!isNaN(val)) val = Number(val);
                if (filtersDict[f.column]) {
                    filtersDict[f.column][f.operator] = val;
                } else {
                    filtersDict[f.column] = { [f.operator]: val };
                }
            }
        });
        try {
            const res = await axios.post(`${API_BASE}/shortlist`, {
                filters: filtersDict,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            });
            setShortlistResult(res.data);
        } catch (err) {
            setShortlistError("Shortlisting failed.");
        }
        setShortlistLoading(false);
    };

    const parseBtnRef = useRef(null);
    const structureBtnRef = useRef(null);
    const saveBtnRef = useRef(null);

    // Auto-click parse, structure, save buttons on mount or when needed
    useEffect(() => {
        if (parseBtnRef.current) parseBtnRef.current.click();
        if (structureBtnRef.current) structureBtnRef.current.click();
        if (saveBtnRef.current) saveBtnRef.current.click();
    }, []);

    const filteredRounds = rounds;

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Interview Round Management
                </h1>
                <p className="text-gray-600">
                    Configure and manage interview rounds for your job openings
                </p>
            </div>

            {/* Resume Upload & Parsing Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" /> Resume/Intake Form Parsing
                </h2>
                {resumeError && <div className="text-red-600 mb-2">{resumeError}</div>}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <input
                        type="file"
                        accept=".pdf,.docx,.jpg,.png,.jpeg"
                        onChange={handleResumeFileChange}
                        className="mb-2"
                    />
                    <button
                        onClick={handleResumeUpload}
                        disabled={resumeLoading || !resumeFile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        {resumeLoading && resumeStep === 1 ? "Uploading..." : "Upload"}
                    </button>
                    {jobId && (
                        <button
                            ref={parseBtnRef}
                            onClick={handleResumeParse}
                            disabled={resumeLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                            {resumeLoading && resumeStep === 2 ? "Parsing..." : "Parse"}
                        </button>
                    )}
                    {parsedText && (
                        <button
                            ref={structureBtnRef}
                            onClick={handleResumeStructure}
                            disabled={resumeLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            {resumeLoading && resumeStep === 3 ? "Structuring..." : "Structure"}
                        </button>
                    )}
                    {structured && (
                        <button
                            ref={saveBtnRef}
                            onClick={handleResumeSave}
                            disabled={resumeLoading}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                            {resumeLoading && resumeStep === 4 ? "Saving..." : "Save to Sheets"}
                        </button>
                    )}
                </div>
                {parsedText && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Parsed Text (Markdown):</h4>
                        <textarea
                            value={parsedText}
                            readOnly
                            rows={6}
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                )}
                {structured && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Structured Candidate Data (Gemini):</h4>
                        <pre className="bg-gray-100 rounded-lg p-2 overflow-x-auto">
                            {JSON.stringify(structured, null, 2)}
                        </pre>
                    </div>
                )}
                {sheetResult && (
                    <div className="mt-4 text-green-700 font-semibold">
                        ✅ Data saved to Google Sheets!
                        <pre>{JSON.stringify(sheetResult, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Shortlisting Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidate Shortlisting</h2>
                {shortlistError && <div className="text-red-600 mb-2">{shortlistError}</div>}
                <div className="space-y-2">
                    {filters.map((f, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Column"
                                value={f.column}
                                onChange={(e) => handleFilterChange(idx, "column", e.target.value)}
                                className="border px-2 py-1 rounded"
                            />
                            <select
                                value={f.operator}
                                onChange={(e) => handleFilterChange(idx, "operator", e.target.value)}
                                className="border px-2 py-1 rounded"
                            >
                                <option value="=">=</option>
                                <option value=">">{">"}</option>
                                <option value="<">{"<"}</option>
                                <option value=">=">{">="}</option>
                                <option value="<=">{"<="}</option>
                                <option value="!=">!=</option>
                                <option value="contains">contains</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Value"
                                value={f.value}
                                onChange={(e) => handleFilterChange(idx, "value", e.target.value)}
                                className="border px-2 py-1 rounded"
                            />
                            <button
                                onClick={() => removeFilter(idx)}
                                className="text-red-600 px-2"
                                disabled={filters.length === 1}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addFilter}
                        className="text-blue-600 px-2 py-1"
                    >
                        + Add Filter
                    </button>
                </div>
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Limit (optional)"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Offset (optional)"
                        value={offset}
                        onChange={(e) => setOffset(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        onClick={handleShortlist}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={shortlistLoading}
                    >
                        {shortlistLoading ? "Shortlisting..." : "Fetch & Shortlist"}
                    </button>
                </div>
                {shortlistResult && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Filtered Rows</h4>
                        <table className="min-w-full border">
                            <thead>
                                <tr>
                                    {shortlistResult.headers &&
                                        shortlistResult.headers.map((h, i) => (
                                            <th key={i} className="border px-2 py-1">{h}</th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {shortlistResult.rows &&
                                    shortlistResult.rows.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j} className="border px-2 py-1">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="mt-2 text-green-700">{shortlistResult.message}</div>
                    </div>
                )}
            </div>

            {/* Job Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Job Opening
                        </label>
                        <select
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title} - {job.department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Round</span>
                    </button>
                </div>
            </div>

            {/* Rounds Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rounds List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Interview Rounds
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filteredRounds.map((round) => (
                                <div
                                    key={round.id}
                                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                                                {round.order}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {round.name}
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoundTypeColor(
                                                            round.type
                                                        )}`}
                                                    >
                                                        {getRoundTypeIcon(round.type)}
                                                        <span className="capitalize">{round.type}</span>
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 mb-3">
                                                    {round.description}
                                                </p>

                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{round.duration} minutes</span>
                                                    </div>

                                                    {candidatesByRound[round.id] && (
                                                        <div className="flex items-center space-x-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>
                                                                {candidatesByRound[round.id].completed}/
                                                                {candidatesByRound[round.id].total} completed
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openModal(round)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(round.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {candidatesByRound[round.id] && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="text-gray-900 font-medium">
                                                    {Math.round(
                                                        (candidatesByRound[round.id].completed /
                                                            candidatesByRound[round.id].total) *
                                                            100
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${(candidatesByRound[round.id].completed /
                                                            candidatesByRound[round.id].total) *
                                                            100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Round Statistics + Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Round Statistics
                        </h3>

                        <div className="space-y-4">
                            {filteredRounds.map((round) => {
                                const stats = candidatesByRound[round.id];
                                if (!stats) return null;

                                return (
                                    <div
                                        key={round.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {round.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {stats.pending} pending
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                {stats.completed}/{stats.total}
                                            </p>
                                            <p className="text-xs text-gray-500">completed</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h3>

                        <div className="space-y-3">
                            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Schedule Interviews
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Bulk schedule for pending candidates
                                    </p>
                                </div>
                            </button>

                            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Send Notifications
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Update candidates on next steps
                                    </p>
                                </div>
                            </button>

                            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Review Results
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Evaluate completed interviews
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Round Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingRound ? "Edit Round" : "Create New Round"}
                            </h2>
                        </div>

                        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Round Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Technical Interview"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Round Type *
                                    </label>
                                    <select
                                        name="type"
                                        required
                                        value={form.type}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="screening">Screening</option>
                                        <option value="technical">Technical</option>
                                        <option value="hr">HR Interview</option>
                                        <option value="final">Final Round</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={form.description}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe what this round involves..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        required
                                        value={form.duration}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order *
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        required
                                        value={form.order}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingRound(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                                >
                                    {editingRound ? "Update Round" : "Create Round"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoundManagement;
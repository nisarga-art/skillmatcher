// src/pages/Jobs.jsx
import React, { useEffect, useState } from "react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingJobId, setUploadingJobId] = useState(null);
  const [matchResults, setMatchResults] = useState({});
  const [resumes, setResumes] = useState([]);
  const [improvedResume, setImprovedResume] = useState({});
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchJobs();
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeParse = (value, fallback = []) => {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      let cleaned = value.trim();
      if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = cleaned.replace(/\\"/g, '"');
      cleaned = cleaned.replace(/\\'/g, "'");
      cleaned = cleaned.replace(/\\n/g, "");
      cleaned = cleaned.replace(/\\r/g, "");
      cleaned = cleaned.replace(/\\t/g, " ");
      cleaned = cleaned.replace(/\\\\/g, "\\");

      try {
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch (err) {
        const maybeList = cleaned.split(",").map((s) => s.trim()).filter(Boolean);
        return maybeList.length ? maybeList : fallback;
      }
    }
    return fallback;
  };

  const fetchJobs = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`${API_BASE}/jobs/`);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      let data = await res.json();
      console.log("📨 Raw jobs response:", data);

      if (data && typeof data === "object" && !Array.isArray(data) && Array.isArray(data.jobs)) {
        data = data.jobs;
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected jobs response format (expected array or { jobs: [...] })");
      }

      const cleaned = data.map((job) => ({
        ...job,
        requirements: safeParse(job?.requirements, []),
        skills: safeParse(job?.skills, []),
      }));

      setJobs(cleaned);
      console.log("✅ Cleaned jobs:", cleaned);
    } catch (err) {
      console.error("❌ Jobs fetch error:", err);
      setFetchError(String(err.message || err));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API_BASE}/resumes/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResumes(data.uploaded_resumes || []);
    } catch (err) {
      console.warn("⚠️ Resume fetch error:", err);
    }
  };

  const showToast = (msg, type = "info") => {
    const color =
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-pink-500";

    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = `${color} text-white px-4 py-2 rounded-lg fixed bottom-5 right-5 shadow-lg z-50`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleFileChange = (jobId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [jobId]: file }));
  };

  const handleApply = async (jobId) => {
    const file = selectedFiles[jobId];
    if (!file) {
      showToast("⚠️ Please select a resume file before uploading.", "error");
      return;
    }

    setUploadingJobId(jobId);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", jobId);
    formData.append("uploaded_by", "User1");

    try {
      const res = await fetch(`${API_BASE}/resumes/upload`, {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Upload succeeded but response JSON parsing failed");
      }

      if (!res.ok) {
        const errMsg = data?.detail || data?.message || `Upload failed (status ${res.status})`;
        throw new Error(errMsg);
      }

      setMatchResults((prev) => ({ ...prev, [jobId]: data || {} }));
      setImprovedResume((prev) => ({ ...prev, [jobId]: data?.improved_resume || "" }));
      setSelectedFiles((prev) => ({ ...prev, [jobId]: null }));

      fetchResumes();

      showToast("✅ Resume uploaded and analyzed!", "success");

      setTimeout(() => {
        const el = document.getElementById(`result-${jobId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    } catch (err) {
      console.error("❌ Upload error:", err);
      showToast(`❌ ${err.message || "Upload failed"}`, "error");
    } finally {
      setUploadingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-700 text-lg">
        ⏳ Loading jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-pink-700 mb-12">💼 Job Listings</h1>

        {fetchError && (
          <div className="mb-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Failed to load jobs: {fetchError}</p>
            <button
              onClick={() => fetchJobs()}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Retry
            </button>
          </div>
        )}

        {jobs.length === 0 && !fetchError && (
          <p className="text-center text-gray-600 text-lg mb-6">❌ No jobs available</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const reqs = Array.isArray(job.requirements) ? job.requirements : [];
            const skills = Array.isArray(job.skills) ? job.skills : [];

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-md p-6 border border-pink-100 hover:shadow-pink-200 transition"
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-3">{job.description}</p>

                <p className="text-sm text-gray-700">📈 Demand: <b>{job.demand || "N/A"}</b></p>
                <p className="text-sm text-gray-700 mb-3">💰 Avg Salary: <b>{job.avg_salary || "N/A"}</b></p>

                <div className="mt-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileChange(job.id, e.target.files?.[0])}
                    className="block w-full text-sm text-gray-600"
                  />

                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={uploadingJobId === job.id}
                    className={`mt-3 px-4 py-2 rounded-lg text-sm text-white shadow-sm ${
                      uploadingJobId === job.id ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                    }`}
                  >
                    {uploadingJobId === job.id ? "⏳ Uploading..." : "🚀 Upload & Analyze"}
                  </button>
                </div>

                {matchResults[job.id]?.recommendations?.length > 0 && (
                  <div id={`result-${job.id}`} className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    <p className="font-semibold text-green-700 mb-2">🧠 Resume Analysis Result:</p>
                    {matchResults[job.id].recommendations.map((rec, i) => (
                      <div key={i} className="p-2 mb-2 border-b border-green-100 last:border-none">
                        <p className="text-pink-700 font-semibold">🎯 {rec.title} — Match Score: {rec.match_percent}%</p>
                        <p>✅ <strong>Matched:</strong> {rec.matched_skills?.length ? rec.matched_skills.join(", ") : "None"}</p>
                        <p>⚠️ <strong>Missing:</strong> {rec.missing_skills?.length ? rec.missing_skills.join(", ") : "None"}</p>
                        <p>📈 Demand: {rec.demand || "N/A"}</p>
                        <p>💰 Average Salary: {rec.avg_salary || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                )}

                {improvedResume[job.id] && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                    <p className="font-semibold text-blue-700 mb-2">📝 Improved Resume:</p>
                    <pre className="whitespace-pre-wrap text-xs">{improvedResume[job.id]}</pre>

                    {matchResults[job.id]?.resume_id && (
                      <a
                        href={`${API_BASE}/resumes/download/${matchResults[job.id].resume_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                      >
                        📥 Download Improved Resume
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <h4 className="font-semibold text-gray-800 mb-2">📂 Uploaded Resumes</h4>
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {resumes.length === 0 ? <li>No resumes uploaded yet</li> : resumes.map((r, idx) => <li key={idx}>{r}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
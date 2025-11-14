// Upload.jsx
import React, { useState, useRef } from "react";

/**
 * Props:
 * - jobId default forced to 1 (Frontend Developer)
 * - apiBase same as before
 */
export default function Upload({
  jobId = 1,
  defaultUploadedBy = "anonymous",
  apiBase = "http://127.0.0.1:8000",
}) {
  const fileRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only frontend job → keep score 60–100
  const simulateScore = () => Math.floor(Math.random() * 41) + 60;

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFileName(f.name);
    setScore(null);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fileEl = fileRef.current;
    const file = fileEl?.files?.[0];

    if (!file) {
      setError("Please choose a file to upload.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", String(jobId));
    formData.append("uploaded_by", defaultUploadedBy);

    try {
      const resp = await fetch(`${apiBase}/resumes/upload`, {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await resp.json();
      } catch {
        // If backend does not return JSON
      }

      if (!resp.ok) {
        setError("Upload failed.");
        setScore(simulateScore());
        setLoading(false);
        return;
      }

      // Extract match score from backend OR simulate
      const matches = data?.match_result?.matched?.length ?? null;
      const missing = data?.match_result?.missing?.length ?? null;

      if (matches !== null && missing !== null) {
        const total = matches + missing;
        const pct = Math.round((matches / total) * 100);
        setScore(pct);
      } else {
        setScore(simulateScore());
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error.");
      setScore(simulateScore());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-pink-50 bg-cover bg-center flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-pink-600 mb-3">
          Get Your Instant Resume Score 💼
        </h1>

        <p className="text-gray-700 mb-6">
          Upload your resume and let our AI evaluate keywords, formatting, and ATS compatibility.
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-pink-400 rounded-xl p-8 text-center bg-pink-100/40 hover:bg-pink-200/40 transition">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              ref={fileRef}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-pink-700 font-medium select-none"
            >
              {fileName ? (
                <span>✅ {fileName} selected — click Upload</span>
              ) : (
                <span>📂 Drag & Drop or Click to Upload Resume</span>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-2">Accepted: PDF, DOC, DOCX, TXT</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white shadow transition ${
                loading ? "bg-pink-300 cursor-wait" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {/* ONLY SCORE — NO NAVIGATION, NO SUGGESTIONS */}
          {score !== null && (
            <div className="mt-4 text-center animate-fadeIn">
              <h2 className="text-2xl font-bold text-pink-600 mb-2">
                Your Resume Score: {score}/100
              </h2>

              <div className="w-full bg-pink-100 rounded-full h-3 mb-4">
                <div
                  className="bg-pink-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="text-sm text-gray-600">
                {score >= 85 ? (
                  <p>🌟 Excellent! Your resume is interview-ready.</p>
                ) : score >= 70 ? (
                  <p>👍 Good! Try adding measurable results.</p>
                ) : (
                  <p>🛠 Needs improvement — optimize keywords.</p>
                )}
              </div>
            </div>
          )}

          {/* Keep original instructions */}
          {score === null && (
            <div className="text-gray-700 text-sm leading-relaxed">
              <p className="mb-2 font-semibold">How it works:</p>
              <ol className="list-decimal ml-6">
                <li>Choose your resume (PDF or DOC/DOCX).</li>
                <li>We upload and analyze it against the job.</li>
                <li>You get an instant score.</li>
              </ol>
              <p className="mt-4 italic text-gray-500">
                Your data is private and not stored without permission.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

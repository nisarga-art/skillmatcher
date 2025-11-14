import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Suggestions() {
  const location = useLocation();
  const navigate = useNavigate();

  // From navigation
  const passedRecommendations = location.state?.recommendations || null;
  const passedResumeId = location.state?.resume_id || null;

  // Local state
  const [recommendations, setRecommendations] = useState(passedRecommendations);
  const [loading, setLoading] = useState(!passedRecommendations); // loading only if nothing passed
  const [error, setError] = useState("");

  // Resume ID fallback: from location OR localStorage
  const resumeId =
    passedResumeId || localStorage.getItem("last_resume_id") || null;

  // Fetch suggestions when page reloads or state missing
  useEffect(() => {
    if (!recommendations) {
      if (!resumeId) {
        setError("No resume found. Please upload again.");
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          const resp = await fetch(
            `http://127.0.0.1:8000/resumes/${resumeId}/suggestions`
          );

          if (!resp.ok) {
            setError("Failed to load suggestions. Please upload again.");
            setLoading(false);
            return;
          }

          const data = await resp.json();
          setRecommendations(data.recommendations || []);
        } catch (err) {
          console.error(err);
          setError("Network error. Try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [resumeId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto fade-in">
        <h1 className="text-4xl font-bold text-center text-pink-700 mb-8">
          💡 Resume Improvement Suggestions
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center mt-10 text-pink-600 text-lg">
            ⏳ Loading your suggestions...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <p className="text-center text-red-600 mt-10">{error}</p>
        )}

        {/* Suggestions List */}
        {!loading && !error && recommendations && recommendations.length > 0 && (
          <div className="space-y-6">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md border border-pink-100 hover:shadow-pink-200 transition-all"
              >
                <h2 className="text-lg font-semibold text-pink-600 mb-2">
                  🎯 {rec.title}
                </h2>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Match Score:</strong> {rec.match_percent}%
                </p>

                <p className="text-sm text-green-700 mb-1">
                  ✅ <strong>Matched Skills:</strong>{" "}
                  {rec.matched_skills?.length
                    ? rec.matched_skills.join(", ")
                    : "None"}
                </p>

                <p className="text-sm text-red-600">
                  ⚠️ <strong>Missing Skills:</strong>{" "}
                  {rec.missing_skills?.length
                    ? rec.missing_skills.join(", ")
                    : "None"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No suggestions */}
        {!loading &&
          !error &&
          recommendations &&
          recommendations.length === 0 && (
            <p className="text-center text-gray-600 mt-10">
              No suggestions found. Try uploading your resume again.
            </p>
          )}

        {/* Back button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/jobs")}
            className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md"
          >
            🔙 Back to Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

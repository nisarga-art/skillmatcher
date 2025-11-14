import React from "react";
import { useLocation, Link } from "react-router-dom";

const Recommendations = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-600">
        ⚠️ No recommendation data found. Please upload your resume again.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">
        🧠 Resume Analysis Results
      </h1>

      <p className="mb-4 text-gray-700">{data.message}</p>

      {Array.isArray(data.recommendations) ? (
        data.recommendations.map((rec, i) => (
          <div
            key={i}
            className="p-4 mb-4 border rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">{rec.title}</h2>
            <p>🎯 Match: {rec.match_percent}%</p>
            <p>✅ Matched Skills: {rec.matched_skills.join(", ")}</p>
            <p>❌ Missing Skills: {rec.missing_skills.join(", ")}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">{data.recommendations}</p>
      )}

      <div className="mt-6">
        <Link
          to="/jobs"
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
        >
          🔙 Back to Jobs
        </Link>
      </div>
    </div>
  );
};

export default Recommendations;

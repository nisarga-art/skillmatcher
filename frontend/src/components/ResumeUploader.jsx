// import { useState } from "react";
// import axios from "axios";

// export default function ResumeUploader({ onUploadComplete }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a file");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Backend endpoint for uploading resumes
//       const res = await axios.post("http://127.0.0.1:8000/api/v1/resumes/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       onUploadComplete(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload resume");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="border rounded-md p-2"
//       />
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
//       >
//         {loading ? "Uploading..." : "Upload Resume"}
//       </button>
//     </form>
//   );
// }

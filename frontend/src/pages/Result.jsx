// import { useEffect, useState } from "react";

// export default function Result() {
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("matchResult"));
//     setResult(data || { match_score: 0, missing_skills: [], strengths: [] });
//   }, []);

//   if (!result)
//     return <div className="p-10 text-center">No result found. Please upload a resume.</div>;

//   return (
//     <div className="p-10 bg-gray-50 min-h-screen flex flex-col items-center">
//       <h2 className="text-2xl font-bold text-indigo-700 mb-8">Your Match Result</h2>

//       <div className="bg-white p-8 rounded-xl shadow w-full max-w-xl">
//         <p className="text-xl font-semibold text-center mb-4">
//           Match Score: <span className="text-indigo-600">{result.match_score}%</span>
//         </p>

//         <div className="mb-4">
//           <h3 className="font-semibold mb-2 text-gray-700">Strengths:</h3>
//           <ul className="list-disc list-inside text-gray-600">
//             {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
//           </ul>
//         </div>

//         <div>
//           <h3 className="font-semibold mb-2 text-gray-700">Missing Skills:</h3>
//           <ul className="list-disc list-inside text-gray-600">
//             {result.missing_skills?.map((m, i) => <li key={i}>{m}</li>)}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

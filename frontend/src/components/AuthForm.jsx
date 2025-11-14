// export default function AuthForm({ type }) {
//   const isLogin = type === "login";

//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         {isLogin ? "Sign In" : "Create Account"}
//       </h2>
//       <form className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//         >
//           {isLogin ? "Sign In" : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// }

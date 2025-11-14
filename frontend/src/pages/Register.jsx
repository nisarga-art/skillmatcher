import React from "react";
import bgImage from "../assets/loginpage.jpg"; // ✅ Use loginpage.jpg for Register page

export default function Register() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`, // ✅ Background set to loginpage.jpg
      }}
    >
      {/* Soft pink overlay */}
      <div className="absolute inset-0 bg-pink-100/60 backdrop-blur-sm"></div>

      {/* Register Card */}
      <div className="relative max-w-md w-full bg-white/90 rounded-2xl shadow-lg border border-pink-200 p-8 z-10">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Create Account 
        </h2>

        <form className="grid gap-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Full Name</span>
            <input
              className="mt-1 block w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              type="text"
              placeholder="John Doe"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              className="mt-1 block w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              className="mt-1 block w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              type="password"
              placeholder="••••••••"
            />
          </label>

          <button className="mt-2 w-full py-2.5 rounded-md bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium hover:from-pink-600 hover:to-pink-700 shadow-md transition">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/image.jpg"; // ✅ adjust filename if different

export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`, // ✅ fixed variable name
      }}
    >
      {/* Overlay for soft pink tint */}
      <div className="absolute inset-0 bg-pink-100/60 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative max-w-md w-full bg-white/90 rounded-2xl shadow-lg border border-pink-200 p-8 z-10">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Welcome Back 👋
        </h2>

        <form className="grid gap-5">
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
            Sign In
          </button>

          <div className="text-sm text-center text-gray-600 mt-3">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 font-medium hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

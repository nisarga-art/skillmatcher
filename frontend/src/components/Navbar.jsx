import React from "react";
import { NavLink } from "react-router-dom";

const Link = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-pink-500 text-white shadow-md"
          : "text-gray-700 hover:text-pink-600 hover:bg-pink-100"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-200 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            SM
          </div>
          <div className="font-semibold text-lg text-pink-700 tracking-wide">
            Skillmatcher
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-2">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          {/* <Link to="/recruiter">Recruiter</Link> */}
        </nav>
      </div>
    </header>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recruiter from "./pages/Recruiter";
import Features from "./pages/Features";
import Recommendations from "./pages/Recommendations";
import Suggestions from "./pages/Suggestions";



const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-500">SkillMatcher</div>
        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "text-white bg-pink-500" : "text-gray-700 hover:text-pink-500"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "text-white bg-pink-500" : "text-gray-700 hover:text-pink-500"
              }`
            }
          >
            Jobs
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "text-white bg-pink-500" : "text-gray-700 hover:text-pink-500"
              }`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/recruiter"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "text-white bg-pink-500" : "text-gray-700 hover:text-pink-500"
              }`
            }
          >
            Recruiter
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "text-white bg-pink-500" : "text-gray-700 hover:text-pink-500"
              }`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "text-white bg-pink-500" : "text-gray-700 hover:text-pink-500"
              }`
            }
          >
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recruiter" element={<Recruiter />} />
          <Route path="/features" element={<Features />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/suggestions" element={<Suggestions />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;

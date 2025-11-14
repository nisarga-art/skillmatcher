// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple reusable button and card components
const Button = ({ children, onClick, variant = "solid", className = "" }) => {
  const base =
    variant === "outline"
      ? "border border-pink-400 text-pink-600 hover:bg-pink-100"
      : "bg-pink-500 text-white hover:bg-pink-600";
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg transition-all duration-200 shadow ${base} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer border border-pink-200 rounded-xl hover:shadow-lg transition bg-white"
  >
    <div className="p-8 text-center">{children}</div>
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

// ChatBox Component
const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I can help with resume & job questions." },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const toggleChat = () => setOpen(!open);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const text = input.toLowerCase();
    let reply = "❌ I can only assist with resume and job-related queries.";
    if (
      ["resume", "cv", "ats", "skills", "format", "improve"].some((k) =>
        text.includes(k)
      )
    ) {
      reply =
        "💼 Need resume help? I can guide you to improve formatting, skills, and ATS score!";
    } else if (
      ["job", "interview", "career", "apply", "role"].some((k) =>
        text.includes(k)
      )
    ) {
      reply =
        "💼 I can help you explore job roles and give interview advice!";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 400);

    setInput("");
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  return (
    <>
      {!open && (
        <button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 text-2xl z-50"
        >
          💬
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 w-80 bg-white border border-pink-200 rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex justify-between items-center bg-pink-500 text-white p-3 rounded-t-lg">
            <span>💬 SkillMatcher Chat</span>
            <button onClick={toggleChat} className="text-xl font-bold">
              ❌
            </button>
          </div>

          <div className="p-3 flex-1 overflow-y-auto max-h-80">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    m.sender === "user"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about resume or jobs..."
              className="flex-1 p-2 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-pink-500 text-white px-4 rounded-br-lg hover:bg-pink-600"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Home Page
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full">
      {/* HERO */}
      <section className="bg-pink-50 py-20 px-6 text-center w-full">
        <h1 className="text-4xl font-bold text-gray-800">
          Land Your Dream Job with{" "}
          <span className="text-pink-500">SkillMatcher</span> 🚀
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          AI-powered platform to match your resume with the right jobs and
          improve your chances.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => navigate("/upload")}>📄 Upload Resume</Button>
          <Button onClick={() => navigate("/features")} variant="outline">
            Explore Features
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 w-full max-w-5xl px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          How It Works ⚙️
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card onClick={() => navigate("/upload")}>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">1️⃣ Upload</h3>
              <p className="text-gray-600 text-sm">
                Upload your resume and let our AI analyze it instantly.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">2️⃣ Get Insights</h3>
              <p className="text-gray-600 text-sm">
                Receive resume score, strengths, and areas to improve.
              </p>
            </CardContent>
          </Card>
          <Card onClick={() => navigate("/jobs")}>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">3️⃣ Apply Smart</h3>
              <p className="text-gray-600 text-sm">
                Get personalized job matches based on your skills.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-pink-50 py-20 w-full px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Core Features</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          • Resume Scoring <br />
          • Keyword Optimization <br />
          • ATS Compatibility <br />
          • Personalized Job Recommendations
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Level Up?
        </h2>
        <p className="text-gray-600 mb-6">
          Upload your resume and get a free AI-powered score instantly.
        </p>
        <Button onClick={() => navigate("/upload")}>🚀 Get Started</Button>
      </section>

      {/* RECRUITER */}
      <section className="py-20 bg-white w-full text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Are You a Recruiter?
        </h2>
        <p className="text-gray-600 mb-6">
          Find top candidates matched perfectly to your job listings.
        </p>
        <Button onClick={() => navigate("/recruiter")}>👤 Find Candidates</Button>
      </section>

      {/* FOOTER */}
      <footer className="bg-pink-50 py-6 text-center w-full text-gray-500 text-sm">
        © {new Date().getFullYear()} SkillMatcher. All rights reserved.
      </footer>

      {/* CHATBOX */}
      <ChatBox />
    </div>
  );
};

export default Home;

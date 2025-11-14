import React, { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I can answer questions about resumes and jobs. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const text = input.toLowerCase();
    let botReply = "Sorry, I can only help with resume and job-related questions.";

    // Resume keywords
    const resumeKeywords = ["resume", "cv", "cover letter", "ats", "experience", "skills", "formatting", "strengths", "improvement"];
    // Job keywords
    const jobKeywords = ["job", "position", "role", "career", "hiring", "vacancy", "opportunity", "application", "interview"];

    if (resumeKeywords.some(keyword => text.includes(keyword))) {
      botReply = "I can help you improve your resume, cover letter, check formatting, optimize for ATS, and highlight your skills and experience.";
    } else if (jobKeywords.some(keyword => text.includes(keyword))) {
      botReply = "I can suggest jobs that match your skills, provide tips for applications, and guide you for interviews.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white border border-pink-200 rounded-lg shadow-lg flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto max-h-96">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender === "user" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about resumes or jobs..."
          className="flex-1 p-2 rounded-bl-lg focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 text-white px-4 rounded-br-lg hover:bg-pink-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

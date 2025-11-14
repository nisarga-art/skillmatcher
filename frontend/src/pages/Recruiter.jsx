import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Recruiter = () => {
  const recruiterSteps = [
    {
      step: "1",
      title: "Post Your Job",
      desc: "Create job postings with role-specific requirements to attract top talent quickly.",
    },
    {
      step: "2",
      title: "Get AI Matches",
      desc: "Our AI scans resumes and provides you with the best candidates tailored to your needs.",
    },
    {
      step: "3",
      title: "Hire with Confidence",
      desc: "Review detailed candidate insights and make data-driven hiring decisions efficiently.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* HERO SECTION */}
      <section className="w-full bg-pink-50 py-20 px-6 text-center md:text-left md:flex md:items-center md:justify-between">
        <div className="max-w-xl mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Find the <span className="text-pink-500">Perfect Candidates</span> with AI
          </h1>
          <p className="mt-4 text-gray-600">
            Post jobs, get instant AI-powered candidate matches, and hire efficiently. Our
            platform helps recruiters save time and make smarter hiring decisions.
          </p>
          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow">
              Post a Job
            </Button>
            <Button
              variant="outline"
              className="border-pink-400 text-pink-600 hover:bg-pink-100 px-6 py-3 rounded-lg"
            >
              Explore Features
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="hidden md:block max-w-md">
          <div className="rounded-2xl border-2 border-pink-200 p-4 shadow-md bg-white">
            <div className="text-center font-medium text-gray-700">
              Candidate Match Score:{" "}
              <span className="text-pink-500 font-bold">87%</span>
            </div>
            <div className="h-4 bg-pink-100 rounded-full mt-2">
              <div className="h-4 bg-pink-500 rounded-full w-[87%]" />
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center">
              Our AI identifies the most suitable candidates for your job postings 🎯
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Recruit Smarter in{" "}
          <span className="text-pink-500">Three Simple Steps</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {recruiterSteps.map((item) => (
            <Card
              key={item.step}
              className="border border-pink-200 hover:shadow-lg transition"
            >
              <CardContent className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-gray-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 text-center px-6 bg-pink-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to <span className="text-pink-500">Hire Smarter</span>?
        </h2>
        <p className="text-gray-600 mb-8">
          Post your job and let AI match you with the best candidates instantly.
        </p>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-4 rounded-lg shadow-lg">
          Post a Job Now
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="bg-pink-50 w-full py-6 text-center text-gray-500 text-sm">
        © 2025 SkillMatcher. All rights reserved. | Privacy Policy | Terms of Service
      </footer>
    </div>
  );
};

export default Recruiter;

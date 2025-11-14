import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const featuresList = [
    {
      title: "AI-Powered Resume Scoring",
      desc: "Get instant insights into your resume’s strengths and weaknesses.",
    },
    {
      title: "Role-Specific Suggestions",
      desc: "Receive targeted suggestions for improving your resume for specific job roles.",
    },
    {
      title: "Candidate Matching (Recruiters)",
      desc: "AI matches the right candidates to the right jobs efficiently.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <h1 className="text-4xl font-bold text-pink-500 mb-8">Our Features</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        {featuresList.map((feature, index) => (
          <Card key={index} className="border border-pink-200 hover:shadow-lg transition">
            <CardContent className="text-center py-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{feature.title}</h2>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;

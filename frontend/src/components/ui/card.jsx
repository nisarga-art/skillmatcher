// frontend/src/components/ui/Card.jsx
import React from "react";

export const Card = ({ children, className }) => (
  <div className={`p-4 border rounded ${className}`}>{children}</div>
);

export const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);

// frontend/src/components/ui/Button.jsx
import React from "react";

export const Button = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
      {children}
    </button>
  );
};

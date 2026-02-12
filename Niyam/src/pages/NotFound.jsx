import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 font-['Inter']">
      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Page Not Found</p>
        <h1 className="text-4xl font-bold text-slate-900">Lost in focus?</h1>
        <Link className="text-sm font-semibold text-[#4F46E5] hover:underline" to="/">
          Return to the landing page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-slate-900 hover:border-slate-300 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="material-symbols-outlined text-sm">
        {isDark ? "dark_mode" : "light_mode"}
      </span>
      {isDark ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeToggle;

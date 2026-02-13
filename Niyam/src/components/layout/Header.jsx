import React from "react";
import ThemeToggle from "../common/ThemeToggle";

const headerVariants = {
  dashboard:
    "h-16 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40 dark:bg-slate-950 dark:border-slate-800",
  history:
    "min-h-[3.5rem] bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-3 sm:py-0 sticky top-0 z-30 dark:bg-slate-950 dark:border-slate-800",
  analytics:
    "min-h-[4rem] border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 sm:px-8 py-3 sm:py-0 flex flex-wrap items-center justify-between gap-3 dark:border-slate-800 dark:bg-slate-950/80",
};

const Header = ({ variant, left, right }) => {
  return (
    <header className={headerVariants[variant] || headerVariants.dashboard}>
      <div className="flex items-center gap-2 flex-wrap">{left}</div>
      <div className="flex items-center gap-4 flex-wrap justify-end w-full sm:w-auto">
        {right}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;

import React from "react";

const headerVariants = {
  dashboard:
    "h-16 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40",
  history:
    "h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30",
  analytics:
    "h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between",
};

const Header = ({ variant, left, right }) => {
  return (
    <header className={headerVariants[variant] || headerVariants.dashboard}>
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex items-center gap-4">{right}</div>
    </header>
  );
};

export default Header;

import React from "react";

const SummaryProgress = ({ label, valueLabel, barClass, barColorClass }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight dark:text-slate-200">
          {label}
        </span>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {valueLabel}
        </span>
      </div>
      <div className="w-full bg-slate-100 h-1 rounded-full dark:bg-slate-800">
        <div className={`h-1 rounded-full ${barColorClass} ${barClass}`}></div>
      </div>
    </div>
  );
};

export default SummaryProgress;

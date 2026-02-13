import React from "react";
import TimelineActivity from "./TimelineActivity";

const TimelineGroup = ({ group, isLast, onDeleteActivity, onEditActivity, categories }) => {
  return (
    <div className="timeline-group relative pb-10">
      <div
        className={`absolute left-2 top-6 -bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 sm:left-2.75 ${
          isLast ? "hidden" : "block"
        }`}
      ></div>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div
          className={`w-6 h-6 rounded-full border-2 ${
            group.isCurrent ? "border-[#137fec]" : "border-slate-200"
          } bg-white flex items-center justify-center dark:bg-slate-950 dark:border-slate-800`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              group.isCurrent ? "bg-[#137fec]" : "bg-slate-300"
            } dark:bg-slate-500`}
          ></div>
        </div>
        <div className="flex items-baseline gap-2 sm:gap-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {group.label}
          </h3>
          <span className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide dark:text-slate-500">
            {group.dateLabel}
          </span>
        </div>
      </div>
      <div className="space-y-3 ml-7 sm:ml-9.5">
        {group.entries.map((entry) => (
          <TimelineActivity
            key={entry.id}
            activity={entry}
            onDelete={onDeleteActivity}
            onEdit={onEditActivity}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineGroup;

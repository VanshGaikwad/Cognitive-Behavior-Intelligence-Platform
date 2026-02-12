import React from "react";
import TimelineActivity from "./TimelineActivity";

const TimelineGroup = ({ group, isLast, onDeleteActivity, onEditActivity, categories }) => {
  return (
    <div className="timeline-group relative pb-10">
      <div
        className={`absolute left-2.75 top-6 -bottom-6 w-0.5 bg-slate-200 ${
          isLast ? "hidden" : "block"
        }`}
      ></div>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div
          className={`w-6 h-6 rounded-full border-2 ${
            group.isCurrent ? "border-[#137fec]" : "border-slate-200"
          } bg-white flex items-center justify-center`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              group.isCurrent ? "bg-[#137fec]" : "bg-slate-300"
            }`}
          ></div>
        </div>
        <div className="flex items-baseline gap-3">
          <h3 className="text-base font-bold text-slate-900">{group.label}</h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {group.dateLabel}
          </span>
        </div>
      </div>
      <div className="space-y-3 ml-9.5">
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

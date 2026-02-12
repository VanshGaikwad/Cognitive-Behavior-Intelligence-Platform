import React from "react";

const TimelineActivity = ({ activity, onDelete }) => {
  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 flex items-center transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${activity.categoryClass}`}
          >
            {activity.category}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              timer
            </span>
            <span className="font-medium text-slate-700">{activity.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              schedule
            </span>
            <span>{activity.startTime}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
          onClick={() => onDelete?.(activity.id)}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default TimelineActivity;

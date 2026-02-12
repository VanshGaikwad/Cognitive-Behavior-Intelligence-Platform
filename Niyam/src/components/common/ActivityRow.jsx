import React from "react";

const ActivityRow = ({ activity, onDelete }) => {
  return (
    <div className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-sm flex items-center justify-center">
          <span className="material-symbols-outlined">{activity.icon}</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-slate-400 font-medium">
              {activity.duration}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span
              className={`text-[10px] font-bold uppercase tracking-tight ${activity.categoryClass}`}
            >
              {activity.category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[11px] text-slate-400 font-medium">
          {activity.timeLabel}
        </span>
        <button
          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          onClick={() => onDelete?.(activity.id)}
          type="button"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </div>
  );
};

export default ActivityRow;

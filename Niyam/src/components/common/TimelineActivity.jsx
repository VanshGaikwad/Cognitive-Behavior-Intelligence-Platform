import React, { useEffect, useState } from "react";

const TimelineActivity = ({ activity, onDelete, onEdit, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: activity.title,
    durationMinutes: activity.durationMinutes ?? 0,
    category: activity.category,
  });

  useEffect(() => {
    if (!isEditing) {
      setDraft({
        title: activity.title,
        durationMinutes: activity.durationMinutes ?? 0,
        category: activity.category,
      });
    }
  }, [activity, isEditing]);

  const handleSave = () => {
    const durationValue = Number(draft.durationMinutes);
    if (!draft.title.trim() || Number.isNaN(durationValue) || durationValue <= 0) {
      return;
    }

    onEdit?.(activity.id, {
      activityName: draft.title.trim(),
      duration: durationValue,
      category: draft.category,
    });
    setIsEditing(false);
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:shadow-md hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800">
      <div className="flex-1 w-full">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {isEditing ? (
            <input
              className="text-sm font-semibold text-slate-900 border border-slate-200 rounded-md px-2 py-1 w-full max-w-64 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          ) : (
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {activity.title}
            </h4>
          )}
          {isEditing ? (
            <select
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
              value={draft.category}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              {(categories || [activity.category]).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${activity.categoryClass}`}
            >
              {activity.category}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">
              timer
            </span>
            {isEditing ? (
              <input
                className="w-20 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                type="number"
                min="1"
                value={draft.durationMinutes}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    durationMinutes: event.target.value,
                  }))
                }
              />
            ) : (
              <span className="font-medium text-slate-700">{activity.duration}</span>
            )}
          </div>
          {!isEditing && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">
                schedule
              </span>
              <span>{activity.startTime}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        {isEditing ? (
          <>
            <button
              className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg"
              onClick={handleSave}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
            </button>
            <button
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button
              className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
              onClick={() => onDelete?.(activity.id)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TimelineActivity;

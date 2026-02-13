import React from "react";

const levelClasses = [
  "bg-slate-200 dark:bg-slate-800",
  "bg-emerald-200 dark:bg-emerald-900/70",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-600",
];

const emptyCellClass = "bg-slate-200/80 dark:bg-slate-800";

const UserHeatmap = ({ data, availableYears = [], selectedYear, onYearChange }) => {
  if (!data) {
    return null;
  }

  const {
    totalSubmissions = 0,
    totalActiveDays = 0,
    maxStreak = 0,
    currentStreak = 0,
    weeks = [],
    monthLabels = [],
    year,
  } = data;

  const displayYear = selectedYear || year || new Date().getFullYear();

  if (!weeks.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl px-5 py-6 text-sm">
        No activity yet. Log your first session to start a streak.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-5">
        <div>
          <p className="text-sm font-semibold">
            {totalSubmissions} submissions in {displayYear}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wide">
            Daily activity heatmap
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-300">
          {availableYears.length > 1 ? (
            <label className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Year</span>
              <select
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={displayYear}
                onChange={(event) => onYearChange?.(Number(event.target.value))}
              >
                {availableYears.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div>
            <span className="text-slate-400">Total active days:</span> {totalActiveDays}
          </div>
          <div>
            <span className="text-slate-400">Max streak:</span> {maxStreak}
          </div>
          <div>
            <span className="text-slate-400">Current streak:</span> {currentStreak}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="overflow-x-auto heatmap-scroll">
          <div className="grid min-w-max grid-flow-col auto-cols-[10px] sm:auto-cols-[12px] gap-1 text-[9px] sm:text-[10px] text-slate-400">
          {monthLabels.map((label, index) => (
            <span key={`${label}-${index}`} className="h-3">
              {label}
            </span>
          ))}
          </div>
          <div className="mt-2 grid min-w-max grid-rows-7 grid-flow-col gap-1">
            {weeks.flatMap((week, weekIndex) =>
              week.map((day, dayIndex) => {
                const levelClass = day.level === 0 ? emptyCellClass : levelClasses[day.level];
                const dimClass = day.isPlaceholder ? "opacity-30" : "opacity-100";
                const title = `${day.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}: ${day.count} submissions`;

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] ${levelClass} ${dimClass}`}
                    title={title}
                  ></div>
                );
              })
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate-400">
          <span>Less</span>
          {levelClasses.map((className, index) => (
            <span key={index} className={`w-3 h-3 rounded-[3px] ${className}`}></span>
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default UserHeatmap;

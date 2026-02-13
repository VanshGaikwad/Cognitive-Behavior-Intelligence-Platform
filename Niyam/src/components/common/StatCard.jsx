import React from "react";

const StatCard = ({ label, value, meta, metaClass, valueClass, valueSuffix }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm dark:bg-slate-950 dark:border-slate-800">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 dark:text-slate-500">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-bold ${
            valueClass || "text-slate-900 dark:text-slate-100"
          }`}
        >
          {value}
          {valueSuffix ? (
            <span className="text-lg text-slate-400 dark:text-slate-500">
              {valueSuffix}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span
            className={`text-[10px] font-bold ${
              metaClass || "text-slate-400 dark:text-slate-500"
            }`}
          >
            {meta}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;

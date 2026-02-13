import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/common/StatCard";
import ThreeBarChart from "../components/common/ThreeBarChart";
import { getPrimaryNavigation } from "../services/navigationService";
import { getAnalyticsData } from "../services/analyticsService";
import { subscribeRangeAnalytics } from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const baseAnalytics = {
  insight: {
    title: "",
    body: "",
  },
  efficiency: {
    title: "",
    value: "",
  },
  weekRange: "",
  overview: [],
  chart: {
    yAxis: ["12h", "10h", "8h", "6h", "4h", "2h", "0h"],
    bars: [],
  },
  categories: [],
};

const AnalyticsPage = () => {
  const [data, setData] = useState(baseAnalytics);
  const [rangeType, setRangeType] = useState("weekly");
  const [show3d, setShow3d] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadBase = async () => {
      const base = await getAnalyticsData();
      setData((prev) => ({ ...prev, ...base }));
    };

    loadBase();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    const unsubscribe = subscribeRangeAnalytics(user.id, rangeType, (rangeData) => {
      if (!rangeData) {
        return;
      }
      setData((prev) => ({ ...(prev || baseAnalytics), ...rangeData }));
    });

    return () => {
      unsubscribe();
    };
  }, [user, rangeType]);

  const navigation = getPrimaryNavigation("analytics");

  const handleLogout = () => {
    sessionStorage.setItem("logoutRedirect", "1");
    logout()
      .catch((error) => {
        console.error("Logout failed", error);
      })
      .finally(() => {
        window.location.assign("/");
      });
  };

  return (
    <div className="bg-[#F1F5F9] min-h-screen font-['Inter'] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        variant="dashboard"
        brand={{
          name: "Niyam",
          logoSrc: "/niyam-logo.png",
          logoClass: "w-9 h-9 object-contain",
          badgeClass: "bg-transparent",
          badgeShapeClass: "rounded-none",
          badgeSizeClass: "w-12 h-12",
          textClass: "text-lg font-semibold tracking-tight",
          iconText: "N",
        }}
        items={navigation}
        footer={
          <button
            className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-sm"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined mr-3">logout</span>
            Logout
          </button>
        }
      />

      <main className="ml-0 md:ml-64 min-h-screen pt-16 md:pt-0">
        <Header
          variant="analytics"
          left={
            <>
              <span className="material-symbols-outlined text-slate-400 text-xl">
                analytics
              </span>
              <h1 className="text-base font-semibold text-slate-800 uppercase tracking-tight dark:text-slate-100">
                Focus Analytics
              </h1>
            </>
          }
          right={
            <div className="flex w-full sm:w-auto flex-wrap items-center gap-3 justify-end">
              <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg dark:bg-slate-900">
                <button
                  className={`px-4 py-1 text-[11px] font-semibold rounded-md ${
                    rangeType === "weekly"
                      ? "bg-white shadow-sm dark:bg-slate-950"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setRangeType("weekly")}
                  type="button"
                >
                  Weekly
                </button>
                <button
                  className={`px-4 py-1 text-[11px] font-semibold rounded-md ${
                    rangeType === "monthly"
                      ? "bg-white shadow-sm dark:bg-slate-950"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setRangeType("monthly")}
                  type="button"
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-1 text-[11px] font-semibold rounded-md ${
                    rangeType === "yearly"
                      ? "bg-white shadow-sm dark:bg-slate-950"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setRangeType("yearly")}
                  type="button"
                >
                  Yearly
                </button>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
              <button className="flex w-full sm:w-auto items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#3b82f6] transition-colors uppercase tracking-wider dark:text-slate-300 dark:hover:text-[#93c5fd]" type="button">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                {data.rangeLabel || data.weekRange}
              </button>
            </div>
          }
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.overview.map((card) => (
              <StatCard
                key={card.id}
                label={card.label}
                value={card.value}
                meta={card.meta}
                metaClass={card.metaClass}
                valueSuffix={card.valueSuffix}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md overflow-hidden dark:bg-slate-950 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight dark:text-slate-100">
                  Active Focus Distribution
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide dark:text-slate-500">
                  3D Visualization Engine Output
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500 shadow-sm"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                    Deep Focus
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-300 shadow-sm"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                    Light Focus
                  </span>
                </div>
                <button
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                    show3d
                      ? "text-white bg-[#3b82f6]"
                      : "text-[#3b82f6] bg-blue-50 dark:text-[#93c5fd] dark:bg-slate-900"
                  }`}
                  onClick={() => setShow3d((prev) => !prev)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">3d_rotation</span>
                  {show3d ? "2D VIEW" : "3D VIEW"}
                </button>
              </div>
            </div>

            <div className="relative bg-slate-50/50 px-4 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16 dark:bg-slate-900/40">
              <div className="relative h-72 sm:h-96 lg:h-100 w-full flex items-end overflow-x-auto">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 font-bold pointer-events-none translate-x-[-120%] pr-4 text-right dark:text-slate-500">
                  {data.chart.yAxis.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0.5">
                  {data.chart.yAxis.map((label) => (
                    <div key={label} className="w-full h-px border-b border-slate-200 dark:border-slate-800"></div>
                  ))}
                </div>
                <div className="relative w-full h-full z-10 px-4 min-w-[420px] sm:min-w-[520px]">
                  {show3d ? (
                    <ThreeBarChart bars={data.chart.bars} className="absolute inset-0" />
                  ) : (
                    <div className="relative w-full h-full flex justify-around items-end">
                      {data.chart.bars.map((bar) => (
                        <div key={bar.id} className="relative flex flex-col items-center w-full group">
                          <div
                            className={`flex flex-col-reverse w-12 gap-0.5 ${
                              bar.isPeak ? "ring-2 ring-[#3b82f6]/20 rounded-t" : ""
                            } ${bar.muted ? "opacity-40" : ""}`}
                          >
                            <div
                              className={`w-full rounded-t-sm shadow-sm transition-all hover:brightness-110 ${bar.lightClass}`}
                            ></div>
                            <div
                              className={`w-full rounded-t-sm shadow-md transition-all hover:brightness-110 ${bar.deepClass}`}
                            ></div>
                          </div>
                          {bar.tooltip ? (
                            <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {bar.tooltip}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className="absolute inset-x-0 -bottom-7 sm:-bottom-9 text-[10px] sm:text-[11px] font-bold uppercase pointer-events-none"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${Math.max(
                        data.chart.bars.length,
                        1
                      )}, minmax(0, 1fr))`,
                    }}
                  >
                    {data.chart.bars.map((bar) => (
                      <span
                        key={bar.id}
                        title={bar.tooltip || ""}
                        className={`text-center ${
                          bar.isPeak
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-400 dark:text-slate-500"
                        } ${bar.muted ? "text-slate-300 dark:text-slate-600" : ""}`}
                      >
                        {bar.day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm dark:bg-slate-950 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2 dark:text-slate-100">
                <span className="material-symbols-outlined text-blue-500 text-lg">
                  pie_chart
                </span>
                Category Allocation
              </h3>
              <div className="space-y-6">
                {data.categories.map((category) => (
                  <div key={category.id}>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 dark:text-slate-500">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${category.dotClass}`}></span>
                        {category.label}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100">{category.value}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                      <div className={`h-full rounded-full ${category.colorClass} ${category.percentClass}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-4">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI Performance Insight
                  </span>
                  <h4 className="text-lg font-bold mb-2">{data.insight.title}</h4>
                  <p className="text-blue-50 text-xs leading-relaxed opacity-90">
                    {data.insight.body}
                  </p>
                </div>
                <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-white/10 text-9xl">
                  insights
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between dark:bg-slate-950 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 dark:bg-emerald-500/10">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-500">
                      {data.efficiency.title}
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{data.efficiency.value}</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-[#3b82f6] hover:underline">
                  Full Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-6 sm:p-8 border-t border-slate-200 mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] dark:border-slate-800 dark:text-slate-500">
          <span>ENGINE STATUS: NOMINAL</span>
          <span>DATA REFRESHED: 12:45:02 UTC</span>
          <div className="flex gap-4">
            <button className="hover:text-[#3b82f6] transition-colors">Privacy</button>
            <button className="hover:text-[#3b82f6] transition-colors">Terms</button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AnalyticsPage;

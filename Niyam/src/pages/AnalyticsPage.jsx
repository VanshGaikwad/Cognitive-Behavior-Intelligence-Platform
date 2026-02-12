import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/common/StatCard";
import { getPrimaryNavigation } from "../services/navigationService";
import { getAnalyticsData } from "../services/analyticsService";
import { subscribeWeeklyAnalytics } from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadBase = async () => {
      const base = await getAnalyticsData();
      setData(base);
    };

    loadBase();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    const unsubscribe = subscribeWeeklyAnalytics(user.id, (weekly) => {
      if (!weekly) {
        return;
      }
      setData((prev) => ({ ...prev, ...weekly }));
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!data) {
    return null;
  }

  const navigation = getPrimaryNavigation("analytics");

  return (
    <div className="flex h-screen overflow-hidden font-['Inter'] bg-[#f8fafc] text-slate-900">
      <Sidebar
        variant="analytics"
        brand={{ name: "FocusFlow", icon: "monitoring", iconSizeClass: "text-xl" }}
        items={navigation}
        footer={
          <>
            <button
              className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
              onClick={logout}
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100">
              <img
                alt="Alex Morgan"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKaxMjxxg0WEYxvy7jEwzw0SXMuS61G52UerM4iLarFOqUbpikoO1yJDhOYnclpcjeHrdJb1TbqRmZ2-RzI5Q_z4t_g8K1Ri2TGvF6b4YQE5-AoYPL0MstFxxnHNz1QIAV6u0bRmDPQYH9g3I43lr3jp_mkje1SDMkyn2rA19kY4sx2Cc3zIvOn3ivAMMUi7EhismK3Cw1Al5US0kwflNZ-LGJP3MH7u50U3TlzqwAkBW76KQvMgyUYdWLqSXaM3zbeVAujoOouY8q"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate text-slate-900">Alex Morgan</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                  ID: 4920
                </p>
              </div>
            </div>
          </>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <Header
          variant="analytics"
          left={
            <>
              <span className="material-symbols-outlined text-slate-400 text-xl">
                analytics
              </span>
              <h1 className="text-base font-semibold text-slate-800 uppercase tracking-tight">
                Focus Analytics
              </h1>
            </>
          }
          right={
            <>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-4 py-1 text-[11px] font-semibold bg-white shadow-sm rounded-md">
                  Weekly
                </button>
                <button className="px-4 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700">
                  Monthly
                </button>
                <button className="px-4 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700">
                  Yearly
                </button>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#3b82f6] transition-colors uppercase tracking-wider">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                {data.weekRange}
              </button>
            </>
          }
        />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
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

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Active Focus Distribution
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                  3D Visualization Engine Output
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500 shadow-sm"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Deep Focus
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-300 shadow-sm"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Light Focus
                  </span>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-bold text-[#3b82f6] bg-blue-50 px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-sm">3d_rotation</span>
                  3D VIEW
                </button>
              </div>
            </div>

            <div className="relative bg-slate-50/50 px-12 py-16">
              <div className="relative h-[400px] w-full flex items-end">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 font-bold pointer-events-none translate-x-[-120%] pr-4 text-right">
                  {data.chart.yAxis.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[2px]">
                  {data.chart.yAxis.map((label) => (
                    <div key={label} className="w-full h-px border-b border-slate-200"></div>
                  ))}
                </div>
                <div className="relative w-full h-full flex justify-around items-end z-10 px-4">
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
                      <span
                        className={`absolute -bottom-8 text-[11px] font-bold uppercase ${
                          bar.isPeak ? "text-slate-900" : "text-slate-400"
                        } ${bar.muted ? "text-slate-300" : ""}`}
                      >
                        {bar.day}
                      </span>
                      {bar.tooltip ? (
                        <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.tooltip}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500 text-lg">
                  pie_chart
                </span>
                Category Allocation
              </h3>
              <div className="space-y-6">
                {data.categories.map((category) => (
                  <div key={category.id}>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${category.dotClass}`}></span>
                        {category.label}
                      </span>
                      <span className="text-slate-900">{category.value}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {data.efficiency.title}
                    </p>
                    <p className="text-sm font-bold text-slate-800">{data.efficiency.value}</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-[#3b82f6] hover:underline">
                  Full Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-8 border-t border-slate-200 mt-8 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
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

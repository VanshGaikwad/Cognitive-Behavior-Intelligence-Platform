import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ActivityRow from "../components/common/ActivityRow";
import SummaryProgress from "../components/common/SummaryProgress";
import UserHeatmap from "../components/common/UserHeatmap";
import { getPrimaryNavigation } from "../services/navigationService";
import { getDashboardData } from "../services/dashboardService";
import {
  addActivity,
  deleteActivity,
  subscribeDashboardSummary,
  subscribeRecentActivities,
  subscribeUserHeatmap,
} from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [formState, setFormState] = useState({
    activityName: "",
    duration: "",
    category: "Deep Work",
  });
  const [submitting, setSubmitting] = useState(false);
  const heatmapRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadDashboard = async () => {
      const dashboard = await getDashboardData();
      setData(dashboard);
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setRecentActivities([]);
      setSummary(null);
      setHeatmapData(null);
      setAvailableYears([]);
      return undefined;
    }

    const unsubscribeRecent = subscribeRecentActivities(user.id, 3, setRecentActivities);
    const unsubscribeSummary = subscribeDashboardSummary(user.id, setSummary);
    const unsubscribeHeatmap = subscribeUserHeatmap(user.id, (payload) => {
      if (!payload) {
        setHeatmapData(null);
        return;
      }
      setHeatmapData(payload.heatmap || null);
      setAvailableYears(payload.availableYears || []);
    }, selectedYear);

    return () => {
      unsubscribeRecent();
      unsubscribeSummary();
      unsubscribeHeatmap();
    };
  }, [user, selectedYear]);

  useEffect(() => {
    if (!availableYears.length) {
      return;
    }
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (!showHeatmap) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (
        heatmapRef.current?.contains(event.target) ||
        avatarRef.current?.contains(event.target)
      ) {
        return;
      }
      setShowHeatmap(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowHeatmap(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showHeatmap]);

  if (!data) {
    return null;
  }

  const navigation = getPrimaryNavigation("dashboard");

  const displayUser = user || data.user;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = async () => {
    if (!user?.id || submitting) {
      return;
    }

    if (!formState.activityName.trim()) {
      return;
    }

    const durationValue = formState.duration
      ? Number(formState.duration)
      : 45;
    const safeDuration = Number.isNaN(durationValue) || durationValue <= 0 ? 45 : durationValue;

    setSubmitting(true);
    try {
      await addActivity({
        userId: user.id,
        activityName: formState.activityName,
        duration: safeDuration,
        category: formState.category,
      });
      setFormState((prev) => ({ ...prev, activityName: "", duration: "" }));
    } catch (error) {
      console.error("Unable to add activity", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!user?.id) {
      return;
    }
    try {
      await deleteActivity(user.id, activityId);
    } catch (error) {
      console.error("Unable to delete activity", error);
    }
  };

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
          variant="dashboard"
          left={
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Dashboard
            </h1>
          }
          right={
            <>
              <div
                className="flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 shadow-sm dark:border-orange-500/30 dark:from-orange-500/10 dark:to-amber-500/10 dark:text-orange-200"
                aria-label="Current streak"
              >
                <span aria-hidden="true">🔥</span>
                <span>{heatmapData?.currentStreak ?? 0} days</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 leading-none dark:text-slate-100">
                  {displayUser.name}
                </p>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider dark:text-slate-500">
                  {displayUser.plan}
                </p>
              </div>
              <div className="relative">
                <button
                  ref={avatarRef}
                  type="button"
                  aria-label="Toggle activity heatmap"
                  aria-expanded={showHeatmap}
                  className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden dark:border-slate-800"
                  onClick={() => setShowHeatmap((prev) => !prev)}
                >
                  <img
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    src={displayUser.avatar}
                  />
                </button>
                {showHeatmap ? (
                  <div
                    ref={heatmapRef}
                    className="absolute right-0 mt-3 z-50 w-[min(92vw,720px)]"
                  >
                    {heatmapData ? (
                      <UserHeatmap
                        data={heatmapData}
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                      />
                    ) : (
                      <div className="rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl px-5 py-6 text-sm">
                        Loading heatmap...
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          }
        />

        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1 dark:text-slate-500">
              Daily Log Section
            </h2>
            <div className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-4 dark:bg-slate-950 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 dark:text-slate-500">
                    Activity Name
                  </label>
                  <input
                    className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                    placeholder={data.activityForm.placeholder}
                    type="text"
                    name="activityName"
                    value={formState.activityName}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full lg:w-32">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 dark:text-slate-500">
                    Duration (m)
                  </label>
                  <input
                    className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                    placeholder={data.activityForm.durationPlaceholder}
                    type="number"
                    name="duration"
                    value={formState.duration}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full lg:w-48">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 dark:text-slate-500">
                    Category
                  </label>
                  <select
                    className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                    name="category"
                    value={formState.category}
                    onChange={handleChange}
                  >
                    {data.activityForm.categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="w-full lg:w-auto px-6 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-sm font-semibold rounded-sm transition-colors shadow-sm whitespace-nowrap"
                  onClick={handleAddActivity}
                  type="button"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Add Activity"}
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden dark:bg-slate-950 dark:border-slate-800">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white dark:bg-slate-950 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest dark:text-slate-100">
                    Recent Logs
                  </h3>
                  <button
                    className="text-[11px] text-[#4F46E5] font-bold uppercase tracking-wider hover:underline"
                    type="button"
                    onClick={() => navigate("/history")}
                  >
                    View All History
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentActivities.map((activity) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                      onDelete={handleDeleteActivity}
                    />
                  ))}
                </div>
              </section>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6 dark:bg-slate-950 dark:border-slate-800">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 dark:text-slate-500">
                  Today Summary
                </h3>
                {summary ? (
                  <>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight dark:text-slate-100">
                          {summary.totalMinutes}
                        </h2>
                        <span className="text-slate-400 font-medium text-sm dark:text-slate-500">
                          minutes total
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                          <span className="material-symbols-outlined text-[14px] mr-1">
                            trending_up
                          </span>
                          {summary.delta}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider dark:text-slate-500">
                          {summary.deltaLabel}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {summary.items.map((item) => (
                        <SummaryProgress
                          key={item.id}
                          label={item.label}
                          valueLabel={item.valueLabel}
                          barClass={item.barClass}
                          barColorClass={item.barColorClass}
                        />
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm dark:bg-slate-950">
                            <span className="material-symbols-outlined text-[#4F46E5] text-base">
                              military_tech
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-500">
                              {summary.goal.title}
                            </p>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {summary.goal.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

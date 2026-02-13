import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TimelineGroup from "../components/common/TimelineGroup";
import { getPrimaryNavigation } from "../services/navigationService";
import { getHistoryData } from "../services/historyService";
import {
  deleteActivity,
  subscribeHistoryTimeline,
  updateActivity,
} from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const limitTimelineEntries = (groups, maxEntries) => {
  let remaining = maxEntries;
  const limited = [];

  groups.forEach((group) => {
    if (remaining <= 0) return;
    const slice = group.entries.slice(0, remaining);
    if (slice.length) {
      limited.push({ ...group, entries: slice });
      remaining -= slice.length;
    }
  });

  return limited;
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const flattenTimeline = (groups) =>
  groups.flatMap((group) =>
    group.entries.map((entry) => ({
      ...entry,
      groupLabel: group.label,
      groupDateLabel: group.dateLabel,
    }))
  );

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const HistoryPage = () => {
  const [data, setData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [selectedRange, setSelectedRange] = useState("7");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getHistoryData();
      setData(history);
    };

    loadHistory();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setTimeline([]);
      return undefined;
    }

    const unsubscribe = subscribeHistoryTimeline(user.id, setTimeline);
    return () => {
      unsubscribe();
    };
  }, [user]);

  const navigation = getPrimaryNavigation("history");
  const header = data?.header || {
    navTitle: "",
    title: "History",
    subtitle: "",
    rangeTabs: ["Last 7 days", "30 days", "Months"],
    exportLabel: "Export CSV",
    customRangeLabel: "Custom Range",
  };
  const footer = data?.footer || {
    buttonLabel: "Load More Activities",
    helperText: "No entries yet",
  };

  const rangeOptions = [
    { label: header.rangeTabs[0], value: "7" },
    { label: header.rangeTabs[1], value: "30" },
    { label: header.rangeTabs[2], value: "months" },
  ];

  const categories = useMemo(() => {
    const bucket = new Set();
    timeline.forEach((group) => {
      group.entries.forEach((entry) => bucket.add(entry.category));
    });
    return Array.from(bucket);
  }, [timeline]);

  const filteredTimeline = useMemo(() => {
    if (!timeline.length) return [];

    const now = new Date();
    let start = null;
    let end = null;

    if (selectedRange === "7") {
      start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
      end = new Date(now);
    } else if (selectedRange === "30") {
      start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29));
      end = new Date(now);
    } else if (selectedRange === "months") {
      start = startOfDay(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()));
      end = new Date(now);
    } else if (selectedRange === "custom" && customStart && customEnd) {
      start = startOfDay(new Date(`${customStart}T00:00:00`));
      end = new Date(`${customEnd}T23:59:59`);
    }

    if (!start || !end) {
      return timeline;
    }

    return timeline
      .map((group) => {
        const entries = group.entries.filter((entry) => {
          const createdAt = new Date(entry.createdAt);
          return createdAt >= start && createdAt <= end;
        });
        return { ...group, entries };
      })
      .filter((group) => group.entries.length);
  }, [timeline, selectedRange, customStart, customEnd]);

  const totalEntries = filteredTimeline.reduce(
    (sum, group) => sum + group.entries.length,
    0
  );
  const visibleTimeline = useMemo(
    () => limitTimelineEntries(filteredTimeline, visibleCount),
    [filteredTimeline, visibleCount]
  );
  const visibleEntries = visibleTimeline.reduce(
    (sum, group) => sum + group.entries.length,
    0
  );
  const canLoadMore = visibleEntries < totalEntries;
  const customLabel =
    selectedRange === "custom" && customStart && customEnd
      ? `${formatDateInput(customStart)} - ${formatDateInput(customEnd)}`
      : header.customRangeLabel;

  const flatEntries = useMemo(() => flattenTimeline(filteredTimeline), [filteredTimeline]);
  const latestNotifications = flatEntries.slice(0, 5);

  const handleExportCsv = () => {
    const rows = [
      ["Date", "Title", "Category", "Duration (minutes)", "Group"],
      ...flatEntries.map((entry) => [
        new Date(entry.createdAt).toLocaleString("en-US"),
        entry.title,
        entry.category,
        entry.durationMinutes ?? "",
        entry.groupLabel,
      ]),
    ];

    const content = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    downloadFile(content, "history-export.csv", "text/csv;charset=utf-8;");
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const rows = flatEntries.map((entry) => ({
      date: new Date(entry.createdAt).toLocaleString("en-US"),
      title: entry.title,
      category: entry.category,
      duration: entry.durationMinutes ?? "",
      group: entry.groupLabel,
    }));

    const tableRows = rows
      .map(
        (row) =>
          `<tr><td>${row.date}</td><td>${row.title}</td><td>${row.category}</td><td>${row.duration}</td><td>${row.group}</td></tr>`
      )
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Duration (minutes)</th><th>Group</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
    downloadFile(html, "history-export.xls", "application/vnd.ms-excel");
    setShowExportMenu(false);
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

      <main className="ml-0 md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0">
        <Header
          variant="history"
          left={<h1 className="text-sm font-semibold text-slate-500">{header.navTitle}</h1>}
          right={
            <div className="flex w-full sm:w-auto items-center gap-3 flex-wrap justify-end">
              <div className="relative">
                <button
                  className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  onClick={() => {
                    setShowNotifications((prev) => !prev);
                    setShowExportMenu(false);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-slate-200 shadow-lg rounded-xl p-4 z-20 dark:bg-slate-950 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Recent activity</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {latestNotifications.length} items
                      </span>
                    </div>
                    {latestNotifications.length ? (
                      <div className="space-y-2">
                        {latestNotifications.map((item) => (
                          <div key={item.id} className="text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</span>
                            <span className="text-slate-400 dark:text-slate-500"> · {item.category}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500">No history yet.</p>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="flex w-full sm:w-auto items-center gap-2 bg-[#137fec] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                  onClick={() => {
                    setShowExportMenu((prev) => !prev);
                    setShowNotifications(false);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  {header.exportLabel}
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-44 bg-white border border-slate-200 shadow-lg rounded-xl p-2 z-20 dark:bg-slate-950 dark:border-slate-800">
                    <button
                      className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-900"
                      onClick={handleExportCsv}
                      type="button"
                    >
                      Export as CSV
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-900"
                      onClick={handleExportExcel}
                      type="button"
                    >
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          }
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto flex-1">
          <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-100">
                {header.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">{header.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="inline-flex flex-wrap items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm h-auto dark:bg-slate-950 dark:border-slate-800">
                {rangeOptions.map((tab) => (
                  <button
                    key={tab.value}
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${
                      selectedRange === tab.value
                        ? "bg-[#eff6ff] text-[#137fec] dark:bg-slate-900 dark:text-[#93c5fd]"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
                    }`}
                    onClick={() => {
                      setSelectedRange(tab.value);
                      setVisibleCount(6);
                    }}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <button
                  className="h-10 px-3 flex w-full sm:w-auto items-center gap-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors min-w-0 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  onClick={() => setShowCustomRange((prev) => !prev)}
                  type="button"
                >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span className="truncate">{customLabel}</span>
                </button>
                {showCustomRange && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-lg rounded-xl p-4 z-20 dark:bg-slate-950 dark:border-slate-800">
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300">
                        Start date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 rounded-md px-2 py-1 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        value={customStart}
                        onChange={(event) => setCustomStart(event.target.value)}
                      />
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300">
                        End date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 rounded-md px-2 py-1 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        value={customEnd}
                        onChange={(event) => setCustomEnd(event.target.value)}
                      />
                      <button
                        className="w-full bg-[#137fec] text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-50"
                        disabled={!customStart || !customEnd}
                        onClick={() => {
                          setSelectedRange("custom");
                          setVisibleCount(6);
                          setShowCustomRange(false);
                        }}
                        type="button"
                      >
                        Apply range
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-0 relative">
            {visibleTimeline.map((group, index) => (
              <TimelineGroup
                key={group.id}
                group={group}
                isLast={index === visibleTimeline.length - 1}
                categories={categories}
                onDeleteActivity={async (activityId) => {
                  if (!user?.id) return;
                  try {
                    await deleteActivity(user.id, activityId);
                  } catch (error) {
                    console.error("Unable to delete activity", error);
                  }
                }}
                onEditActivity={async (activityId, updates) => {
                  if (!user?.id) return;
                  try {
                    await updateActivity(user.id, activityId, updates);
                  } catch (error) {
                    console.error("Unable to update activity", error);
                  }
                }}
              />
            ))}
          </div>

          <div className="mt-12 py-8 border-t border-slate-200 flex flex-col items-center gap-4 dark:border-slate-800">
            <button
              className="px-6 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:text-[#137fec] hover:border-[#137fec] transition-all flex items-center gap-2 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:text-[#93c5fd]"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              disabled={!canLoadMore}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              {footer.buttonLabel}
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {totalEntries
                ? `Showing ${visibleEntries} of ${totalEntries} entries`
                : footer.helperText}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;

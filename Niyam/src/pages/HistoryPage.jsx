import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TimelineGroup from "../components/common/TimelineGroup";
import { getPrimaryNavigation } from "../services/navigationService";
import { getHistoryData } from "../services/historyService";
import { deleteActivity, subscribeHistoryTimeline } from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const HistoryPage = () => {
  const [data, setData] = useState(null);
  const [timeline, setTimeline] = useState([]);
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

  if (!data) {
    return null;
  }

  const navigation = getPrimaryNavigation("history");

  return (
    <div className="flex min-h-screen font-['Inter'] bg-[#f8fafc] text-slate-900">
      <Sidebar
        variant="history"
        brand={{
          name: "FocusFlow",
          icon: "blur_on",
          iconClass: "material-icons-round",
          iconSizeClass: "text-xl",
        }}
        items={navigation}
        footer={
          <div>
            <div className="px-3 pt-4 pb-2">
              <button
                className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors group"
                onClick={logout}
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                <img
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANTTQN9b6ZqpDfCJi3kj6pM0WnRQ5sAQcBVJslFa-hYJ3idRI93wrsD7Vo84nMoz9TfYcfpsLuDx7sIcPBB2XFo6Af8_MY-Z6U1vu8R4Q5x7olm0kPaJofyfId2UgslBdmqHT5_CI-5G3ygOnq7fkTIUz2DK08gptJDJRGaDKcAQb-CRw2UVuxM4qRNFL2WD4T0RCQ-Iz92JQp8W1o5RGKOY6IuUrOs5Mxwd5vWDHhSWIcvyJAe5fmhhVTRSvu6jNeLWD1dOErW4d7"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold truncate">Alex Rivera</p>
                  <p className="text-[10px] text-slate-500 truncate">Pro Plan</p>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <Header
          variant="history"
          left={<h1 className="text-sm font-semibold text-slate-500">{data.header.navTitle}</h1>}
          right={
            <>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </button>
              <button className="flex items-center gap-2 bg-[#137fec] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">download</span>
                {data.header.exportLabel}
              </button>
            </>
          }
        />

        <div className="p-8 max-w-5xl w-full mx-auto flex-1">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {data.header.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{data.header.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm h-10">
                {data.header.rangeTabs.map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 text-xs font-semibold rounded-[6px] ${
                      index === 0
                        ? "bg-[#eff6ff] text-[#137fec]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="h-10 px-3 flex items-center gap-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                {data.header.customRangeLabel}
              </button>
            </div>
          </div>

          <div className="space-y-0 relative">
            {timeline.map((group, index) => (
              <TimelineGroup
                key={group.id}
                group={group}
                isLast={index === timeline.length - 1}
                onDeleteActivity={async (activityId) => {
                  if (!user?.id) return;
                  try {
                    await deleteActivity(user.id, activityId);
                  } catch (error) {
                    console.error("Unable to delete activity", error);
                  }
                }}
              />
            ))}
          </div>

          <div className="mt-12 py-8 border-t border-slate-200 flex flex-col items-center gap-4">
            <button className="px-6 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:text-[#137fec] hover:border-[#137fec] transition-all flex items-center gap-2 bg-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">history</span>
              {data.footer.buttonLabel}
            </button>
            <p className="text-[11px] text-slate-400">{data.footer.helperText}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;

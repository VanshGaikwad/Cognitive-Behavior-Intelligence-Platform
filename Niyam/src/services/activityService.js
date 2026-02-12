import {
  ref,
  push,
  remove,
  onValue,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  get,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "../firebaseConfig";

const percentClasses = [
  "w-[0%]",
  "w-[5%]",
  "w-[10%]",
  "w-[15%]",
  "w-[20%]",
  "w-[25%]",
  "w-[30%]",
  "w-[35%]",
  "w-[40%]",
  "w-[45%]",
  "w-[50%]",
  "w-[55%]",
  "w-[60%]",
  "w-[65%]",
  "w-[70%]",
  "w-[75%]",
  "w-[80%]",
  "w-[85%]",
  "w-[90%]",
  "w-[95%]",
  "w-[100%]",
];

const heightClasses = [
  "h-[20px]",
  "h-[40px]",
  "h-[60px]",
  "h-[80px]",
  "h-[100px]",
  "h-[120px]",
  "h-[140px]",
  "h-[160px]",
  "h-[180px]",
  "h-[200px]",
  "h-[220px]",
  "h-[240px]",
  "h-[260px]",
];

const categoryStyles = {
  "Deep Work": { className: "text-indigo-600", badge: "bg-blue-50 text-blue-800" },
  Meetings: { className: "text-purple-600", badge: "bg-purple-50 text-purple-700" },
  Learning: { className: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700" },
  Admin: { className: "text-slate-500", badge: "bg-slate-100 text-slate-600" },
  Health: { className: "text-green-700", badge: "bg-green-50 text-green-700" },
  Writing: { className: "text-purple-700", badge: "bg-purple-50 text-purple-700" },
  Development: { className: "text-orange-700", badge: "bg-orange-50 text-orange-700" },
};

const categoryIcons = {
  "Deep Work": "description",
  Meetings: "groups",
  Learning: "school",
  Admin: "task",
  Health: "self_improvement",
  Writing: "edit_note",
  Development: "code",
};

const getCategoryStyle = (category) =>
  categoryStyles[category] || {
    className: "text-slate-500",
    badge: "bg-slate-100 text-slate-600",
  };

const getCategoryIcon = (category) => categoryIcons[category] || "task";

const getPercentClass = (percent) => {
  const index = Math.min(
    percentClasses.length - 1,
    Math.max(0, Math.round(percent / 5))
  );
  return percentClasses[index];
};

const getHeightClass = (minutes, maxMinutes) => {
  if (!maxMinutes) {
    return heightClasses[0];
  }
  const ratio = minutes / maxMinutes;
  const index = Math.min(
    heightClasses.length - 1,
    Math.max(0, Math.round(ratio * (heightClasses.length - 1)))
  );
  return heightClasses[index];
};

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) {
    return "0m";
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainder}m`;
};

const formatTimeLabel = (date) => {
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Started at ${time}`;
};

const formatRelativeDateLabel = (date) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfWeek = (date) => {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const endOfWeek = (start) => {
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  end.setMilliseconds(end.getMilliseconds() - 1);
  return end;
};

const mapActivityDocument = (key, data) => {
  return {
    id: key,
    activityName: data.activityName,
    duration: data.duration,
    category: data.category,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
  };
};

const buildRecentRow = (activity) => {
  const date = activity.createdAt;
  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const categoryStyle = getCategoryStyle(activity.category);

  return {
    id: activity.id,
    title: activity.activityName,
    icon: getCategoryIcon(activity.category),
    duration: formatDuration(activity.duration),
    timeLabel: `${label}, ${time}`,
    category: activity.category,
    categoryClass: categoryStyle.className,
  };
};

const buildTimelineEntry = (activity) => {
  const categoryStyle = getCategoryStyle(activity.category);
  return {
    id: activity.id,
    title: activity.activityName,
    category: activity.category,
    categoryClass: categoryStyle.badge,
    duration: formatDuration(activity.duration),
    startTime: formatTimeLabel(activity.createdAt),
  };
};

const groupActivitiesByDate = (activities) => {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups = new Map();

  activities.forEach((activity) => {
    const dateKey = startOfDay(activity.createdAt).toISOString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey).push(activity);
  });

  const sortedKeys = Array.from(groups.keys()).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return sortedKeys.map((key) => {
    const date = new Date(key);
    const isToday = date.getTime() === today.getTime();
    const isYesterday = date.getTime() === yesterday.getTime();

    return {
      id: key,
      label: isToday ? "Today" : isYesterday ? "Yesterday" : formatRelativeDateLabel(date),
      dateLabel: isToday || isYesterday ? formatRelativeDateLabel(date) : date.toLocaleDateString("en-US", { weekday: "long" }),
      isCurrent: isToday,
      entries: groups.get(key).map(buildTimelineEntry),
    };
  });
};

const buildSummary = (todayActivities, yesterdayActivities) => {
  const totalToday = todayActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalYesterday = yesterdayActivities.reduce(
    (sum, activity) => sum + activity.duration,
    0
  );

  const delta = totalYesterday
    ? Math.round(((totalToday - totalYesterday) / totalYesterday) * 100)
    : totalToday
    ? 100
    : 0;
  const deltaLabel = delta >= 0 ? `+${delta}%` : `${delta}%`;

  const categoryTotals = todayActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {});

  const items = Object.entries(categoryTotals).map(([category, minutes]) => {
    const percent = totalToday ? Math.round((minutes / totalToday) * 100) : 0;
    const colorMap = {
      "Deep Work": "bg-indigo-500",
      Meetings: "bg-purple-500",
      Learning: "bg-emerald-500",
      Admin: "bg-slate-400",
    };

    return {
      id: category.toLowerCase().replace(/\s+/g, "-"),
      label: category,
      valueLabel: `${formatDuration(minutes)} - ${percent}%`,
      barClass: getPercentClass(percent),
      barColorClass: colorMap[category] || "bg-slate-400",
    };
  });

  return {
    totalMinutes: totalToday.toString(),
    delta: deltaLabel,
    deltaLabel: "vs yesterday",
    items,
    goal: {
      title: "Goal Progress",
      subtitle: totalToday >= 120 ? "Target met" : "Keep going",
    },
  };
};

const buildAnalytics = (activities, weekStartDate) => {
  const weekStart = weekStartDate || startOfWeek(new Date());
  const weekEnd = endOfWeek(weekStart);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const totals = Array(7).fill(0);
  const categoryTotals = {};

  activities.forEach((activity) => {
    const day = activity.createdAt.getDay();
    const index = (day + 6) % 7;
    totals[index] += activity.duration;
    categoryTotals[activity.category] =
      (categoryTotals[activity.category] || 0) + activity.duration;
  });

  const maxMinutes = Math.max(...totals, 60);
  const toHeight = (minutes) => getHeightClass(minutes, maxMinutes);

  const chartBars = totals.map((minutes, index) => {
    const deepHeight = toHeight(minutes);
    const lightHeight = getHeightClass(Math.max(10, Math.round(minutes * 0.3)), maxMinutes);
    const muted = minutes === 0;
    const isPeak = minutes === Math.max(...totals) && minutes > 0;
    const tooltip = minutes ? `${(minutes / 60).toFixed(1)}h` : null;

    return {
      id: days[index].toLowerCase(),
      day: days[index],
      deepClass: `${deepHeight} bg-blue-500`,
      lightClass: `${lightHeight} bg-blue-300`,
      muted,
      isPeak,
      tooltip,
    };
  });

  const totalWeekMinutes = totals.reduce((sum, value) => sum + value, 0);
  const weeklyHours = (totalWeekMinutes / 60).toFixed(1);
  const dailyAverageMinutes = Math.round(totalWeekMinutes / 7);
  const deepSessions = activities.filter((activity) => activity.duration >= 90).length;

  const overview = [
    {
      id: "weekly-total",
      label: "Weekly Total Focus",
      value: `${weeklyHours}h`,
      meta: "",
      metaClass: "text-emerald-500",
    },
    {
      id: "daily-average",
      label: "Daily Average",
      value: formatDuration(dailyAverageMinutes),
      meta: "",
      metaClass: "text-slate-400",
    },
    {
      id: "deep-sessions",
      label: "Deep Work Sessions",
      value: deepSessions.toString(),
      meta: "",
      metaClass: "text-emerald-500",
    },
    {
      id: "focus-score",
      label: "Focus Score",
      value: totalWeekMinutes ? Math.min(100, Math.round((totalWeekMinutes / 3000) * 100)).toString() : "0",
      meta: "",
      metaClass: "text-blue-500",
      valueSuffix: "/100",
    },
  ];

  const categoryEntries = Object.entries(categoryTotals).map(([category, minutes]) => {
    const percent = totalWeekMinutes ? Math.round((minutes / totalWeekMinutes) * 100) : 0;
    const colorMap = {
      "Deep Work": "bg-blue-600",
      Meetings: "bg-blue-400",
      Learning: "bg-blue-200",
      Admin: "bg-slate-300",
    };

    return {
      id: category.toLowerCase().replace(/\s+/g, "-"),
      label: category,
      value: `${(minutes / 60).toFixed(1)}h (${percent}%)`,
      percentClass: getPercentClass(percent),
      colorClass: colorMap[category] || "bg-blue-200",
      dotClass: colorMap[category] || "bg-blue-200",
    };
  });

  const weekRange = `${formatRelativeDateLabel(weekStart)} - ${formatRelativeDateLabel(weekEnd)}`;

  return {
    weekRange,
    overview,
    chart: {
      yAxis: ["12h", "10h", "8h", "6h", "4h", "2h", "0h"],
      bars: chartBars,
    },
    categories: categoryEntries,
  };
};

export const addActivity = async ({ userId, activityName, duration, category }) => {
  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }
    const activitiesRef = ref(rtdb, `activities/${userId}`);
    await push(activitiesRef, {
      activityName,
      duration,
      category,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("Failed to add activity", error);
    throw error;
  }
};

export const deleteActivity = async (userId, activityId) => {
  try {
    if (!userId || !activityId) {
      throw new Error("Missing user ID or activity ID");
    }
    const activityRef = ref(rtdb, `activities/${userId}/${activityId}`);
    await remove(activityRef);
  } catch (error) {
    console.error("Failed to delete activity", error);
    throw error;
  }
};

export const getRecentActivities = async (userId, limitCount = 3) => {
  try {
    const activitiesRef = ref(rtdb, `activities/${userId}`);
    const snapshot = await get(activitiesRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const activities = [];
    snapshot.forEach((child) => {
      activities.push(mapActivityDocument(child.key, child.val()));
    });

    // Sort by createdAt descending and limit
    activities.sort((a, b) => b.createdAt - a.createdAt);
    return activities.slice(0, limitCount).map(buildRecentRow);
  } catch (error) {
    console.error("Failed to load recent activities", error);
    throw error;
  }
};

export const getAllActivities = async (userId) => {
  try {
    const activitiesRef = ref(rtdb, `activities/${userId}`);
    const snapshot = await get(activitiesRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const activities = [];
    snapshot.forEach((child) => {
      activities.push(mapActivityDocument(child.key, child.val()));
    });

    // Sort by createdAt descending
    activities.sort((a, b) => b.createdAt - a.createdAt);
    return activities;
  } catch (error) {
    console.error("Failed to load activities", error);
    throw error;
  }
};

export const getDashboardSummary = async (userId) => {
  try {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const activitiesRef = ref(rtdb, `activities/${userId}`);
    const snapshot = await get(activitiesRef);
    
    if (!snapshot.exists()) {
      return buildSummary([], []);
    }

    const allActivities = [];
    snapshot.forEach((child) => {
      allActivities.push(mapActivityDocument(child.key, child.val()));
    });

    const todayActivities = allActivities.filter(
      (activity) => activity.createdAt >= today && activity.createdAt < tomorrow
    );
    const yesterdayActivities = allActivities.filter(
      (activity) => activity.createdAt >= yesterday && activity.createdAt < today
    );

    return buildSummary(todayActivities, yesterdayActivities);
  } catch (error) {
    console.error("Failed to build dashboard summary", error);
    throw error;
  }
};

export const getHistoryTimeline = async (userId) => {
  try {
    const activities = await getAllActivities(userId);
    return groupActivitiesByDate(activities);
  } catch (error) {
    console.error("Failed to build history timeline", error);
    throw error;
  }
};

export const getWeeklyAnalytics = async (userId, weekStartDate) => {
  try {
    const start = weekStartDate || startOfWeek(new Date());
    const end = endOfWeek(start);

    const activitiesRef = ref(rtdb, `activities/${userId}`);
    const snapshot = await get(activitiesRef);
    
    if (!snapshot.exists()) {
      return buildAnalytics([], start);
    }

    const activities = [];
    snapshot.forEach((child) => {
      const activity = mapActivityDocument(child.key, child.val());
      if (activity.createdAt >= start && activity.createdAt <= end) {
        activities.push(activity);
      }
    });

    // Sort by createdAt ascending
    activities.sort((a, b) => a.createdAt - b.createdAt);

    return buildAnalytics(activities, start);
  } catch (error) {
    console.error("Failed to build weekly analytics", error);
    throw error;
  }
};

export const subscribeRecentActivities = (userId, limitCount, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const activitiesRef = ref(rtdb, `activities/${userId}`);

  const unsubscribe = onValue(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const activities = [];
      snapshot.forEach((child) => {
        activities.push(mapActivityDocument(child.key, child.val()));
      });

      // Sort by createdAt descending and limit
      activities.sort((a, b) => b.createdAt - a.createdAt);
      const limited = activities.slice(0, limitCount || 3);
      callback(limited.map(buildRecentRow));
    },
    (error) => {
      console.error("Realtime recent activities failed", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export const subscribeDashboardSummary = (userId, callback) => {
  if (!userId) {
    callback(null);
    return () => {};
  }

  const activitiesRef = ref(rtdb, `activities/${userId}`);

  const unsubscribe = onValue(
    activitiesRef,
    (snapshot) => {
      const today = startOfDay(new Date());
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (!snapshot.exists()) {
        callback(buildSummary([], []));
        return;
      }

      const allActivities = [];
      snapshot.forEach((child) => {
        allActivities.push(mapActivityDocument(child.key, child.val()));
      });

      const todayActivities = allActivities.filter(
        (activity) => activity.createdAt >= today && activity.createdAt < tomorrow
      );
      const yesterdayActivities = allActivities.filter(
        (activity) => activity.createdAt >= yesterday && activity.createdAt < today
      );

      callback(buildSummary(todayActivities, yesterdayActivities));
    },
    (error) => {
      console.error("Realtime summary failed", error);
      callback(null);
    }
  );

  return unsubscribe;
};

export const subscribeHistoryTimeline = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const activitiesRef = ref(rtdb, `activities/${userId}`);

  const unsubscribe = onValue(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const activities = [];
      snapshot.forEach((child) => {
        activities.push(mapActivityDocument(child.key, child.val()));
      });

      // Sort by createdAt descending
      activities.sort((a, b) => b.createdAt - a.createdAt);
      callback(groupActivitiesByDate(activities));
    },
    (error) => {
      console.error("Realtime history failed", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export const subscribeWeeklyAnalytics = (userId, callback, weekStartDate) => {
  if (!userId) {
    callback(null);
    return () => {};
  }

  const start = weekStartDate || startOfWeek(new Date());
  const end = endOfWeek(start);

  const activitiesRef = ref(rtdb, `activities/${userId}`);

  const unsubscribe = onValue(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(buildAnalytics([], start));
        return;
      }

      const activities = [];
      snapshot.forEach((child) => {
        const activity = mapActivityDocument(child.key, child.val());
        if (activity.createdAt >= start && activity.createdAt <= end) {
          activities.push(activity);
        }
      });

      // Sort by createdAt ascending
      activities.sort((a, b) => a.createdAt - b.createdAt);
      callback(buildAnalytics(activities, start));
    },
    (error) => {
      console.error("Realtime analytics failed", error);
      callback(null);
    }
  );

  return unsubscribe;
};

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
  update,
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
  "Deep Work": {
    className: "text-indigo-600 dark:text-indigo-300",
    badge: "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200",
  },
  Meetings: {
    className: "text-purple-600 dark:text-purple-300",
    badge: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-200",
  },
  Learning: {
    className: "text-emerald-600 dark:text-emerald-300",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  },
  Admin: {
    className: "text-slate-500 dark:text-slate-300",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-300",
  },
  Health: {
    className: "text-green-700 dark:text-green-300",
    badge: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200",
  },
  Writing: {
    className: "text-purple-700 dark:text-purple-300",
    badge: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-200",
  },
  Development: {
    className: "text-orange-700 dark:text-orange-300",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-200",
  },
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
    className: "text-slate-500 dark:text-slate-300",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-300",
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

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date) => {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  end.setMilliseconds(end.getMilliseconds() - 1);
  return end;
};

const startOfYear = (date) => new Date(date.getFullYear(), 0, 1);

const endOfYear = (date) => {
  const end = new Date(date.getFullYear() + 1, 0, 1);
  end.setMilliseconds(end.getMilliseconds() - 1);
  return end;
};

const getRangeConfig = (rangeType = "weekly", anchorDate = new Date()) => {
  if (rangeType === "monthly") {
    const start = startOfMonth(anchorDate);
    const end = endOfMonth(anchorDate);
    return {
      rangeStart: start,
      rangeEnd: end,
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      getBucketIndex: (date) => Math.min(4, Math.floor((date.getDate() - 1) / 7)),
      rangeLabel: `${formatRelativeDateLabel(start)} - ${formatRelativeDateLabel(end)}`,
      rangeName: "Monthly",
    };
  }

  if (rangeType === "yearly") {
    const start = startOfYear(anchorDate);
    const end = endOfYear(anchorDate);
    return {
      rangeStart: start,
      rangeEnd: end,
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      getBucketIndex: (date) => date.getMonth(),
      rangeLabel: `${formatRelativeDateLabel(start)} - ${formatRelativeDateLabel(end)}`,
      rangeName: "Yearly",
    };
  }

  const start = startOfWeek(anchorDate);
  const end = endOfWeek(start);
  return {
    rangeStart: start,
    rangeEnd: end,
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    getBucketIndex: (date) => (date.getDay() + 6) % 7,
    rangeLabel: `${formatRelativeDateLabel(start)} - ${formatRelativeDateLabel(end)}`,
    rangeName: "Weekly",
  };
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
    createdAt: activity.createdAt.getTime(),
    durationMinutes: activity.duration,
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
    const lightMinutes = minutes ? Math.max(10, Math.round(minutes * 0.3)) : 0;
    const lightHeight = getHeightClass(lightMinutes, maxMinutes);
    const muted = minutes === 0;
    const isPeak = minutes === Math.max(...totals) && minutes > 0;
    const tooltip = minutes ? `${(minutes / 60).toFixed(1)}h` : null;

    return {
      id: days[index].toLowerCase(),
      day: days[index],
      deepClass: `${deepHeight} bg-blue-500`,
      lightClass: `${lightHeight} bg-blue-300`,
      totalMinutes: minutes,
      deepMinutes: minutes,
      lightMinutes,
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

const buildRangeAnalytics = (activities, rangeType, anchorDate) => {
  const config = getRangeConfig(rangeType, anchorDate);
  const { rangeStart, rangeEnd, labels, getBucketIndex, rangeLabel, rangeName } = config;
  const totals = Array(labels.length).fill(0);
  const categoryTotals = {};

  activities.forEach((activity) => {
    if (activity.createdAt < rangeStart || activity.createdAt > rangeEnd) return;
    const index = getBucketIndex(activity.createdAt);
    totals[index] += activity.duration;
    categoryTotals[activity.category] =
      (categoryTotals[activity.category] || 0) + activity.duration;
  });

  const maxMinutes = Math.max(...totals, 60);
  const toHeight = (minutes) => getHeightClass(minutes, maxMinutes);
  const peak = Math.max(...totals);

  const chartBars = totals.map((minutes, index) => {
    const deepHeight = toHeight(minutes);
    const lightMinutes = minutes ? Math.max(10, Math.round(minutes * 0.3)) : 0;
    const lightHeight = getHeightClass(lightMinutes, maxMinutes);
    const muted = minutes === 0;
    const isPeak = minutes === peak && minutes > 0;
    const tooltip = minutes ? `${(minutes / 60).toFixed(1)}h` : null;

    return {
      id: `${labels[index]}-${index}`,
      day: labels[index],
      deepClass: `${deepHeight} bg-blue-500`,
      lightClass: `${lightHeight} bg-blue-300`,
      totalMinutes: minutes,
      deepMinutes: minutes,
      lightMinutes,
      muted,
      isPeak,
      tooltip,
    };
  });

  const totalRangeMinutes = totals.reduce((sum, value) => sum + value, 0);
  const rangeDays = Math.max(
    1,
    Math.ceil((rangeEnd.getTime() - rangeStart.getTime() + 1) / (1000 * 60 * 60 * 24))
  );
  const dailyAverageMinutes = Math.round(totalRangeMinutes / rangeDays);
  const deepSessions = activities.filter(
    (activity) =>
      activity.createdAt >= rangeStart &&
      activity.createdAt <= rangeEnd &&
      activity.duration >= 90
  ).length;

  const targetMinutes = Math.round((3000 / 7) * rangeDays);
  const focusScore = targetMinutes
    ? Math.min(100, Math.round((totalRangeMinutes / targetMinutes) * 100))
    : 0;

  const overview = [
    {
      id: "range-total",
      label: `${rangeName} Total Focus`,
      value: `${(totalRangeMinutes / 60).toFixed(1)}h`,
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
      value: focusScore.toString(),
      meta: "",
      metaClass: "text-blue-500",
      valueSuffix: "/100",
    },
  ];

  const categoryEntries = Object.entries(categoryTotals).map(([category, minutes]) => {
    const percent = totalRangeMinutes ? Math.round((minutes / totalRangeMinutes) * 100) : 0;
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

  return {
    rangeLabel,
    overview,
    chart: {
      yAxis: ["12h", "10h", "8h", "6h", "4h", "2h", "0h"],
      bars: chartBars,
    },
    categories: categoryEntries,
  };
};

const buildHeatmapData = (activities, year) => {
  const today = startOfDay(new Date());
  const targetYear = year || today.getFullYear();
  const startDate = new Date(targetYear, 0, 1);
  const endDate = new Date(targetYear, 11, 31);
  const endDateDay = startOfDay(endDate);

  const dayCounts = new Map();
  activities.forEach((activity) => {
    const day = startOfDay(activity.createdAt);
    if (day < startDate || day > endDateDay) {
      return;
    }
    const key = formatDateKey(day);
    dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
  });

  let totalSubmissions = 0;
  let totalActiveDays = 0;
  dayCounts.forEach((count) => {
    totalSubmissions += count;
    if (count > 0) {
      totalActiveDays += 1;
    }
  });

  const streakEnd = targetYear === today.getFullYear() ? today : endDateDay;

  let currentStreak = 0;
  for (let cursor = new Date(streakEnd); cursor >= startDate; ) {
    const key = formatDateKey(cursor);
    const count = dayCounts.get(key) || 0;
    if (count === 0) {
      break;
    }
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let maxStreak = 0;
  let streak = 0;
  for (let cursor = new Date(startDate); cursor <= streakEnd; ) {
    const key = formatDateKey(cursor);
    const count = dayCounts.get(key) || 0;
    if (count > 0) {
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const gridStart = startOfWeek(startDate);
  const gridEnd = new Date(endDateDay);
  const endDayIndex = (gridEnd.getDay() + 6) % 7;
  gridEnd.setDate(gridEnd.getDate() + (6 - endDayIndex));

  const days = [];
  for (let cursor = new Date(gridStart); cursor <= gridEnd; ) {
    const day = startOfDay(cursor);
    const key = formatDateKey(day);
    const inRange = day >= startDate && day <= endDateDay;
    const count = inRange ? dayCounts.get(key) || 0 : 0;
    const level = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4;

    days.push({
      date: new Date(day),
      count,
      level,
      isPlaceholder: !inRange,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  const monthLabels = weeks.map((week) => {
    const labelDay = week.find(
      (day) => !day.isPlaceholder && day.date.getDate() === 1
    );
    return labelDay
      ? labelDay.date.toLocaleString("en-US", { month: "short" })
      : "";
  });

  return {
    year: targetYear,
    totalSubmissions,
    totalActiveDays,
    currentStreak,
    maxStreak,
    weeks,
    monthLabels,
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

export const updateActivity = async (userId, activityId, updates) => {
  try {
    if (!userId || !activityId) {
      throw new Error("Missing user ID or activity ID");
    }

    const activityRef = ref(rtdb, `activities/${userId}/${activityId}`);
    const safeUpdates = {
      ...updates,
      updatedAt: Date.now(),
    };

    await update(activityRef, safeUpdates);
  } catch (error) {
    console.error("Failed to update activity", error);
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

export const getRangeAnalytics = async (userId, rangeType, anchorDate) => {
  try {
    const { rangeStart, rangeEnd } = getRangeConfig(rangeType, anchorDate);
    const activitiesRef = ref(rtdb, `activities/${userId}`);
    const snapshot = await get(activitiesRef);

    if (!snapshot.exists()) {
      return buildRangeAnalytics([], rangeType, anchorDate);
    }

    const activities = [];
    snapshot.forEach((child) => {
      const activity = mapActivityDocument(child.key, child.val());
      if (activity.createdAt >= rangeStart && activity.createdAt <= rangeEnd) {
        activities.push(activity);
      }
    });

    // Sort by createdAt ascending
    activities.sort((a, b) => a.createdAt - b.createdAt);
    return buildRangeAnalytics(activities, rangeType, anchorDate);
  } catch (error) {
    console.error("Failed to build range analytics", error);
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

export const subscribeRangeAnalytics = (userId, rangeType, callback, anchorDate) => {
  if (!userId) {
    callback(null);
    return () => {};
  }

  const { rangeStart, rangeEnd } = getRangeConfig(rangeType, anchorDate);
  const activitiesRef = ref(rtdb, `activities/${userId}`);

  const unsubscribe = onValue(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(buildRangeAnalytics([], rangeType, anchorDate));
        return;
      }

      const activities = [];
      snapshot.forEach((child) => {
        const activity = mapActivityDocument(child.key, child.val());
        if (activity.createdAt >= rangeStart && activity.createdAt <= rangeEnd) {
          activities.push(activity);
        }
      });

      // Sort by createdAt ascending
      activities.sort((a, b) => a.createdAt - b.createdAt);
      callback(buildRangeAnalytics(activities, rangeType, anchorDate));
    },
    (error) => {
      console.error("Realtime range analytics failed", error);
      callback(null);
    }
  );

  return unsubscribe;
};

const getAvailableYears = (activities) => {
  const years = new Set();
  activities.forEach((activity) => {
    years.add(activity.createdAt.getFullYear());
  });
  if (!years.size) {
    years.add(new Date().getFullYear());
  }
  return Array.from(years).sort((a, b) => b - a);
};

export const subscribeUserHeatmap = (userId, callback, year) => {
  if (!userId) {
    callback(null);
    return () => {};
  }

  const activitiesRef = ref(rtdb, `activities/${userId}`);

  const unsubscribe = onValue(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback({
          heatmap: buildHeatmapData([], year),
          availableYears: [new Date().getFullYear()],
        });
        return;
      }

      const activities = [];
      snapshot.forEach((child) => {
        activities.push(mapActivityDocument(child.key, child.val()));
      });

      activities.sort((a, b) => a.createdAt - b.createdAt);
      const availableYears = getAvailableYears(activities);
      callback({
        heatmap: buildHeatmapData(activities, year || availableYears[0]),
        availableYears,
      });
    },
    (error) => {
      console.error("Realtime heatmap failed", error);
      callback(null);
    }
  );

  return unsubscribe;
};

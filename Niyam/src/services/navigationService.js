const navigationSets = {
  dashboard: [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "grid_view" },
    { id: "history", label: "History", path: "/history", icon: "history" },
    { id: "analytics", label: "Analytics", path: "/analytics", icon: "query_stats" },
    { id: "settings", label: "Settings", path: null, icon: "settings" },
  ],
  history: [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { id: "history", label: "History", path: "/history", icon: "history" },
    { id: "analytics", label: "Analytics", path: "/analytics", icon: "insights" },
    { id: "settings", label: "Settings", path: null, icon: "settings" },
  ],
  analytics: [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { id: "history", label: "History", path: "/history", icon: "history" },
    { id: "analytics", label: "Analytics", path: "/analytics", icon: "analytics" },
    { id: "settings", label: "Settings", path: null, icon: "settings" },
  ],
};

export const getPrimaryNavigation = (variant = "dashboard") =>
  navigationSets[variant] || navigationSets.dashboard;

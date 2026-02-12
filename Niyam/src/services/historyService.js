const historyData = {
  header: {
    navTitle: "Activity History",
    title: "History",
    subtitle: "Review and manage your past focus sessions and activity logs.",
    rangeTabs: ["Last 7 days", "30 days", "Months"],
    exportLabel: "Export CSV",
    customRangeLabel: "Custom Range",
  },
  timeline: [
    {
      id: "today",
      label: "Today",
      dateLabel: "Oct 26, 2023",
      isCurrent: true,
      entries: [
        {
          id: "hist-1",
          title: "Client UI Design System",
          category: "Deep Work",
          categoryClass: "bg-blue-50 text-blue-800",
          duration: "2h 15m",
          startTime: "Started at 09:45 AM",
        },
        {
          id: "hist-2",
          title: "Morning Meditation",
          category: "Health",
          categoryClass: "bg-green-50 text-green-700",
          duration: "10m",
          startTime: "Started at 08:15 AM",
        },
      ],
    },
    {
      id: "yesterday",
      label: "Yesterday",
      dateLabel: "Oct 25, 2023",
      isCurrent: false,
      entries: [
        {
          id: "hist-3",
          title: "Feature Documentation",
          category: "Writing",
          categoryClass: "bg-purple-50 text-purple-700",
          duration: "1h 45m",
          startTime: "Started at 02:30 PM",
        },
      ],
    },
    {
      id: "oct-24",
      label: "Oct 24, 2023",
      dateLabel: "Tuesday",
      isCurrent: false,
      entries: [
        {
          id: "hist-4",
          title: "Database Schema Migration",
          category: "Development",
          categoryClass: "bg-orange-50 text-orange-700",
          duration: "3h 20m",
          startTime: "Started at 10:00 AM",
        },
      ],
    },
  ],
  footer: {
    buttonLabel: "Load More Activities",
    helperText: "Showing 4 of 128 entries",
  },
};

export const getHistoryData = async () => historyData;

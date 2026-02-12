const dashboardData = {
  user: {
    name: "Alex Rivera",
    plan: "Premium Member",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAETCzEEEPSgRTQukA2sL2UFomfv5o7vJWJNNnt28fK35mkXdOiDC_u49ktBKoqrY2vhAlZ7N6XTkIhfDykbl5N7egAx_Vt_eVM9wz4oxd8USZmrpp8zbkkZCTwVz-cYWUiJRPGWOa7e1ymdF7j3m5betgew27GQGDD-oAQ16PW6FZa2HbyqjrBVbDBnCfOVMtnfPxQb_6NlESmHrdGwbqEyB8FQG5qLb50isu1Muy2sTcAi9wl_vPtCoZqqFEN1uQpSHYfD3H11k8T",
  },
  activityForm: {
    placeholder: "What are you working on?",
    durationPlaceholder: "45",
    categories: ["Deep Work", "Meetings", "Learning", "Admin"],
  },
  recentActivities: [
    {
      id: "act-1",
      title: "Weekly Planning",
      icon: "description",
      duration: "45 mins",
      timeLabel: "Today, 09:15 AM",
      category: "Deep Work",
      categoryClass: "text-indigo-600",
    },
    {
      id: "act-2",
      title: "Product Sync",
      icon: "groups",
      duration: "30 mins",
      timeLabel: "Today, 11:30 AM",
      category: "Meetings",
      categoryClass: "text-purple-600",
    },
    {
      id: "act-3",
      title: "React Advanced Course",
      icon: "school",
      duration: "60 mins",
      timeLabel: "Today, 02:00 PM",
      category: "Learning",
      categoryClass: "text-emerald-600",
    },
  ],
  summary: {
    totalMinutes: "135",
    delta: "+12%",
    deltaLabel: "vs yesterday",
    items: [
      {
        id: "deep-work",
        label: "Deep Work",
        valueLabel: "45m - 33%",
        barClass: "w-[33%]",
        barColorClass: "bg-indigo-500",
      },
      {
        id: "meetings",
        label: "Meetings",
        valueLabel: "30m - 22%",
        barClass: "w-[22%]",
        barColorClass: "bg-purple-500",
      },
      {
        id: "learning",
        label: "Learning",
        valueLabel: "60m - 45%",
        barClass: "w-[45%]",
        barColorClass: "bg-emerald-500",
      },
    ],
    goal: {
      title: "Goal Progress",
      subtitle: "85% of daily target",
    },
  },
};

export const getDashboardData = async () => dashboardData;

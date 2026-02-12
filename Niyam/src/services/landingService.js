const landingData = {
  brand: {
    name: "FocusFlow",
    icon: "bolt",
  },
  navLinks: [
    { id: "features", label: "Features", href: "#features" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
    { id: "about", label: "About", href: "#about" },
  ],
  hero: {
    badge: "Version 2.0 Now Live",
    title: "Master your routine,",
    highlight: "reclaim your focus.",
    description:
      "The minimalist workspace for high-performers to track habits, manage deep work sessions, and visualize progress without the friction.",
    actions: {
      primary: "Start Free Trial",
      secondary: "Watch Product Tour",
    },
  },
  mockup: {
    sidebar: {
      brand: "FocusFlow",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "grid_view", active: true },
        { id: "habits", label: "Habit Tracker", icon: "checklist" },
        { id: "timer", label: "Focus Timer", icon: "timer" },
        { id: "performance", label: "Performance", icon: "bar_chart" },
        { id: "schedule", label: "Schedule", icon: "calendar_today" },
      ],
      goal: {
        label: "Weekly Goal",
        progressText: "75% Complete",
        progressClass: "w-[75%]",
      },
    },
    header: {
      searchPlaceholder: "Quick find...",
    },
    welcome: {
      greeting: "Welcome back, Alex",
      title: "Today's Focus",
      scope: "This Week",
    },
    stats: [
      { id: "score", label: "Focus Score", value: "94.2", valueClass: "text-[#4F46E5]" },
      { id: "deep", label: "Deep Work", value: "6.5h", valueClass: "text-slate-900" },
      { id: "streak", label: "Streak", value: "12", valueClass: "text-slate-900", icon: "local_fire_department", iconClass: "text-orange-500" },
    ],
    avatarImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASbZezv-J43dtBnHGCaAc7XpKFHZRSMX8OOThh5uvLsxLMAdOMV_ZZhWYB3mzMdWrUR1iRSHp0DPx4TkcQOe31cpOt2Ezhjg1AfSgQ7zERevEdQL-RV9Z7ZdLZ_jq2cbMJd4aTBnG9CrcoVj19ORo8Q21W-kplaS4SM26iRKByp1cfxjJlV7WbqU30ckq_EnyhN_QmvzqORDXZN0p7bcgHHooda9m6Zvy1Mj_wB53SH-vIIfuAgPxpJfSTV7QKu3E9hcUn5s_-VkoP",
    analyticsImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCC_HLlXUIAiDSPnHNlyewJEdqG_B_dJsMTzH8UMFZjOZPzgRuTnFTMm-YZeElZqEG-CBW71-ucG3SLDqIzZqvkXsp5DOjkpztf5kzuqW7TAJAYsXlXjKEOFVtbc8zUGVhYw23bn8rMgcjKlIBHhwDIeLomw4DCkXXD8XAQCZO4kvmS2JgI7kI6bAN0PvoX2syqYHF6t1RHPqWSPzVeZtbDmVzVXp9JoethzCTxdDhVr0D9KBfoMactSVsfZ2ZQZwVpq7chaIlyQSjR",
  },
  features: [
    {
      id: "sync",
      title: "Smart Habit Sync",
      icon: "sync_saved_locally",
      description:
        "Atomic habits tracked seamlessly across desktop and mobile. Our \"Instant Log\" feature ensures you never miss a beat.",
      iconClass: "bg-indigo-50 text-[#4F46E5]",
      hoverClass: "hover:shadow-indigo-500/10",
    },
    {
      id: "data",
      title: "Data, Simplified",
      icon: "query_stats",
      description:
        "Visual feedback that makes sense. No complicated charts - just clear indicators of your progress and consistency.",
      iconClass: "bg-emerald-50 text-emerald-600",
      hoverClass: "hover:shadow-emerald-500/10",
    },
    {
      id: "deep-work",
      title: "Deep Work Mode",
      icon: "timer",
      description:
        "Integrated focus timers that help you enter flow states faster. Connect habits to time-boxed work sessions automatically.",
      iconClass: "bg-orange-50 text-orange-600",
      hoverClass: "hover:shadow-orange-500/10",
    },
  ],
  featuresSection: {
    eyebrow: "The System",
    title: "Built for clarity and performance.",
    subtitle:
      "Traditional apps are too complex. FocusFlow strips away the noise to help you execute on what matters.",
  },
  pricing: {
    title: "Your best work starts with a better routine.",
    description:
      "Join over 15,000 creators, entrepreneurs, and high-performers using FocusFlow to optimize their days.",
    primaryAction: "Get Started Free",
    secondaryAction: "View Enterprise Plans",
    footnote: "No credit card required - 14-day premium trial - Unlimited habits",
  },
  footer: {
    description:
      "The science-backed routine tracker designed for the modern workspace. Build habits that last.",
    sections: [
      {
        id: "product",
        title: "Product",
        links: ["Features", "Integrations", "Pricing", "Changelog"],
      },
      {
        id: "resources",
        title: "Resources",
        links: ["Documentation", "API Reference", "Habit Science"],
      },
      {
        id: "company",
        title: "Company",
        links: ["About Us", "Blog", "Careers"],
      },
      {
        id: "legal",
        title: "Legal",
        links: ["Privacy", "Terms", "Cookie Policy"],
      },
    ],
    copyright: "(c) 2024 FocusFlow Inc. Precision tools for progress.",
    status: "All systems operational",
  },
};

export const getLandingData = async () => landingData;

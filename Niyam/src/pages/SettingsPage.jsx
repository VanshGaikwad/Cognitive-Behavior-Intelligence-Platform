import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { getPrimaryNavigation } from "../services/navigationService";
import { useAuth } from "../context/AuthContext";

const mergeSettings = (defaults, stored) => {
  if (!stored) return defaults;
  return {
    ...defaults,
    ...stored,
    profile: { ...defaults.profile, ...(stored.profile || {}) },
    preferences: { ...defaults.preferences, ...(stored.preferences || {}) },
    notifications: { ...defaults.notifications, ...(stored.notifications || {}) },
    security: { ...defaults.security, ...(stored.security || {}) },
    data: { ...defaults.data, ...(stored.data || {}) },
  };
};

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full relative border transition-colors outline-none focus:ring-2 focus:ring-[#4F46E5]/30 shrink-0 ${
      checked ? "bg-[#4F46E5] border-[#4F46E5]" : "bg-slate-100 border-slate-200"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navigation = getPrimaryNavigation("dashboard");

  const defaults = useMemo(
    () => ({
      profile: {
        fullName: user?.name || "",
        email: user?.email || "",
        role: "Product Designer",
        team: "Focus Ops",
      },
      preferences: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        weekStart: "Monday",
        compactSidebar: false,
        reduceMotion: false,
      },
      notifications: {
        dailySummary: true,
        weeklyReport: true,
        goalAlerts: true,
        productUpdates: false,
      },
      security: {
        twoFactor: false,
        sessionTimeout: "30",
      },
      data: {
        autoExport: false,
        shareAnonymous: false,
      },
    }),
    [user]
  );

  const storageKey = `niyam-settings-${user?.id || "guest"}`;
  const [settings, setSettings] = useState(defaults);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const stored = raw ? JSON.parse(raw) : null;
    setSettings(mergeSettings(defaults, stored));
  }, [defaults, storageKey]);

  const updateField = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    setStatus("Settings saved");
    setTimeout(() => setStatus(""), 2000);
  };

  const handleResetPassword = () => {
    setStatus("Password reset link sent");
    setTimeout(() => setStatus(""), 2000);
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
    <div className="bg-[#F1F5F9] min-h-screen font-['Inter'] text-slate-900">
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
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Settings
            </h1>
          }
          right={
            <div className="flex items-center gap-3">
              {status ? (
                <span className="text-xs font-semibold text-emerald-600">{status}</span>
              ) : null}
              <button
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#4F46E5] text-white rounded-sm shadow-sm hover:bg-indigo-700 transition-colors"
                onClick={handleSave}
                type="button"
              >
                Save Changes
              </button>
            </div>
          }
        />

        <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Profile
                    </h2>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      Keep your profile current
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    {user?.plan || "Premium"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Full name
                    </label>
                    <input
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.profile.fullName}
                      onChange={(event) =>
                        updateField("profile", "fullName", event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Email
                    </label>
                    <input
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.profile.email}
                      onChange={(event) =>
                        updateField("profile", "email", event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Role
                    </label>
                    <input
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.profile.role}
                      onChange={(event) =>
                        updateField("profile", "role", event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Team
                    </label>
                    <input
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.profile.team}
                      onChange={(event) =>
                        updateField("profile", "team", event.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                  Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Timezone
                    </label>
                    <input
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.preferences.timezone}
                      onChange={(event) =>
                        updateField("preferences", "timezone", event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Week starts
                    </label>
                    <select
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.preferences.weekStart}
                      onChange={(event) =>
                        updateField("preferences", "weekStart", event.target.value)
                      }
                    >
                      <option>Monday</option>
                      <option>Sunday</option>
                      <option>Saturday</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Compact sidebar</span>
                    <Toggle
                      checked={settings.preferences.compactSidebar}
                      onChange={(value) =>
                        updateField("preferences", "compactSidebar", value)
                      }
                      label="Compact sidebar"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Reduce motion</span>
                    <Toggle
                      checked={settings.preferences.reduceMotion}
                      onChange={(value) =>
                        updateField("preferences", "reduceMotion", value)
                      }
                      label="Reduce motion"
                    />
                  </label>
                </div>
              </section>

              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                  Notifications
                </h2>
                <div className="space-y-4">
                  {[
                    { key: "dailySummary", label: "Daily focus summary" },
                    { key: "weeklyReport", label: "Weekly performance report" },
                    { key: "goalAlerts", label: "Goal progress alerts" },
                    { key: "productUpdates", label: "Product updates" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <Toggle
                        checked={settings.notifications[item.key]}
                        onChange={(value) =>
                          updateField("notifications", item.key, value)
                        }
                        label={item.label}
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                  Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Session timeout (minutes)
                    </label>
                    <select
                      className="block w-full border-slate-200 bg-slate-50/50 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-all rounded-sm px-3 py-2"
                      value={settings.security.sessionTimeout}
                      onChange={(event) =>
                        updateField("security", "sessionTimeout", event.target.value)
                      }
                    >
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="120">120</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between border border-slate-200 rounded-sm p-3 bg-slate-50/40">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Two-factor auth</p>
                      <p className="text-xs text-slate-500">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Toggle
                      checked={settings.security.twoFactor}
                      onChange={(value) => updateField("security", "twoFactor", value)}
                      label="Two-factor auth"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Reset password</p>
                    <p className="text-xs text-slate-500">
                      Send a password reset link to your inbox
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-600 hover:text-[#4F46E5] hover:border-[#4F46E5] rounded-sm transition-colors"
                    onClick={handleResetPassword}
                    type="button"
                  >
                    Send link
                  </button>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Account
                </h2>
                <div className="flex items-center gap-4">
                  <img
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    src={user?.avatar}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.name || "Niyam user"}
                    </p>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400">
                      {user?.plan || "Premium"}
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Member since</span>
                    <span className="text-slate-700 font-semibold">2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Region</span>
                    <span className="text-slate-700 font-semibold">APAC</span>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Data & privacy
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Auto-export history</span>
                    <Toggle
                      checked={settings.data.autoExport}
                      onChange={(value) => updateField("data", "autoExport", value)}
                      label="Auto-export history"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Share anonymous stats</span>
                    <Toggle
                      checked={settings.data.shareAnonymous}
                      onChange={(value) => updateField("data", "shareAnonymous", value)}
                      label="Share anonymous stats"
                    />
                  </label>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

import React from "react";
import { NavLink } from "react-router-dom";

const variants = {
  dashboard: {
    aside:
      "fixed inset-y-0 left-0 w-64 bg-[#F8FAFC] border-r border-slate-200 z-50",
    brandWrap: "h-16 flex items-center px-8",
    brandText: "font-bold text-base tracking-tight text-slate-900",
    brandBadge: "bg-[#4F46E5]",
    nav: "flex-1 px-4 py-6",
    itemBase: "flex items-center px-4 py-2.5 text-sm transition-all rounded-sm",
    itemActive: "bg-white text-[#4F46E5] shadow-sm ring-1 ring-slate-200/50 font-semibold",
    itemInactive: "text-slate-500 hover:text-slate-900 hover:bg-white/50 font-medium",
    icon: "mr-3",
    footer: "px-4 py-6 border-t border-slate-200",
  },
  history: {
    aside:
      "w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20",
    brandWrap: "p-6 flex items-center gap-3",
    brandText: "font-bold text-lg tracking-tight",
    brandBadge: "bg-[#137fec]",
    nav: "flex-1 px-3 py-4 space-y-1",
    itemBase: "flex items-center gap-3 px-3 py-2 rounded transition-colors group text-sm",
    itemActive: "bg-[#eff6ff] text-[#137fec] border-r-2 border-[#137fec]",
    itemInactive:
      "text-slate-600 hover:bg-slate-50 rounded font-medium text-sm",
    icon: "",
    footer: "mt-auto border-t border-slate-100",
  },
  analytics: {
    aside: "w-64 border-r border-slate-200 bg-white flex flex-col",
    brandWrap: "p-6",
    brandText: "text-xl font-semibold tracking-tight",
    brandBadge: "bg-[#3b82f6]",
    nav: "flex-1 px-4 space-y-1 mt-2",
    itemBase: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
    itemActive:
      "text-[#3b82f6] bg-blue-50/80 font-semibold border-r-2 border-[#3b82f6]",
    itemInactive: "text-slate-500 hover:bg-slate-50 transition-colors",
    icon: "",
    footer: "mt-auto px-4 pb-4 space-y-4",
  },
};

const Sidebar = ({ variant, brand, items, footer }) => {
  const styles = variants[variant] || variants.dashboard;

  return (
    <aside className={styles.aside}>
      <div className={styles.brandWrap}>
        <div className="flex items-center gap-2.5">
          <div
            className={`w-6 h-6 rounded-sm flex items-center justify-center ${
              brand.badgeClass || styles.brandBadge
            }`}
          >
            <span
              className={`${brand.iconClass || "material-symbols-outlined"} text-white ${
                brand.iconSizeClass || "text-[16px]"
              }`}
            >
              {brand.icon}
            </span>
          </div>
          <span className={styles.brandText}>{brand.name}</span>
        </div>
      </div>
      <nav className={styles.nav}>
        <div className="space-y-1">
          {items.map((item) => {
            if (!item.path) {
              return (
                <div
                  key={item.id}
                  className={`${styles.itemBase} ${styles.itemInactive}`}
                >
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.itemBase} ${isActive ? styles.itemActive : styles.itemInactive}`
                }
              >
                <span className={`material-symbols-outlined ${styles.icon}`}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </aside>
  );
};

export default Sidebar;

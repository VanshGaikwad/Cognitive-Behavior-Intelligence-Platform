import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const variants = {
  dashboard: {
    aside:
      "fixed inset-y-0 left-0 w-64 bg-[#F8FAFC] border-r border-slate-200 z-50 flex flex-col",
    brandWrap: "h-16 flex items-center px-8",
    brandText: "font-bold text-base tracking-tight text-slate-900",
    brandBadge: "bg-[#4F46E5]",
    nav: "flex-1 px-4 py-6",
    itemBase: "flex items-center px-4 py-2.5 text-sm transition-all rounded-sm",
    itemActive: "bg-white text-[#4F46E5] shadow-sm ring-1 ring-slate-200/50 font-semibold",
    itemInactive: "text-slate-500 hover:text-slate-900 hover:bg-white/50 font-medium",
    icon: "mr-3",
    footer: "px-4 py-6 border-t border-slate-200 mt-auto",
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
  const iconText = brand.iconText || (brand.name ? brand.name[0] : "");
  const [isOpen, setIsOpen] = useState(false);

  const renderBrand = ({ badgeSizeClass, textClass } = {}) => (
    <div className="flex items-center gap-2.5">
      <div
        className={`${badgeSizeClass || brand.badgeSizeClass || "w-6 h-6"} ${
          brand.badgeShapeClass || "rounded-sm"
        } flex items-center justify-center ${brand.badgeClass || styles.brandBadge}`}
      >
        {brand.logoSrc ? (
          <img
            src={brand.logoSrc}
            alt={brand.name}
            className={brand.logoClass || "w-4 h-4 object-contain"}
          />
        ) : (
          <span
            className={`${
              brand.iconClass || "text-[14px] font-bold"
            } text-white ${brand.iconSizeClass || ""}`}
          >
            {brand.icon || iconText}
          </span>
        )}
      </div>
      <span className={`${styles.brandText} ${brand.textClass || ""} ${textClass || ""}`}>
        {brand.name}
      </span>
    </div>
  );

  return (
    <>
      <aside className={`${styles.aside} hidden md:flex`}>
      <div className={styles.brandWrap}>
        {renderBrand()}
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

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
        {renderBrand({ badgeSizeClass: "w-8 h-8", textClass: "text-base" })}
        <button
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
      </div>

      {isOpen ? (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-slate-900/30"
            type="button"
            onClick={() => setIsOpen(false)}
          ></button>
          <aside className="absolute left-0 top-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
              {renderBrand({ badgeSizeClass: "w-8 h-8", textClass: "text-base" })}
              <button
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
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
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `${styles.itemBase} ${
                          isActive ? styles.itemActive : styles.itemInactive
                        }`
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
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;

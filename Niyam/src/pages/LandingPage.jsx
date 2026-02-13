import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getLandingData } from "../services/landingService";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const [data, setData] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const tourVideoRef = useRef(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const loadLanding = async () => {
      const landing = await getLandingData();
      setData(landing);
    };

    loadLanding();
  }, []);

  if (!data) {
    return null;
  }

  const isLoggedIn = Boolean(user);
  const getStartedHref = isLoggedIn ? "/dashboard" : "/auth?mode=signup";

  const handleCloseTour = () => {
    setShowTour(false);
    if (tourVideoRef.current) {
      tourVideoRef.current.pause();
      tourVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="font-['Inter'] text-slate-900 bg-white">
      <nav className="fixed top-0 z-100 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <Link className="flex items-center gap-2.5 group" to="/">
                <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {data.brand.logoSrc ? (
                    <img
                      alt={data.brand.name}
                      className="w-8 h-8 object-contain"
                      src={data.brand.logoSrc}
                    />
                  ) : (
                    <span className="text-[#5b4ed8] text-2xl font-bold">
                      {data.brand.iconText || "N"}
                    </span>
                  )}
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  {data.brand.name}
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                {data.navLinks.map((link) => (
                  <a
                    key={link.id}
                    className="text-sm font-semibold text-slate-500 hover:text-[#4F46E5] px-4 py-2 transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              {!loading && !isLoggedIn ? (
                <Link
                  className="text-sm font-bold text-slate-600 hover:text-[#4F46E5] transition-colors"
                  to="/auth?mode=login"
                >
                  Log in
                </Link>
              ) : null}
              <Link
                className="bg-[#4F46E5] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
                to={getStartedHref}
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 overflow-hidden bg-[radial-gradient(circle_at_50%_-20%,#EEF2FF_0%,#FFFFFF_60%)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-xs font-bold mb-8 tracking-wide uppercase">
            <span className="flex h-2 w-2 rounded-full bg-[#4F46E5] animate-pulse mr-2.5"></span>
            {data.hero.badge}
          </div>
          <h1 className="text-5xl lg:text-[5.5rem] font-black tracking-tight text-slate-900 mb-8 leading-[1.05]">
            {data.hero.title}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4F46E5] to-indigo-400">
              {data.hero.highlight}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-500 mb-12 leading-relaxed">
            {data.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link
              className="w-full sm:w-auto px-10 py-5 bg-[#4F46E5] text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all text-lg shadow-2xl shadow-indigo-200 flex items-center justify-center group"
              to={getStartedHref}
            >
              {isLoggedIn ? "Go to Dashboard" : data.hero.actions.primary}
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <button
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-lg flex items-center justify-center gap-2"
              type="button"
              onClick={() => setShowTour(true)}
            >
              <span className="material-symbols-outlined text-2xl text-slate-400">
                play_circle
              </span>
              {data.hero.actions.secondary}
            </button>
          </div>

          <div className="relative max-w-275 mx-auto mt-20">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-full bg-[#4F46E5]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="relative bg-white rounded-3xl shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-row h-160">
              <aside className="w-72 flex max-lg:hidden border-r border-slate-100 bg-white flex-col p-5 space-y-6">
                <div className="flex items-center gap-2.5 px-3 mb-8">
                  {data.brand.logoSrc ? (
                    <img
                      alt={data.brand.name}
                      className="w-7 h-7 object-contain"
                      src={data.brand.logoSrc}
                    />
                  ) : (
                    <span className="text-[#5b4ed8] text-lg font-bold">
                      {data.brand.iconText || "N"}
                    </span>
                  )}
                  <span className="font-bold text-slate-900 text-sm tracking-tight">
                    {data.mockup.sidebar.brand}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {data.mockup.sidebar.items.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm transition-all ${
                        item.active
                          ? "bg-indigo-50 text-[#4F46E5] font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-8 border-t border-slate-100">
                  <div className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all">
                    <span className="material-symbols-outlined text-xl">settings</span>
                    Preferences
                  </div>
                  <div className="mt-4 px-4 py-4 bg-slate-50 rounded-2xl">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {data.mockup.sidebar.goal.label}
                    </p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`bg-[#4F46E5] h-full rounded-full ${data.mockup.sidebar.goal.progressClass}`}
                      ></div>
                    </div>
                    <p className="mt-2 text-[12px] font-semibold text-slate-700">
                      {data.mockup.sidebar.goal.progressText}
                    </p>
                  </div>
                </div>
              </aside>

              <div className="flex-1 flex flex-col bg-slate-50/50">
                <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8">
                  <div className="flex items-center gap-6">
                    <div className="h-8 w-64 bg-slate-50 rounded-lg border border-slate-100 flex items-center px-3">
                      <span className="material-symbols-outlined text-slate-300 text-sm">
                        search
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {data.mockup.header.searchPlaceholder}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 text-sm">
                        notifications
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                      <img alt="Avatar" src={data.mockup.avatarImage} />
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8 overflow-hidden h-full">
                  <div className="flex items-end justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">
                        {data.mockup.welcome.greeting}
                      </h4>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        {data.mockup.welcome.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                        {data.mockup.welcome.scope}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {data.mockup.stats.map((stat) => (
                      <div
                        key={stat.id}
                        className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm"
                      >
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {stat.label}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-2xl font-black ${
                              stat.valueClass || "text-slate-900"
                            }`}
                          >
                            {stat.value}
                          </p>
                          {stat.icon ? (
                            <span
                              className={`material-symbols-outlined ${stat.iconClass}`}
                            >
                              {stat.icon}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm h-full overflow-hidden">
                    <img
                      alt="Visualized Dashboard Analytics"
                      className="w-full h-full object-cover"
                      src={data.mockup.analyticsImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black text-[#4F46E5] uppercase tracking-[0.3em] mb-4">
              {data.featuresSection.eyebrow}
            </h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              {data.featuresSection.title}
            </h3>
            <p className="mt-6 text-slate-500 text-lg max-w-2xl mx-auto">
              {data.featuresSection.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.features.map((feature) => (
              <div
                key={feature.id}
                className={`group bg-slate-50/50 p-10 rounded-4xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${feature.hoverClass}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform ${feature.iconClass}`}
                >
                  <span className="material-symbols-outlined text-3xl font-bold">
                    {feature.icon}
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-5 text-slate-900">
                  {feature.title}
                </h4>
                <p className="text-slate-500 leading-relaxed text-[16px]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center text-white">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4F46E5]/20 blur-[120px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tight">
                {data.pricing.title}
              </h2>
              <p className="text-slate-400 text-lg lg:text-xl mb-12 font-medium leading-relaxed">
                {data.pricing.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  className="w-full sm:w-auto bg-[#4F46E5] hover:bg-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-950/40 hover:scale-105"
                  to="/auth?mode=signup"
                >
                  {data.pricing.primaryAction}
                </Link>
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm border border-white/10">
                  {data.pricing.secondaryAction}
                </button>
              </div>
              <p className="mt-10 text-slate-500 font-semibold text-sm">
                {data.pricing.footnote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white pt-32 pb-16" id="about">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-8">
                {data.brand.logoSrc ? (
                  <img
                    alt={data.brand.name}
                    className="w-8 h-8 object-contain"
                    src={data.brand.logoSrc}
                  />
                ) : (
                  <span className="text-[#5b4ed8] text-2xl font-bold">
                    {data.brand.iconText || "N"}
                  </span>
                )}
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {data.brand.name}
                </span>
              </div>
              <p className="text-slate-500 max-w-xs mb-8 text-[15px] leading-relaxed">
                {data.footer.description}
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-indigo-50 transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-indigo-50 transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {data.footer.sections.map((section) => (
              <div key={section.id}>
                <h5 className="text-slate-900 font-bold mb-8 text-xs uppercase tracking-[0.2em]">
                  {section.title}
                </h5>
                <ul className="space-y-4 text-[14px]">
                  {section.links.map((link) => (
                    <li key={link}>
                      <button className="text-slate-500 hover:text-[#4F46E5] font-medium transition-colors">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-slate-400">
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <p>{data.footer.copyright}</p>
              <span className="hidden md:inline text-slate-300">|</span>
              <p>
                Made by Vansh Gaikwad ·{" "}
                <a
                  className="hover:text-[#4F46E5] transition-colors"
                  href="mailto:vanshgaikwad72@gmail.com"
                >
                  vanshgaikwad72@gmail.com
                </a>
              </p>
            </div>
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {data.footer.status}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {showTour ? (
        <div
          className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseTour}
          role="presentation"
        >
          <div
            className="w-full max-w-sm sm:max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Product Tour</p>
              <button
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700"
                type="button"
                onClick={handleCloseTour}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <video
              ref={tourVideoRef}
              className="w-full h-auto"
              src="/product_video.mp4"
              controls
              autoPlay
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LandingPage;

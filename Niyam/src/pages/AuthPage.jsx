import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuthPageData } from "../services/authPageService";

const AuthPage = () => {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("login");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, signup } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const authData = await getAuthPageData();
      setData(authData);
    };

    loadData();
  }, []);

  useEffect(() => {
    const nextMode = searchParams.get("mode");
    if (nextMode === "signup") {
      setMode("signup");
    } else {
      setMode("login");
    }
  }, [searchParams]);

  if (!data) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (mode === "signup") {
        await signup({
          name: formState.name,
          email: formState.email,
          password: formState.password,
        });
      } else {
        await login({
          email: formState.email,
          password: formState.password,
        });
      }

      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Authentication failed", error);
      setErrorMessage("Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setErrorMessage("");
    try {
      await loginWithGoogle();
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Google sign-in failed", error);
      setErrorMessage("Google sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-['Inter'] bg-[#f6f7f8] text-slate-900 min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#137fec]/10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,_#137fec_1px,_transparent_0)] [background-size:40px_40px]"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
            <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <img
                alt="Productivity"
                className="w-full max-w-lg rounded-xl shadow-2xl"
                src={data.hero.image}
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              {data.hero.title} <span className="text-[#137fec]">{data.hero.highlight}</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              {data.hero.description}
            </p>
            <div className="mt-12 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {data.hero.avatars.map((avatar, index) => (
                  <img
                    key={avatar}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    src={avatar}
                    alt={`User avatar ${index + 1}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-600">
                {data.hero.trustLabel}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#137fec]/10 to-transparent pointer-events-none"></div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-white">
          <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#137fec] rounded-lg flex items-center justify-center">
              <span className="material-icons text-white">{data.brand.icon}</span>
            </div>
            <span className="font-bold text-xl tracking-tight">{data.brand.name}</span>
          </div>
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <div className="hidden lg:flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-[#137fec] rounded-lg flex items-center justify-center">
                  <span className="material-icons text-white text-sm">{data.brand.icon}</span>
                </div>
                <span className="font-bold text-lg tracking-tight">{data.brand.name}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-slate-600">
                {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
                <button
                  className="text-[#137fec] hover:underline font-medium ml-1"
                  onClick={() =>
                    setMode((prev) => (prev === "signup" ? "login" : "signup"))
                  }
                >
                  {mode === "signup" ? "Sign in" : "Create one for free"}
                </button>
              </p>
            </div>

            <div
              className={`grid gap-4 mb-8 ${
                data.socialLogins.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {data.socialLogins.map((option) => (
                <button
                  key={option.id}
                  className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  type="button"
                  onClick={option.id === "google" ? handleGoogleLogin : undefined}
                >
                  <img
                    alt={option.label}
                    className="h-5 w-5 mr-2"
                    src={option.icon}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 uppercase tracking-widest text-xs font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    name="name"
                    placeholder="Alex Rivera"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    type="text"
                  />
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  name="email"
                  placeholder="name@company.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <button className="text-xs font-medium text-[#137fec] hover:underline" type="button">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    name="password"
                    placeholder="********"
                    value={formState.password}
                    onChange={handleChange}
                    required
                    type="password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    type="button"
                  >
                    <span className="material-icons text-lg">visibility</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-[#137fec] focus:ring-[#137fec] border-slate-300 rounded"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-slate-600" htmlFor="remember-me">
                  Remember me for 30 days
                </label>
              </div>
              <button
                className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all active:scale-[0.98]"
                disabled={submitting}
                type="submit"
              >
                {submitting
                  ? "Working..."
                  : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>
            {errorMessage ? (
              <p className="mt-3 text-xs text-red-500 text-center">{errorMessage}</p>
            ) : null}

            <div className="mt-12 text-center">
              <p className="text-xs text-slate-500">
                {data.legal.prefix}
                <button className="underline hover:text-slate-700 ml-1">
                  {data.legal.terms}
                </button>
                <span className="mx-1">and</span>
                <button className="underline hover:text-slate-700">
                  {data.legal.privacy}
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

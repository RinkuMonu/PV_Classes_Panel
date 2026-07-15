// src/pages/Login.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ArrowRight, LockKeyhole, Phone, ShieldCheck } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const url = import.meta.env.VITE_API_SERVER_URL;
  const navigate = useNavigate();

  // If a token already exists (e.g., after refresh), set default header
  React.useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = form.get("phone");
    const password = form.get("password");

    try {
      const { data } = await axios.post(`${url}/api/users/login`, { phone, password });
      const { token, user } = data || {};

      if (!token || !user) {
        toast.error("Invalid response from server.");
        return;
      }

      // Role guard
      if (user.role !== "admin" && user.role !== "superadmin") {
        toast.error("You are not authorized to access this panel.");
        return;
      }

      // Persist token & safe user (never store password/hash)
      localStorage.setItem("token", token);
      const safeUser = {
        id: user.id || user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        profile_image_url: user.profile_image_url ?? null,
      };
      localStorage.setItem("user", JSON.stringify(safeUser));

      // Allow the dashboard welcome message once for this new login.
      sessionStorage.removeItem("pvWelcomeShown");

      // Default auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // App state + navigation
      setUser?.(safeUser);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message);
      const msg = error?.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* UI-only: polished responsive login layout using the shared PV Classes theme. */}
      <div className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-white px-2 py-2 sm:px-6 lg:px-8">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#204972]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#87b105]/15 blur-3xl" />

        {/* UI-only: constrain the card to the viewport to prevent page scrolling. */}
        {/* UI-only: dynamic viewport height and an internally scrollable form protect short mobile screens. */}
        <div className="relative grid h-[calc(100dvh-16px)] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(32,73,114,0.18)] sm:rounded-3xl lg:max-h-[560px] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative hidden min-h-0 overflow-hidden lg:block">
            <img className="absolute inset-0 h-full w-full object-cover" src="/Images/LoginImg.png" alt="PV Classes learning dashboard" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f4d]/95 via-[#204972]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" /> Secure Admin Access
              </span>
              <h2 className="max-w-lg text-3xl font-bold leading-tight">Manage learning with clarity and confidence.</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/80">Manage students, courses, exams, and results from one organized workspace.</p>
            </div>
          </section>

          <main className="no-scrollbar flex min-h-0 items-center overflow-y-auto px-5 py-6 sm:px-10 lg:px-12">
            <div className="mx-auto w-full max-w-md">
              {/* UI-only: compact vertical spacing keeps the login card inside the viewport. */}
              <div className="mb-6">
                <img src="/Images/pv-logo.png" alt="PV Classes" className="mb-4 h-14 w-14 object-contain" />
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#87b105]">Admin Portal</p>
                <h1 className="text-2xl font-bold tracking-tight text-[#173a5c] sm:text-3xl">Welcome back</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with your administrator credentials to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input id="login-phone" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" type="text" name="phone" placeholder="Enter your phone number" autoComplete="username" required />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label htmlFor="login-password" className="text-sm font-semibold text-slate-700">Password</label>
                    <a className="text-sm font-semibold text-[#204972] transition hover:text-[#87b105]" href="/forgot-password">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input id="login-password" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" type="password" name="password" placeholder="Enter your password" autoComplete="current-password" required />
                  </div>
                </div>

                <button className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#204972] to-[#87b105] px-5 text-sm font-semibold text-white shadow-lg shadow-[#204972]/20 transition hover:-translate-y-0.5 hover:shadow-xl" type="submit">
                  Sign in to Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">New administrator? <a className="font-semibold text-[#204972] hover:text-[#87b105]" href="/signup">Create an account</a></p>
              <p className="mt-4 text-center text-xs text-slate-400">Protected access for authorized PV Classes administrators.</p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Login;

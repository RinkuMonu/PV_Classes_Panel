import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, KeyRound, Mail, ShieldCheck } from "lucide-react";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_SERVER_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${url}/api/users/forgot-password`, { email});
      if (response.data.success) {
        // Security: a reset token must never be stored or treated as a login token.
        setMessage(response.data.message || "Password recovery instructions have been sent to your email.");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to start password recovery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* UI-only: match the Forgot Password screen to the shared PV Classes authentication theme. */
    <div className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-white px-2 py-2 sm:px-6 lg:px-8">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#204972]/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#87b105]/15 blur-3xl" />

      {/* UI-only: keep recovery usable on narrow and short mobile viewports. */}
      <div className="relative grid h-[calc(100dvh-16px)] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(32,73,114,0.18)] sm:rounded-3xl lg:max-h-[560px] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-0 overflow-hidden lg:block">
          {/* UI-only: use the dedicated Forgot Password artwork supplied for this screen. */}
          <img className="absolute inset-0 h-full w-full object-cover object-left" src="/Images/ForgotPassword.png" alt="PV Classes account recovery" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102f4d]/95 via-[#204972]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" /> Secure Account Recovery
            </span>
            <h2 className="max-w-lg text-3xl font-bold leading-tight">Recover your access securely.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/80">Enter the administrator email connected to your PV Classes account to continue recovery.</p>
          </div>
        </section>

        <main className="no-scrollbar flex min-h-0 items-center overflow-y-auto px-5 py-6 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <img src="/Images/pv-logo.png" alt="PV Classes" className="mb-4 h-14 w-14 object-contain" />
            <div className="mb-6">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#204972]/10 text-[#204972]">
                <KeyRound className="h-5 w-5" />
              </span>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#87b105]">Account Recovery</p>
              <h1 className="text-2xl font-bold tracking-tight text-[#173a5c] sm:text-3xl">Forgot your password?</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Enter your registered email address and we’ll help you recover access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="recovery-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="recovery-email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10"
                    type="email"
                    name="verifyEmail"
                    placeholder="admin@pvclasses.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button disabled={loading} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#204972] to-[#87b105] px-5 text-sm font-semibold text-white shadow-lg shadow-[#204972]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60" type="submit">
                {loading ? "Sending..." : "Recover password"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#204972] transition hover:text-[#87b105]" href="/login">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </a>
            <p className="mt-5 text-xs leading-5 text-slate-400">For security, recovery is available only for registered administrator accounts.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPassword;

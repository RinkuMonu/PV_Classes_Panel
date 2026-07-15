import React from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAccount = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Frontend guard: no registration API exists in this app, so avoid a misleading page reload.
    toast.info("Staff accounts must currently be created by an authorized administrator.");
  };

  return (
    /* UI-only: match registration to the shared PV Classes authentication theme. */
    <div className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-white px-2 py-2 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover theme="light" />
      <div className="absolute -left-24 -top-24 hidden h-72 w-72 rounded-full bg-[#204972]/10 blur-3xl lg:block" />
      <div className="absolute -bottom-24 -right-24 hidden h-72 w-72 rounded-full bg-[#87b105]/15 blur-3xl lg:block" />

      {/* UI-only: one dedicated touch scroller prevents competing mobile scroll areas and lag. */}
      <div className="relative grid h-[calc(100dvh-16px)] min-h-0 w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(32,73,114,0.18)] sm:rounded-3xl lg:max-h-[620px] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-0 overflow-hidden lg:block">
          {/* UI-only: use the dedicated registration artwork added to the shared Images folder. */}
          <img className="absolute inset-0 h-full w-full object-cover" src="/Images/CreateAccount.png" alt="Create a PV Classes account" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102f4d]/95 via-[#204972]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" /> Authorized Staff Registration
            </span>
            <h2 className="max-w-lg text-3xl font-bold leading-tight">Join the PV Classes admin workspace.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/80">Create a staff account with the appropriate role to help manage learning operations.</p>
          </div>
        </section>

        {/* UI-only: compact the right-side content so the PV logo remains fully visible. */}
        <main className="no-scrollbar flex min-h-0 touch-pan-y items-start overflow-y-auto overscroll-contain px-4 py-4 sm:px-8 sm:py-5 lg:items-center lg:px-10 [-webkit-overflow-scrolling:touch]">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-3 flex items-center justify-between gap-3">
              <img src="/Images/pv-logo.png" alt="PV Classes" className="h-11 w-11 shrink-0 object-contain" />
              <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#204972] transition hover:text-[#87b105]" href="/login">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </a>
            </div>

            <div className="mb-3">
              <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#87b105]">Admin Portal</p>
              <h1 className="text-xl font-bold tracking-tight text-[#173a5c] sm:text-2xl">Create an account</h1>
              <p className="mt-1 text-sm text-slate-500">Enter the new staff member’s account details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="register-name" className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="register-name" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" type="text" name="name" placeholder="Admin name" />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="register-email" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" type="email" name="email" placeholder="admin@pvclasses.in" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="register-password" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" type="password" name="password" placeholder="Create a secure password" />
                </div>
              </div>

              <div>
                <label htmlFor="register-role" className="mb-1 block text-sm font-semibold text-slate-700">Staff role</label>
                <div className="relative">
                  <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select id="register-role" className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" name="role" defaultValue="">
                    <option value="" disabled>Select staff role</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Cashier">Cashier</option>
                    <option value="CEO">CEO</option>
                    <option value="Manager">Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Driver">Driver</option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="Deliver Person">Delivery Person</option>
                  </select>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-500">
                <input className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#204972]" type="checkbox" />
                <span>I agree to the <span className="font-semibold text-[#204972]">privacy policy</span> and authorized staff access terms.</span>
              </label>

              <button className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#204972] to-[#87b105] px-5 text-sm font-semibold text-white shadow-lg shadow-[#204972]/20 transition hover:-translate-y-0.5 hover:shadow-xl" type="submit">
                Create account
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* UI-only: retain the existing social-login options in a compact themed presentation. */}
            <div className="my-3 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">or continue with</span><span className="h-px flex-1 bg-slate-200" /></div>
            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:gap-3">
              <button disabled type="button" className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-500 opacity-70">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1877F2]" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.62.77-1.62 1.56v1.9h2.76l-.44 2.91h-2.32V22C18.34 21.25 22 17.08 22 12.06Z" /></svg>
                Facebook
              </button>
              <button disabled type="button" className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-500 opacity-70">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.61A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.92A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.32-1.92V7.47H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.53l3.34-2.61Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.89A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.94 5.47l3.34 2.61c.79-2.37 3-4.13 5.6-4.13Z"/></svg>
                Gmail
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">Accounts should only be created for authorized PV Classes staff.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAccount;

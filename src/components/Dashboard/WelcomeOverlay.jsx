import React from "react";
import { X } from "lucide-react";

const WelcomeOverlay = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    // UI-only: welcome overlay displayed when the Dashboard opens.
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-4">
      {/* UI-only: animate the transparent welcome popup as it appears and disappears. */}
      {/* UI-only: use a wider card with more spacing for a stronger welcome presentation. */}
      <div className="welcome-overlay-popup relative w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-2xl sm:p-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close welcome overlay"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* UI-only: use the existing PV Classes brand logo in the welcome overlay. */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#EEF7E0] p-2 shadow-sm">
          <img
            src="/Images/pv-logo.png"
            alt="PV Classes"
            className="h-full w-full object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome{userName ? `, ${userName}` : ""}!
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          Welcome to PV Classes. Your dashboard is ready to manage students,
          courses, results, orders, and learning content.
        </p>

      </div>
    </div>
  );
};

export default WelcomeOverlay;

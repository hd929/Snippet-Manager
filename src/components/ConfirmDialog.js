"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-scaleIn">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            {title || "Confirm Delete"}
          </h3>
          <p className="text-slate-400 text-sm">
            {message || "Are you sure you want to delete this snippet? This action cannot be undone."}
          </p>
        </div>
        <div className="flex border-t border-slate-800">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3.5 text-slate-300 font-medium hover:text-white hover:bg-slate-800 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3.5 bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-colors text-sm border-l border-slate-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

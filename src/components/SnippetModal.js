"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const CATEGORIES = ["Graph", "DP", "Math", "String", "Data Structure", "Geometry", "Number Theory", "Greedy", "Other"];

export default function SnippetModal({ isOpen, onClose, onSubmit, editingSnippet }) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    timeComplexity: "O(1)",
    notes: "",
    tags: "",
    category: "Other",
  });

  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editingSnippet) {
        setFormData({
          title: editingSnippet.title || "",
          code: editingSnippet.code || "",
          timeComplexity: editingSnippet.timeComplexity || editingSnippet.complexity?.time || "O(1)",
          notes: editingSnippet.notes || "",
          tags: editingSnippet.tags ? editingSnippet.tags.join(", ") : "",
          category: editingSnippet.category || "Other",
        });
      } else {
        setFormData({ title: "", code: "", timeComplexity: "O(1)", notes: "", tags: "", category: "Other" });
      }
      // Focus title input after modal opens
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, editingSnippet]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Tab key in code textarea for indentation
  const handleCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = formData.code.substring(0, start) + "    " + formData.code.substring(end);
      handleChange("code", newValue);
      // Reset cursor position after React re-renders
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-slate-300">
            {editingSnippet ? "Edit Snippet" : "Add New Snippet"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="snippet-form" onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Title / Algorithm Name <span className="text-red-400">*</span>
              </label>
              <input
                ref={titleRef}
                required
                type="text"
                maxLength={100}
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all shadow-inner placeholder:text-slate-600"
                placeholder="e.g. DSU, BFS, Dijkstra..."
              />
              <div className="text-right text-xs text-slate-600 mt-1">{formData.title.length}/100</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                C++ Code <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                onKeyDown={handleCodeKeyDown}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none font-mono text-sm h-56 shadow-inner resize-y placeholder:text-slate-600"
                placeholder="struct DSU { ... }"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Time Complexity</label>
                <input
                  type="text"
                  value={formData.timeComplexity}
                  onChange={(e) => handleChange("timeComplexity", e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="e.g. O(N log N)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tags (Comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Graph, Tree, Math"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Short Notes</label>
              <input
                type="text"
                maxLength={500}
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Remember 1-based indexing"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="snippet-form"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {editingSnippet ? "Save Changes" : "Create Snippet"}
          </button>
        </div>
      </div>
    </div>
  );
}

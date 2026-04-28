"use client";

import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const CATEGORY_COLORS = {
  All: "from-slate-500 to-slate-600",
  Graph: "from-cyan-500 to-blue-600",
  DP: "from-amber-500 to-orange-600",
  Math: "from-emerald-500 to-green-600",
  String: "from-pink-500 to-rose-600",
  "Data Structure": "from-violet-500 to-purple-600",
  Geometry: "from-teal-500 to-cyan-600",
  "Number Theory": "from-lime-500 to-emerald-600",
  Greedy: "from-yellow-500 to-amber-600",
  Other: "from-slate-400 to-slate-500",
};

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  snippetCount,
  favoriteCount,
}) {
  const inputRef = useRef(null);

  // Keyboard shortcut: Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mb-10 max-w-3xl mx-auto relative z-20 space-y-5">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400">
          <Search className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full glass border border-slate-700/50 rounded-2xl py-4 pl-12 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-xl backdrop-blur-xl bg-slate-900/60"
          placeholder="Search by name, tags, or notes... (Ctrl+K)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const gradient = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg scale-105`
                  : "bg-slate-900/60 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800/60"
              }`}
            >
              {cat}
            </button>
          );
        })}

        {/* Stats */}
        <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-mono">{snippetCount}</span> snippets
          </span>
          {favoriteCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-amber-400">⭐</span>
              <span className="font-mono">{favoriteCount}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

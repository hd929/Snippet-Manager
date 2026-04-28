"use client";

import { Search, Plus } from "lucide-react";

export default function EmptyState({ hasSnippets, searchTerm, onAddClick }) {
  return (
    <div className="glass rounded-3xl p-12 text-center mt-10 border border-slate-800/60 animate-fadeInUp">
      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50 shadow-inner">
        {hasSnippets ? (
          <Search className="w-10 h-10 text-slate-500" />
        ) : (
          <Plus className="w-10 h-10 text-slate-500" />
        )}
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-2">
        {hasSnippets ? "No snippets found" : "Your arsenal is empty"}
      </h3>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        {hasSnippets
          ? `We couldn't find anything matching "${searchTerm}". Try a different term, tag, or category.`
          : "Start building your competitive programming library by adding your first snippet."}
      </p>
      {!hasSnippets && (
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Your First Snippet
        </button>
      )}
    </div>
  );
}

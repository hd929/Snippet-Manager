"use client";

import { useState, memo, useMemo } from "react";
import { Check, Copy, Clock, BookOpen, Trash2, Edit, Tag, Star, ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load SyntaxHighlighter to reduce initial bundle size
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 bg-slate-950/40 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    ),
  }
);

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const MAX_COLLAPSED_LINES = 15;

const CATEGORY_BADGE_COLORS = {
  Graph: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  DP: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Math: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  String: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  "Data Structure": "bg-violet-500/10 text-violet-300 border-violet-500/20",
  Geometry: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  "Number Theory": "bg-lime-500/10 text-lime-300 border-lime-500/20",
  Greedy: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Other: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

function SnippetCard({ snippet, onEdit, onDelete, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const codeLines = useMemo(() => snippet.code.split("\n"), [snippet.code]);
  const isLongCode = codeLines.length > MAX_COLLAPSED_LINES;
  const displayedCode = useMemo(
    () => (isLongCode && !isExpanded ? codeLines.slice(0, MAX_COLLAPSED_LINES).join("\n") : snippet.code),
    [isLongCode, isExpanded, codeLines, snippet.code]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColor = CATEGORY_BADGE_COLORS[snippet.category] || CATEGORY_BADGE_COLORS.Other;

  return (
    <div className={`glass-card rounded-2xl overflow-hidden group animate-fadeInUp ${snippet.isFavorite ? "ring-1 ring-amber-500/30" : ""}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 relative">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-colors duration-500 pointer-events-none"></div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight truncate">
              {snippet.title}
            </h2>
            {snippet.isFavorite && <span className="text-amber-400 animate-pulse text-lg flex-shrink-0">⭐</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-400">
            {/* Category Badge */}
            {snippet.category && snippet.category !== "Other" && (
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${categoryColor}`}>
                {snippet.category}
              </span>
            )}

            {/* Time Complexity */}
            <div className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-700/50 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-emerald-100 text-xs">{snippet.timeComplexity || snippet.complexity?.time}</span>
            </div>

            {/* Notes */}
            {snippet.notes && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[200px]">{snippet.notes}</span>
              </div>
            )}

            {/* Tags */}
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <div className="flex gap-1.5 flex-wrap">
                  {snippet.tags.map((tag, idx) => (
                    <span key={idx} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 relative z-10 flex-shrink-0">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(snippet._id || snippet.id)}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                snippet.isFavorite
                  ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                  : "text-slate-500 hover:text-amber-400 hover:bg-amber-500/10"
              }`}
              title={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${snippet.isFavorite ? "fill-current" : ""}`} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(snippet)}
              className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
              title="Edit Snippet"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(snippet._id || snippet.id)}
              className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              title="Delete Snippet"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transform hover:-translate-y-0.5"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative">
        {/* Language Badge */}
        <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-slate-400 text-xs font-mono px-2 py-0.5 rounded border border-slate-700/50 backdrop-blur-sm">
          C++
        </div>

        <div className="p-0 overflow-x-auto text-sm relative">
          <SyntaxHighlighter
            language="cpp"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              paddingRight: "4rem",
              background: "rgba(15, 23, 42, 0.4)",
              fontSize: "0.9rem",
              fontFamily: "var(--font-jetbrains), monospace",
              lineHeight: "1.7",
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: "2.5em",
              paddingRight: "1em",
              color: "rgba(100, 116, 139, 0.4)",
              fontSize: "0.8rem",
              userSelect: "none",
            }}
            wrapLines={true}
          >
            {displayedCode}
          </SyntaxHighlighter>
        </div>

        {/* Expand/Collapse for long code */}
        {isLongCode && (
          <div className="relative">
            {!isExpanded && (
              <div className="absolute bottom-full left-0 right-0 h-16 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none"></div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2.5 text-sm font-medium text-slate-400 hover:text-blue-400 bg-slate-900/60 hover:bg-slate-800/60 border-t border-slate-700/50 transition-all flex items-center justify-center gap-1.5"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse ({codeLines.length} lines)
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand ({codeLines.length} lines, showing {MAX_COLLAPSED_LINES})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SnippetCard);

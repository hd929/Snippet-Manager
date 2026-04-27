"use client";

import { useState } from "react";
import { Check, Copy, Clock, BookOpen, Trash2, Edit, Tag } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SnippetCard({ snippet, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      <div className="p-5 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 relative">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-colors duration-500 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            {snippet.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-700/50 shadow-inner">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-emerald-100">{snippet.timeComplexity || snippet.complexity?.time}</span>
            </div>
            {snippet.notes && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>{snippet.notes}</span>
              </div>
            )}
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex items-center gap-2 ml-2">
                <Tag className="w-4 h-4 text-purple-400" />
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
        
        <div className="flex items-center gap-2 relative z-10">
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transform hover:-translate-y-0.5"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-0 overflow-x-auto text-sm relative">
        <SyntaxHighlighter
          language="cpp"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "rgba(15, 23, 42, 0.4)",
            fontSize: "0.9rem",
            lineHeight: "1.6",
          }}
          wrapLines={true}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

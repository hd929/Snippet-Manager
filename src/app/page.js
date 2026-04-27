"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import SnippetCard from "@/components/SnippetCard";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    timeComplexity: "O(1)",
    notes: "",
    tags: "" // Comma separated string for the UI
  });

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/snippets");
      const data = await res.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch snippets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSnippets = snippets.filter((snippet) =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleOpenModal = (snippet = null) => {
    if (snippet) {
      setEditingSnippet(snippet);
      setFormData({
        title: snippet.title,
        code: snippet.code,
        timeComplexity: snippet.timeComplexity || snippet.complexity?.time || "O(1)",
        notes: snippet.notes || "",
        tags: snippet.tags ? snippet.tags.join(", ") : ""
      });
    } else {
      setEditingSnippet(null);
      setFormData({ title: "", code: "", timeComplexity: "O(1)", notes: "", tags: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSnippet(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse comma separated tags into an array
    const parsedTags = formData.tags
      ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
      : [];
      
    const payload = {
      ...formData,
      tags: parsedTags
    };
    
    try {
      if (editingSnippet) {
        await fetch(`/api/snippets/${editingSnippet._id || editingSnippet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/snippets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      fetchSnippets();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save snippet:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;
    try {
      await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      fetchSnippets();
    } catch (error) {
      console.error("Failed to delete snippet:", error);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-12 relative min-h-screen z-10">
      <header className="mb-14 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm relative z-10">
          CP Snippets
        </h1>
        <p className="text-slate-400/90 text-lg md:text-xl font-medium max-w-xl mx-auto">
          Your personal arsenal of algorithms. <br className="hidden md:block" /> Fast, neat, and ready for your next contest.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-2xl mx-auto relative z-20">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400">
            <Search className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-400" />
          </div>
          <input
            type="text"
            className="w-full glass border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-xl backdrop-blur-xl bg-slate-900/60"
            placeholder="Search by name or tags (e.g. Graph, DSU)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Snippet</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-slate-400 font-medium">Loading your arsenal...</p>
        </div>
      ) : filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {filteredSnippets.map((snippet) => (
            <SnippetCard 
              key={snippet._id || snippet.id} 
              snippet={snippet} 
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center mt-10 border border-slate-800/60">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50 shadow-inner">
            <Search className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">
            {snippets.length === 0 ? "Your arsenal is empty" : "No snippets found"}
          </h3>
          <p className="text-slate-400">
            {snippets.length === 0 
              ? "Start building your competitive programming library by adding your first snippet." 
              : `We couldn't find anything matching "${searchTerm}". Try a different term or tag.`}
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-slate-300">
                {editingSnippet ? "Edit Snippet" : "Add New Snippet"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="snippet-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Title / Algorithm Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all shadow-inner"
                    placeholder="e.g. DSU, BFS, Dijkstra..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">C++ Code *</label>
                  <textarea
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none font-mono text-sm h-56 shadow-inner"
                    placeholder="struct DSU { ... }"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Time Complexity</label>
                    <input
                      type="text"
                      value={formData.timeComplexity}
                      onChange={(e) => setFormData({...formData, timeComplexity: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
                      placeholder="e.g. O(N log N)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all"
                      placeholder="e.g. Graph, Tree, Math"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Short Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
                    placeholder="e.g. Remember 1-based indexing"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="snippet-form"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5"
              >
                {editingSnippet ? "Save Changes" : "Create Snippet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { Plus, Loader2, Keyboard } from "lucide-react";
import { useSnippets } from "@/hooks/useSnippets";
import SnippetCard from "@/components/SnippetCard";
import SnippetModal from "@/components/SnippetModal";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Home() {
  const {
    filteredSnippets,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    isModalOpen,
    editingSnippet,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    requestDelete,
    handleToggleFavorite,
    confirmDialog,
    confirmDelete,
    cancelDelete,
    snippetCount,
    favoriteCount,
    categories,
  } = useSnippets();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+N → Open add modal
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        handleOpenModal();
      }
      // Escape → Close modal
      if (e.key === "Escape") {
        handleCloseModal();
        cancelDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOpenModal, handleCloseModal, cancelDelete]);

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-12 relative min-h-screen z-10">
      {/* Header */}
      <header className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/15 blur-3xl rounded-full animate-pulse-glow"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm relative z-10 animate-gradient bg-[length:200%_200%]">
          CP Snippets
        </h1>
        <p className="text-slate-400/90 text-lg md:text-xl font-medium max-w-xl mx-auto animate-fadeInUp">
          Your personal arsenal of algorithms. <br className="hidden md:block" /> Fast, neat, and ready for your next contest.
        </p>
      </header>

      {/* Search + Filters + Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-2 max-w-3xl mx-auto relative z-20">
        <div className="flex-1">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            snippetCount={snippetCount}
            favoriteCount={favoriteCount}
          />
        </div>
        <div className="flex-shrink-0 md:self-start">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-7 py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 active:translate-y-0 w-full md:w-auto"
            title="Add Snippet (Ctrl+N)"
          >
            <Plus className="w-5 h-5" />
            <span>Add Snippet</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500 animate-fadeIn">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-slate-400 font-medium">Loading your arsenal...</p>
        </div>
      ) : filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 relative z-10 stagger-children">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet._id || snippet.id}
              snippet={snippet}
              onEdit={handleOpenModal}
              onDelete={requestDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          hasSnippets={snippetCount > 0}
          searchTerm={searchTerm}
          onAddClick={() => handleOpenModal()}
        />
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-6 left-6 hidden lg:flex items-center gap-4 text-xs text-slate-600">
        <Keyboard className="w-3.5 h-3.5" />
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-500 font-mono">Ctrl+K</kbd> Search</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-500 font-mono">Ctrl+N</kbd> New</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-500 font-mono">Esc</kbd> Close</span>
      </div>

      {/* Modal */}
      <SnippetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingSnippet={editingSnippet}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </main>
  );
}

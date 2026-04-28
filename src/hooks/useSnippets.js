"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Graph", "DP", "Math", "String", "Data Structure", "Geometry", "Number Theory", "Greedy", "Other"];

export function useSnippets() {
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });
  const debounceTimer = useRef(null);

  // Debounced search (300ms)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm]);

  const fetchSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/snippets");
      const data = await res.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch snippets.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Memoized filtered snippets
  const filteredSnippets = useMemo(() => {
    let result = snippets;

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(term) ||
          (s.tags && s.tags.some((tag) => tag.toLowerCase().includes(term))) ||
          (s.notes && s.notes.toLowerCase().includes(term))
      );
    }

    // Sort: favorites first
    return result.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [snippets, debouncedSearch, selectedCategory]);

  const handleOpenModal = useCallback((snippet = null) => {
    setEditingSnippet(snippet || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSnippet(null);
  }, []);

  const handleSubmit = useCallback(
    async (formData) => {
      const toastId = toast.loading(editingSnippet ? "Saving changes..." : "Creating snippet...");

      const parsedTags = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        : [];

      const payload = { ...formData, tags: parsedTags };

      try {
        if (editingSnippet) {
          const res = await fetch(`/api/snippets/${editingSnippet._id || editingSnippet.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to update");
          }
          toast.success("Snippet updated successfully!", { id: toastId });
        } else {
          const res = await fetch("/api/snippets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to create");
          }
          toast.success("Snippet created successfully!", { id: toastId });
        }
        fetchSnippets();
        handleCloseModal();
      } catch (error) {
        toast.error(error.message || "An error occurred.", { id: toastId });
        console.error(error);
      }
    },
    [editingSnippet, fetchSnippets, handleCloseModal]
  );

  const handleDelete = useCallback(
    async (id) => {
      const toastId = toast.loading("Deleting snippet...");
      // Optimistic update
      const prevSnippets = snippets;
      setSnippets((prev) => prev.filter((s) => (s._id || s.id) !== id));

      try {
        const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Snippet deleted!", { id: toastId });
      } catch (error) {
        // Rollback on error
        setSnippets(prevSnippets);
        toast.error("Failed to delete snippet.", { id: toastId });
        console.error(error);
      }
    },
    [snippets]
  );

  const handleToggleFavorite = useCallback(
    async (id) => {
      const snippet = snippets.find((s) => (s._id || s.id) === id);
      if (!snippet) return;

      const newVal = !snippet.isFavorite;

      // Optimistic update
      setSnippets((prev) =>
        prev.map((s) => ((s._id || s.id) === id ? { ...s, isFavorite: newVal } : s))
      );

      try {
        const res = await fetch(`/api/snippets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFavorite: newVal }),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success(newVal ? "Added to favorites!" : "Removed from favorites!", {
          duration: 1500,
          icon: newVal ? "⭐" : "☆",
        });
      } catch (error) {
        // Rollback
        setSnippets((prev) =>
          prev.map((s) => ((s._id || s.id) === id ? { ...s, isFavorite: !newVal } : s))
        );
        toast.error("Failed to update favorite status.");
      }
    },
    [snippets]
  );

  const requestDelete = useCallback((id) => {
    setConfirmDialog({ isOpen: true, id });
  }, []);

  const confirmDelete = useCallback(() => {
    if (confirmDialog.id) {
      handleDelete(confirmDialog.id);
    }
    setConfirmDialog({ isOpen: false, id: null });
  }, [confirmDialog.id, handleDelete]);

  const cancelDelete = useCallback(() => {
    setConfirmDialog({ isOpen: false, id: null });
  }, []);

  const snippetCount = snippets.length;
  const favoriteCount = snippets.filter((s) => s.isFavorite).length;

  return {
    snippets,
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
    categories: CATEGORIES,
  };
}

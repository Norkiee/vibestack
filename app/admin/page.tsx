"use client";

import { useState, useEffect } from "react";
import { Resource, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";

export default function AdminPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("launch");

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !description || !category) return;

    setSaving(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, description, category }),
      });

      if (res.ok) {
        setTitle("");
        setUrl("");
        setDescription("");
        setCategory("launch");
        fetchResources();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add resource");
      }
    } catch (error) {
      console.error("Failed to add resource:", error);
      alert("Failed to add resource");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/resources?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchResources();
      } else {
        alert("Failed to delete resource");
      }
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert("Failed to delete resource");
    } finally {
      setDeleting(null);
    }
  };

  const categories = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium">Admin</h1>
          <a
            href="/"
            className="text-sm px-3 py-1.5 rounded-full"
            style={{ background: "var(--bg-pill)", color: "var(--text-secondary)" }}
          >
            Back to site
          </a>
        </div>

        {/* Add Resource Form */}
        <form onSubmit={handleSubmit} className="mb-12 p-6 rounded-lg" style={{ background: "var(--bg-pill)" }}>
          <h2 className="text-lg font-medium mb-4">Add Resource</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Hunt"
                className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)"
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://producthunt.com"
                className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)"
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Launch and discover new products"
                className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)"
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)"
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 rounded-md text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: "var(--text-primary)", color: "var(--bg-page)" }}
            >
              {saving ? "Adding..." : "Add Resource"}
            </button>
          </div>
        </form>

        {/* Resource List */}
        <div>
          <h2 className="text-lg font-medium mb-4">
            Resources ({resources.length})
          </h2>

          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : resources.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No resources yet.</p>
          ) : (
            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 rounded-md"
                  style={{ background: "var(--bg-pill)" }}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{resource.title}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--bg-page)", color: "var(--text-muted)" }}
                      >
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {resource.url}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    disabled={deleting === resource.id}
                    className="p-2 rounded-md transition-colors hover:bg-red-500/10"
                    style={{ color: deleting === resource.id ? "var(--text-muted)" : "#ef4444" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

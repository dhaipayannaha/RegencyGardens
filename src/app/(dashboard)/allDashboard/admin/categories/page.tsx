"use client";

import { useEffect, useState } from "react";
import {
    Tag, Plus, Trash2, Loader2, AlertCircle, CheckCircle2, Edit2, X, Save,
} from "lucide-react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    type Category,
} from "@/services/category.service";

const COLORS = [
    "bg-blue-500/15 text-blue-500",
    "bg-emerald-500/15 text-emerald-500",
    "bg-violet-500/15 text-violet-500",
    "bg-amber-500/15 text-amber-500",
    "bg-rose-500/15 text-rose-500",
    "bg-pink-500/15 text-pink-500",
    "bg-orange-500/15 text-orange-500",
    "bg-cyan-500/15 text-cyan-500",
    "bg-primary/15 text-primary",
];

function toSlug(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

type Toast = { type: "success" | "error"; message: string } | null;

interface EditState {
    id: string;
    name: string;
    slug: string;
    slugManual: boolean;
}

export default function AdminCategoriesPage() {
    const [cats, setCats] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Create state ──────────────────────────────────────────────────
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newName, setNewName] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [slugManual, setSlugManual] = useState(false);

    // ── Edit modal state ──────────────────────────────────────────────
    const [editState, setEditState] = useState<EditState | null>(null);
    const [updating, setUpdating] = useState(false);

    // ── Delete state ──────────────────────────────────────────────────
    const [deleting, setDeleting] = useState<string | null>(null);

    // ── Toast ─────────────────────────────────────────────────────────
    const [toast, setToast] = useState<Toast>(null);

    useEffect(() => { fetchCats(); }, []);

    async function fetchCats() {
        setLoading(true);
        try {
            const res = await getCategories();
            setCats(res.data ?? []);
        } catch {
            showToast("error", "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }

    // ── Create ────────────────────────────────────────────────────────
    function handleNameChange(val: string) {
        setNewName(val);
        if (!slugManual) setNewSlug(toSlug(val));
    }

    async function handleAdd() {
        const name = newName.trim();
        const slug = newSlug.trim() || toSlug(name);
        if (!name || !slug) return;
        setSaving(true);
        try {
            const res = await createCategory({ name, slug });
            setCats((prev) => [...prev, res.data]);
            setNewName(""); setNewSlug(""); setSlugManual(false); setAdding(false);
            showToast("success", `Category "${name}" created successfully.`);
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to create category.");
        } finally {
            setSaving(false);
        }
    }

    // ── Open edit modal ───────────────────────────────────────────────
    function openEdit(cat: Category) {
        setEditState({ id: cat.id, name: cat.name, slug: cat.slug, slugManual: false });
    }

    function handleEditNameChange(val: string) {
        if (!editState) return;
        setEditState((s) => s && ({
            ...s,
            name: val,
            slug: s.slugManual ? s.slug : toSlug(val),
        }));
    }

    // ── Save edit ─────────────────────────────────────────────────────
    async function handleUpdate() {
        if (!editState) return;
        const { id, name, slug } = editState;
        if (!name.trim() || !slug.trim()) return;
        setUpdating(true);
        try {
            const res = await updateCategory(id, { name: name.trim(), slug: slug.trim() });
            setCats((prev) => prev.map((c) => c.id === id ? res.data : c));
            setEditState(null);
            showToast("success", `Category "${name.trim()}" updated successfully.`);
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to update category.");
        } finally {
            setUpdating(false);
        }
    }

    // ── Delete ────────────────────────────────────────────────────────
    async function handleDelete(id: string, name: string) {
        setDeleting(id);
        try {
            await deleteCategory(id);
            setCats((prev) => prev.filter((c) => c.id !== id));
            showToast("success", `Category "${name}" deleted.`);
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to delete category.");
        } finally {
            setDeleting(null);
        }
    }

    function showToast(type: "success" | "error", message: string) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    }

    return (
        <div className="space-y-6">

            {/* ── Toast ──────────────────────────────────────────────── */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-xl text-sm font-medium ${
                    toast.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}>
                    {toast.type === "success"
                        ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                        : <AlertCircle className="h-4 w-4 shrink-0" />}
                    {toast.message}
                </div>
            )}

            {/* ── Edit Modal ─────────────────────────────────────────── */}
            {editState && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !updating && setEditState(null)}
                    />
                    {/* Dialog */}
                    <div className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold">Edit Category</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    PATCH /category/{editState.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setEditState(null)}
                                disabled={updating}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Name field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Name</label>
                            <input
                                autoFocus
                                value={editState.name}
                                onChange={(e) => handleEditNameChange(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                                placeholder="Category name"
                                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Slug field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Slug <span className="text-muted-foreground/50">(auto-generated)</span>
                            </label>
                            <input
                                value={editState.slug}
                                onChange={(e) => setEditState((s) => s && ({ ...s, slug: e.target.value, slugManual: true }))}
                                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                                placeholder="category-slug"
                                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                onClick={() => setEditState(null)}
                                disabled={updating}
                                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating || !editState.name.trim() || !editState.slug.trim()}
                                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                            >
                                {updating
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Save className="h-3.5 w-3.5" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Header / Add Button ────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {loading ? "Loading…" : `${cats.length} categories defined`}
                </p>

                {!adding ? (
                    <button
                        onClick={() => setAdding(true)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                    >
                        <Plus className="h-4 w-4" /> Add Category
                    </button>
                ) : (
                    <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-muted-foreground">Name</label>
                            <input
                                autoFocus
                                value={newName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                placeholder="e.g. Stars"
                                className="w-44 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Slug <span className="text-muted-foreground/50">(auto)</span>
                            </label>
                            <input
                                value={newSlug}
                                onChange={(e) => { setNewSlug(e.target.value); setSlugManual(true); }}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                placeholder="e.g. stars"
                                className="w-44 rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={saving || !newName.trim()}
                            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                        >
                            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Save
                        </button>
                        <button
                            onClick={() => { setAdding(false); setNewName(""); setNewSlug(""); setSlugManual(false); }}
                            className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* ── Category Cards ─────────────────────────────────────── */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Loading categories…
                </div>
            ) : cats.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
                    <Tag className="h-10 w-10 mb-3 opacity-30" />
                    <p className="font-medium">No categories yet</p>
                    <p className="text-sm mt-1">Click "Add Category" to create your first one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cats.map((cat, i) => {
                        const color = COLORS[i % COLORS.length];
                        const isDeleting = deleting === cat.id;
                        return (
                            <div key={cat.id} className="group relative rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => openEdit(cat)}
                                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name)}
                                            disabled={isDeleting}
                                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {isDeleting
                                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                : <Trash2 className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 font-semibold">{cat.name}</p>
                                <p className="text-xs text-muted-foreground font-mono mt-0.5">{cat.slug}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Table View ─────────────────────────────────────────── */}
            {!loading && cats.length > 0 && (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="border-b border-border px-5 py-4">
                        <h3 className="font-semibold">Category Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {cats.map((cat, i) => {
                                    const color = COLORS[i % COLORS.length];
                                    const isDeleting = deleting === cat.id;
                                    return (
                                        <tr key={cat.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}>
                                                        <Tag className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="font-semibold">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                                            <td className="px-5 py-3.5 text-xs text-muted-foreground">
                                                {cat.createdAt
                                                    ? new Date(cat.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                    : "—"}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => openEdit(cat)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id, cat.name)}
                                                        disabled={isDeleting}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                                                        title="Delete"
                                                    >
                                                        {isDeleting
                                                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            : <Trash2 className="h-3.5 w-3.5" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

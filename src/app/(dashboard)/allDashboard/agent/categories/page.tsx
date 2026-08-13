"use client";

import { useEffect, useState } from "react";
import { Tag, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getCategories, type Category } from "@/services/category.service";
import { Skeleton } from "@/components/ui/skeleton";

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

type Toast = { type: "success" | "error"; message: string } | null;

export default function AgentCategoriesPage() {
    const [cats, setCats] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
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

            {/* ── Header ────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {loading ? "Loading…" : `${cats.length} categories defined`}
                </p>
            </div>

            {/* ── Category Cards ─────────────────────────────────────── */}
            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card p-5">
                            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                            <Skeleton className="h-5 w-3/4 mb-1.5" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : cats.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
                    <Tag className="h-10 w-10 mb-3 opacity-30" />
                    <p className="font-medium">No categories yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cats.map((cat, i) => {
                        const color = COLORS[i % COLORS.length];
                        return (
                            <div key={cat.id} className="group relative rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                                        <Tag className="h-5 w-5" />
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {cats.map((cat, i) => {
                                    const color = COLORS[i % COLORS.length];
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

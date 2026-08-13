"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2, Save, X, Building2 } from "lucide-react";
import Link from "next/link";
import { getProperties, updateProperty, deleteProperty } from "@/services/property.service";
import { Property, PaginatedProperties, PropertyStatus } from "@/types/property";

const STATUS_STYLE: Record<string, string> = {
    ACTIVE:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    PENDING:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    SOLD:     "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    INACTIVE: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 8;
type Toast = { type: "success" | "error"; message: string } | null;

interface EditState {
    id: string;
    title: string;
    price: number;
    status: PropertyStatus;
    bedrooms: number;
    description: string;
}

export default function AdminPropertiesClient() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setType] = useState("ALL");
    const [statusFilter, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);
    const [toast, setToast] = useState<Toast>(null);

    // Edit Modal state
    const [editState, setEditState] = useState<EditState | null>(null);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            // We fetch all properties without pagination limits here for client side filtering, 
            // or we could use server-side. For now, fetch all up to a reasonable limit.
            const res = await getProperties({ limit: 1000 });
            setProperties(res.data || []);
        } catch (err: any) {
            showToast("error", "Failed to load properties.");
        } finally {
            setLoading(false);
        }
    }

    function showToast(type: "success" | "error", message: string) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    }

    async function handleUpdate() {
        if (!editState) return;
        setUpdating(true);
        try {
            const { id, price, status, bedrooms, description } = editState;
            const res = await updateProperty(id, { price, status, bedrooms, description });
            setProperties(prev => prev.map(p => p.id === id ? (res.data ? { ...p, ...res.data } : { ...p, price, status, bedrooms, description }) : p));
            showToast("success", `Property updated successfully.`);
            setEditState(null);
        } catch (err: any) {
            showToast("error", err.message || "Failed to update property.");
        } finally {
            setUpdating(false);
        }
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        setDeleting(id);
        try {
            await deleteProperty(id);
            setProperties(prev => prev.filter(p => p.id !== id));
            showToast("success", `Property deleted successfully.`);
        } catch (err: any) {
            showToast("error", err.message || "Failed to delete property.");
        } finally {
            setDeleting(null);
        }
    }

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                                (p.agent?.name || "").toLowerCase().includes(search.toLowerCase()) ||
                                p.city.toLowerCase().includes(search.toLowerCase());
            const matchType   = typeFilter === "ALL" || p.listingType === typeFilter;
            const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
            return matchSearch && matchType && matchStatus;
        });
    }, [properties, search, typeFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const reset = () => setPage(1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">All Properties</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Browse, filter, and manage all property listings.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                    <Building2 className="h-4 w-4" />
                    {properties.length} total listings
                </div>
            </div>

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

            {/* Edit Modal */}
            {editState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !updating && setEditState(null)} />
                    <div className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold truncate pr-4">{editState.title}</h2>
                                <p className="text-xs text-muted-foreground mt-1">Update property details</p>
                            </div>
                            <button onClick={() => setEditState(null)} disabled={updating} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Price</label>
                                <input 
                                    type="number"
                                    value={editState.price ?? ""} 
                                    onChange={e => setEditState(s => s && { ...s, price: e.target.value ? Number(e.target.value) : 0 })}
                                    className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Bedrooms</label>
                                <input 
                                    type="number"
                                    value={editState.bedrooms ?? ""} 
                                    onChange={e => setEditState(s => s && { ...s, bedrooms: e.target.value ? Number(e.target.value) : 0 })}
                                    className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Status</label>
                                <select 
                                    value={editState.status || "INACTIVE"} 
                                    onChange={e => setEditState(s => s && { ...s, status: e.target.value as PropertyStatus })}
                                    className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="SOLD">Sold</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Description</label>
                                <textarea 
                                    rows={4}
                                    value={editState.description || ""} 
                                    onChange={e => setEditState(s => s && { ...s, description: e.target.value })}
                                    className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button onClick={() => setEditState(null)} disabled={updating} className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} disabled={updating} className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-50">
                                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); reset(); }}
                            placeholder="Search properties…"
                            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        {["ALL","SALE","RENT"].map((t) => (
                            <button key={t} onClick={() => { setType(t); reset(); }}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${typeFilter === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                                {t}
                            </button>
                        ))}
                        <div className="h-4 w-px bg-border" />
                        {["ALL","ACTIVE","PENDING","SOLD","INACTIVE"].map((s) => (
                            <button key={s} onClick={() => { setStatus(s); reset(); }}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                                {s === "ALL" ? "All Status" : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                {["Property", "Agent", "Type", "Price", "Status", "City", "Listed", "Actions"].map((h) => (
                                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" /> Loading properties...
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">No properties found.</td></tr>
                            ) : paginated.map((p) => {
                                const isDeleting = deleting === p.id;
                                return (
                                    <tr key={p.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-4 max-w-[200px]">
                                            <p className="font-semibold truncate" title={p.title}>{p.title}</p>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{p.agent?.name || "N/A"}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.listingType === "SALE" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                                {p.listingType}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-primary whitespace-nowrap">
                                            ৳{p.price.toLocaleString()}
                                            {p.listingType === "RENT" && <span className="text-xs font-normal text-muted-foreground">/mo</span>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[p.status] || STATUS_STYLE.INACTIVE}`}>{p.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{p.city}</td>
                                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                                            {p.createdAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(p.createdAt)) : "—"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/property/${p.slug}`} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(p.id, p.title)} disabled={isDeleting} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
                                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="flex items-center justify-between border-t border-border px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Showing <span className="font-medium">{Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> properties
                        </p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${p===page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

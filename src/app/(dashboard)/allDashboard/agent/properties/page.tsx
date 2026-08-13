"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { getMyProperties, deleteProperty } from "@/services/property.service";
import { Property } from "@/types/property";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLE: Record<string, string> = {
    ACTIVE:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    PENDING:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    SOLD:     "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    INACTIVE: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 8;

export default function AgentPropertiesClient() {
    const [search, setSearch]       = useState("");
    const [typeFilter, setType]     = useState("ALL");
    const [statusFilter, setStatus] = useState("ALL");
    const [page, setPage]           = useState(1);
    
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        async function fetchProps() {
            try {
                const res = await getMyProperties();
                if (res.data) setProperties(res.data);
            } catch (error: any) {
                // If the backend returns 404 or Property not found, it means the agent has no properties yet.
                if (error?.message?.toLowerCase().includes("not found")) {
                    setProperties([]);
                } else {
                    console.error("Error fetching my properties:", error);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchProps();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        setProperties(prev => prev.filter(p => p.id !== id)); // Optimistic UI
        try {
            await deleteProperty(id);
        } catch (error) {
            console.error("Failed to delete property", error);
            // In a real app, we'd revert the state and show a toast here.
        }
    };

    const filtered = useMemo(() => properties.filter((p) => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchType   = typeFilter === "ALL" || p.listingType === typeFilter;
        const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    }), [properties, search, typeFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const reset = () => setPage(1);

    if (loading) {
        return (
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
                        <Skeleton className="h-8 w-48 rounded-lg" />
                    </div>
                    <div className="p-5 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{filtered.length} properties</p>
                <Link href="/property/create"
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 hover:scale-[1.02] transition-all">
                    <Plus className="h-4 w-4" /> Add Property
                </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input value={search} onChange={(e) => { setSearch(e.target.value); reset(); }}
                            placeholder="Search properties…"
                            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
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
                                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                {["#", "Property", "Type", "Price", "Status", "Views", "Date", ""].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">No properties found.</td></tr>
                            ) : paginated.map((p, i) => (
                                <tr key={p.id} className="transition-colors hover:bg-muted/30">
                                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td className="px-5 py-3.5 max-w-[200px]">
                                        <p className="font-semibold truncate">{p.title}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.listingType === "SALE" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                            {p.listingType}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-primary whitespace-nowrap">
                                        ৳{p.price.toLocaleString()}{p.listingType === "RENT" && <span className="text-xs font-normal text-muted-foreground">/mo</span>}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[p.status] || STATUS_STYLE["INACTIVE"]}`}>{p.status}</span>
                                    </td>
                                    {/* Mock Views - Can be replaced by real views from API if available */}
                                    <td className="px-5 py-3.5 text-muted-foreground">0</td>
                                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(p.createdAt))}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/property/${p.slug}`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></Link>
                                            <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                    <p className="text-xs text-muted-foreground">
                        {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${p===page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

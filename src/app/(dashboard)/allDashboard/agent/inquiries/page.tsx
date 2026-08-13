"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { getReceivedInquiries, deleteInquiry, Inquiry } from "@/services/inquiry.service";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLE: Record<string, string> = {
    New:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Replied: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Closed:  "bg-muted text-muted-foreground",
    PENDING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const PAGE_SIZE = 6;

export default function AgentInquiriesClient() {
    const [search, setSearch]   = useState("");
    const [filter, setFilter]   = useState("ALL");
    const [page, setPage]       = useState(1);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInquiries() {
            try {
                const res = await getReceivedInquiries();
                if (res.data) setInquiries(res.data);
            } catch (err: any) {
                if (err?.message?.toLowerCase().includes("not found")) {
                    setInquiries([]);
                } else {
                    console.error("Failed to fetch inquiries", err);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchInquiries();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        setInquiries(prev => prev.filter(q => q.id !== id));
        try {
            await deleteInquiry(id);
        } catch (error) {
            console.error("Failed to delete inquiry", error);
        }
    };

    const filtered = useMemo(() => inquiries.filter((q) => {
        const userName = q.user?.name || "Unknown";
        const propTitle = q.property?.title || "Unknown Property";
        
        const matchSearch = userName.toLowerCase().includes(search.toLowerCase()) ||
                            propTitle.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || q.status === filter;
        return matchSearch && matchFilter;
    }), [inquiries, search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const reset = () => setPage(1);

    if (loading) {
        return (
            <div className="rounded-2xl border border-border bg-card overflow-hidden mt-2">
                <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
                    <Skeleton className="h-8 w-48 rounded-lg" />
                </div>
                <div className="p-5 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(e) => { setSearch(e.target.value); reset(); }}
                        placeholder="Search by name or property…"
                        className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    {["ALL", "PENDING", "Replied", "Closed"].map((s) => (
                        <button key={s} onClick={() => { setFilter(s); reset(); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                            {s === "PENDING" ? "New" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {["From", "Property", "Message Preview", "Date", "Status", ""].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginated.length === 0 ? (
                            <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No inquiries found.</td></tr>
                        ) : paginated.map((q) => {
                            const userName = q.user?.name || "Unknown";
                            const userEmail = q.user?.email || "No email";
                            const propTitle = q.property?.title || "Unknown Property";

                            return (
                                <Fragment key={q.id}>
                                    <tr className="transition-colors hover:bg-muted/30 cursor-pointer" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm leading-none">{userName}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{userEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-[180px]">
                                            <p className="text-xs text-muted-foreground truncate">{propTitle}</p>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-[220px]">
                                            <p className="text-xs text-muted-foreground truncate">{q.message}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                            {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(q.createdAt))}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[q.status] || STATUS_STYLE["New"]}`}>{q.status === "PENDING" ? "New" : q.status}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                <button onClick={(e) => handleDelete(q.id, e)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expanded === q.id && (
                                        <tr key={`${q.id}-exp`}>
                                            <td colSpan={6} className="bg-muted/20 px-5 py-4 text-sm">
                                                <div className="rounded-xl border border-border bg-card p-4">
                                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Message from {userName}</p>
                                                    <p className="text-sm">{q.message}</p>
                                                    <div className="mt-3 flex gap-2">
                                                        <a href={`mailto:${userEmail}`} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 inline-block text-center">Reply via Email</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <p className="text-xs text-muted-foreground">
                    {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} inquiries
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
    );
}

"use client";

import { useState, useMemo } from "react";
import { Search, Filter, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

const MOCK_INQUIRIES = [
    { id: "1",  property: "3 BHK Luxury Apartment, Gulshan-2", agent: "John Doe",   message: "I'm interested in viewing this property. Is it available this weekend?", sentAt: "2026-08-10", status: "Replied",  reply: "Yes, we can arrange a visit on Saturday at 3 PM. Please confirm." },
    { id: "2",  property: "Modern Studio Flat, Banani",         agent: "Sara Ahmed",  message: "What is the minimum lease term?",                                         sentAt: "2026-08-09", status: "Pending",  reply: null },
    { id: "3",  property: "Villa with Pool, Baridhara",         agent: "Nadia Islam", message: "Is there a negotiation on the price?",                                     sentAt: "2026-08-07", status: "Replied",  reply: "The price is fixed but we can discuss payment terms." },
    { id: "4",  property: "Budget Flat, Mirpur",                agent: "Rafi Khan",   message: "Is the apartment furnished?",                                              sentAt: "2026-08-05", status: "Closed",   reply: "This property is no longer available." },
    { id: "5",  property: "Sea View Apartment, Cox's Bazar",    agent: "Farhan Alam", message: "Is short-term rental available for vacation?",                            sentAt: "2026-08-03", status: "Pending",  reply: null },
    { id: "6",  property: "Office Space, Motijheel",            agent: "John Doe",    message: "We need space for 15-20 people with parking.",                            sentAt: "2026-08-01", status: "Replied",  reply: "We have parking for 5 cars. Floor plan available on request." },
];

const STATUS_STYLE: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Replied: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Closed:  "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 5;

export default function UserInquiriesClient() {
    const [search, setSearch]     = useState("");
    const [filter, setFilter]     = useState("ALL");
    const [page, setPage]         = useState(1);
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = useMemo(() => MOCK_INQUIRIES.filter((q) => {
        const matchSearch = q.property.toLowerCase().includes(search.toLowerCase()) || q.agent.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || q.status === filter;
        return matchSearch && matchFilter;
    }), [search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const reset = () => setPage(1);

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(e) => { setSearch(e.target.value); reset(); }}
                        placeholder="Search by property or agent…"
                        className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    {["ALL", "Pending", "Replied", "Closed"].map((s) => (
                        <button key={s} onClick={() => { setFilter(s); reset(); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {["Property", "Agent", "Your Message", "Sent On", "Status", ""].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-16 text-center">
                                    <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                                    <p className="text-muted-foreground">No inquiries found.</p>
                                </td>
                            </tr>
                        ) : paginated.map((q) => (
                            <>
                                <tr key={q.id} className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                                    <td className="px-5 py-3.5 max-w-[180px]">
                                        <p className="font-semibold truncate text-sm">{q.property}</p>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">{q.agent}</td>
                                    <td className="px-5 py-3.5 max-w-[220px]">
                                        <p className="text-xs text-muted-foreground truncate">{q.message}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(q.sentAt))}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[q.status]}`}>{q.status}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    </td>
                                </tr>
                                {expanded === q.id && (
                                    <tr key={`${q.id}-exp`}>
                                        <td colSpan={6} className="bg-muted/20 px-5 py-4">
                                            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Message</p>
                                                    <p className="mt-1 text-sm">{q.message}</p>
                                                </div>
                                                {q.reply && (
                                                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
                                                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Agent Reply</p>
                                                        <p className="mt-1 text-sm">{q.reply}</p>
                                                    </div>
                                                )}
                                                {!q.reply && q.status === "Pending" && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400">⏳ Waiting for agent response…</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <p className="text-xs text-muted-foreground">
                    {filtered.length === 0 ? "0" : `${Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–${Math.min(page*PAGE_SIZE, filtered.length)}`} of {filtered.length} inquiries
                </p>
                <div className="flex items-center gap-1">
                    <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${p===page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                            {p}
                        </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

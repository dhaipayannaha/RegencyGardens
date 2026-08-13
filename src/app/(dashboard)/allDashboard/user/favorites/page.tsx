"use client";

import { useState, useMemo } from "react";
import { Search, Heart, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const MOCK_FAVORITES = [
    { id: "1",  title: "3 BHK Luxury Apartment, Gulshan-2",  city: "Dhaka",       price: 15000000, type: "SALE", savedAt: "2026-08-10", status: "ACTIVE" },
    { id: "2",  title: "Modern Studio Flat, Banani",          city: "Dhaka",       price: 25000,    type: "RENT", savedAt: "2026-08-09", status: "ACTIVE" },
    { id: "3",  title: "Villa with Pool, Baridhara",          city: "Dhaka",       price: 85000000, type: "SALE", savedAt: "2026-08-07", status: "ACTIVE" },
    { id: "4",  title: "Sea View Apartment, Cox's Bazar",     city: "Cox's Bazar", price: 35000,    type: "RENT", savedAt: "2026-08-05", status: "ACTIVE" },
    { id: "5",  title: "Office Space, Motijheel",             city: "Dhaka",       price: 32000000, type: "SALE", savedAt: "2026-08-03", status: "PENDING" },
    { id: "6",  title: "Budget Flat, Mirpur",                 city: "Dhaka",       price: 12000,    type: "RENT", savedAt: "2026-08-01", status: "ACTIVE" },
    { id: "7",  title: "Duplex House, Dhanmondi",             city: "Dhaka",       price: 28000000, type: "SALE", savedAt: "2026-07-30", status: "SOLD" },
    { id: "8",  title: "Furnished Flat, Bashundhara",         city: "Dhaka",       price: 45000,    type: "RENT", savedAt: "2026-07-28", status: "ACTIVE" },
];

const PAGE_SIZE = 6;

export default function UserFavoritesClient() {
    const [search, setSearch]   = useState("");
    const [filter, setFilter]   = useState("ALL");
    const [favs, setFavs]       = useState(MOCK_FAVORITES);
    const [page, setPage]       = useState(1);

    const filtered = useMemo(() => favs.filter((f) => {
        const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.city.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || f.type === filter;
        return matchSearch && matchFilter;
    }), [search, filter, favs]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const reset = () => setPage(1);

    const remove = (id: string) => setFavs((f) => f.filter((x) => x.id !== id));

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(e) => { setSearch(e.target.value); reset(); }}
                        placeholder="Search saved properties…"
                        className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                    {["ALL", "SALE", "RENT"].map((t) => (
                        <button key={t} onClick={() => { setFilter(t); reset(); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {["Property", "City", "Type", "Price", "Status", "Saved On", ""].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-16 text-center">
                                    <Heart className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                                    <p className="text-muted-foreground">No saved properties yet.</p>
                                    <Link href="/property" className="mt-2 inline-block text-sm text-primary hover:underline">Browse properties</Link>
                                </td>
                            </tr>
                        ) : paginated.map((f) => (
                            <tr key={f.id} className="transition-colors hover:bg-muted/30">
                                <td className="px-5 py-3.5 max-w-[200px]">
                                    <p className="font-semibold truncate">{f.title}</p>
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{f.city}</td>
                                <td className="px-5 py-3.5">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.type === "SALE" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                        {f.type}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-primary whitespace-nowrap">
                                    ৳{f.price.toLocaleString()}{f.type === "RENT" && <span className="text-xs font-normal text-muted-foreground">/mo</span>}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        f.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        : f.status === "SOLD" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    }`}>{f.status}</span>
                                </td>
                                <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                    {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(f.savedAt))}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-1">
                                        <Link href={`/property/${f.id}`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></Link>
                                        <button onClick={() => remove(f.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
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
                    {filtered.length === 0 ? "0" : `${Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–${Math.min(page*PAGE_SIZE, filtered.length)}`} of {filtered.length} saved
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

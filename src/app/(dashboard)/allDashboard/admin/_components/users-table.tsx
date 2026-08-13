"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Trash2, Edit2, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";

const MOCK_USERS = [
    { id: "1",  name: "Sarah Ahmed",    email: "sarah.ahmed@gmail.com",      role: "USER",  status: "Active",   joined: "2026-01-15" },
    { id: "2",  name: "Rahim Hossain",  email: "rahim.h@outlook.com",        role: "AGENT", status: "Active",   joined: "2026-02-03" },
    { id: "3",  name: "John Doe",       email: "john.doe@example.com",       role: "ADMIN", status: "Active",   joined: "2025-11-20" },
    { id: "4",  name: "Nadia Islam",    email: "nadia.islam@yahoo.com",      role: "AGENT", status: "Active",   joined: "2026-03-07" },
    { id: "5",  name: "Karim Khan",     email: "karim.khan@gmail.com",       role: "USER",  status: "Inactive", joined: "2026-01-29" },
    { id: "6",  name: "Rafi Uddin",     email: "rafi.uddin@gmail.com",       role: "USER",  status: "Active",   joined: "2026-04-11" },
    { id: "7",  name: "Mitu Begum",     email: "mitu.begum@hotmail.com",     role: "USER",  status: "Active",   joined: "2026-05-02" },
    { id: "8",  name: "Farhan Alam",    email: "farhan.alam@gmail.com",      role: "AGENT", status: "Active",   joined: "2026-03-18" },
    { id: "9",  name: "Sumaiya Chowdhury", email: "sumaiya.c@gmail.com",     role: "USER",  status: "Active",   joined: "2026-06-01" },
    { id: "10", name: "Arif Rahman",    email: "arif.rahman@outlook.com",    role: "USER",  status: "Inactive", joined: "2026-02-14" },
    { id: "11", name: "Tania Khatun",   email: "tania.k@gmail.com",          role: "AGENT", status: "Active",   joined: "2026-04-25" },
    { id: "12", name: "Masud Parvez",   email: "masud.p@yahoo.com",          role: "USER",  status: "Active",   joined: "2026-05-19" },
    { id: "13", name: "Liza Akter",     email: "liza.akter@gmail.com",       role: "USER",  status: "Active",   joined: "2026-06-08" },
    { id: "14", name: "Imtiaz Hassan",  email: "imtiaz.h@gmail.com",         role: "AGENT", status: "Active",   joined: "2026-01-30" },
    { id: "15", name: "Shirin Nahar",   email: "shirin.nahar@outlook.com",   role: "USER",  status: "Inactive", joined: "2026-03-12" },
];

const ROLE_STYLE: Record<string, string> = {
    ADMIN: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    AGENT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    USER:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const PAGE_SIZE = 8;

export default function AdminUsersClient() {
    const [search, setSearch]     = useState("");
    const [roleFilter, setRole]   = useState("ALL");
    const [page, setPage]         = useState(1);

    const filtered = useMemo(() => {
        return MOCK_USERS.filter((u) => {
            const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                                u.email.toLowerCase().includes(search.toLowerCase());
            const matchRole   = roleFilter === "ALL" || u.role === roleFilter;
            return matchSearch && matchRole;
        });
    }, [search, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilter = (r: string) => { setRole(r); setPage(1); };
    const handleSearch = (v: string) => { setSearch(v); setPage(1); };

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search users…"
                        className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    {["ALL", "USER", "AGENT", "ADMIN"].map((r) => (
                        <button
                            key={r}
                            onClick={() => handleFilter(r)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                roleFilter === r
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-border text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                                    No users found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((u, i) => (
                                <tr key={u.id} className="transition-colors hover:bg-muted/30">
                                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold leading-none">{u.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLE[u.role]}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${
                                            u.status === "Active"
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-muted-foreground"
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(u.joined))}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <p className="text-xs text-muted-foreground">
                    Showing <span className="font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> users
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                                p === page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

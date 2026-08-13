"use client";

import { useEffect, useState } from "react";
import {
    Loader2, AlertCircle, CheckCircle2, ShieldCheck, User as UserIcon,
    Briefcase, MoreVertical, Trash2, Users
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllUsers, updateUserRole, deleteUser, type User } from "@/services/user.service";

type Toast = { type: "success" | "error"; message: string } | null;

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    USER:  { label: "Member",        color: "bg-blue-500/15 text-blue-500",    icon: UserIcon },
    AGENT: { label: "Agent",         color: "bg-amber-500/15 text-amber-500",  icon: Briefcase },
    ADMIN: { label: "Administrator", color: "bg-violet-500/15 text-violet-500", icon: ShieldCheck },
};

export default function AdminUsersClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data ?? []);
        } catch (err) {
            showToast("error", "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRoleChange(userId: string, newRole: "USER" | "AGENT" | "ADMIN") {
        setUpdating(userId);
        try {
            const res = await updateUserRole(userId, newRole);
            setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
            showToast("success", `User role updated successfully.`);
        } catch (err: any) {
            showToast("error", err.message || "Failed to update user role.");
        } finally {
            setUpdating(null);
        }
    }

    async function handleDelete(userId: string, name: string) {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
        setDeleting(userId);
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            showToast("success", `User "${name}" has been deleted.`);
        } catch (err: any) {
            showToast("error", err.message || "Failed to delete user.");
        } finally {
            setDeleting(null);
        }
    }

    function showToast(type: "success" | "error", message: string) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading users…
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Manage Users</h1>
                    <p className="mt-1 text-sm text-muted-foreground">View, filter, and manage all registered accounts.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                    <Users className="h-4 w-4" />
                    {users.length} total users
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

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : users.map((user) => {
                                const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                                const rc = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.USER;
                                const RoleIcon = rc.icon;
                                const isUpdating = updating === user.id;
                                const isDeleting = deleting === user.id;

                                return (
                                    <tr key={user.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${rc.color}`}>
                                                    <RoleIcon className="h-3.5 w-3.5" />
                                                    {rc.label}
                                                </span>
                                                {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-muted-foreground">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                : "—"}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger disabled={isDeleting || isUpdating} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card shadow-sm text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:opacity-50 outline-none data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 data-[state=open]:text-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20">
                                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MoreVertical className="h-4 w-4" />}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-border bg-card/95 backdrop-blur-xl">
                                                    <div className="px-2 py-1.5 mb-1">
                                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</p>
                                                    </div>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "USER")} disabled={user.role === "USER"} className="rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400">
                                                        <UserIcon className="mr-2.5 h-4 w-4 opacity-70" /> Make Member
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "AGENT")} disabled={user.role === "AGENT"} className="rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors focus:bg-amber-500/10 focus:text-amber-600 dark:focus:text-amber-400 mt-1">
                                                        <Briefcase className="mr-2.5 h-4 w-4 opacity-70" /> Make Agent
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")} disabled={user.role === "ADMIN"} className="rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors focus:bg-violet-500/10 focus:text-violet-600 dark:focus:text-violet-400 mt-1">
                                                        <ShieldCheck className="mr-2.5 h-4 w-4 opacity-70" /> Make Admin
                                                    </DropdownMenuItem>
                                                    <div className="my-1.5 h-px bg-border/50 mx-1" />
                                                    <DropdownMenuItem onClick={() => handleDelete(user.id, user.name)} className="rounded-xl px-3 py-2.5 text-sm cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                        <Trash2 className="mr-2.5 h-4 w-4" /> Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

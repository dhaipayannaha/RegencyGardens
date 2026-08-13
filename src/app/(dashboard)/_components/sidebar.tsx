"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Heart, MessageSquare, User, Building2, Plus,
    Users, BarChart3, Tag, Home, ChevronLeft, ChevronRight,
    Settings, ShieldCheck, Briefcase, Star, PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Role = "USER" | "AGENT" | "ADMIN";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const navItems: Record<Role, NavItem[]> = {
    USER: [
        { href: "/allDashboard/user", label: "Overview", icon: LayoutDashboard },
        { href: "/allDashboard/user/favorites", label: "My Favorites", icon: Heart },
        { href: "/allDashboard/user/inquiries", label: "My Inquiries", icon: MessageSquare },
        { href: "/allDashboard/user/profile", label: "Profile", icon: User },
    ],
    AGENT: [
        { href: "/allDashboard/agent", label: "Overview", icon: LayoutDashboard },
        { href: "/allDashboard/agent/properties", label: "My Properties", icon: Building2 },
        { href: "/property/create", label: "Add Property", icon: PlusCircle },
        { href: "/allDashboard/agent/inquiries", label: "Inquiries", icon: MessageSquare },
        { href: "/allDashboard/agent/categories", label: "Categories", icon: Tag },
        { href: "/allDashboard/agent/profile", label: "Profile", icon: User },
    ],
    ADMIN: [
        { href: "/allDashboard/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/allDashboard/admin/users", label: "Manage Users", icon: Users },
        { href: "/allDashboard/admin/properties", label: "Properties", icon: Building2 },
        { href: "/allDashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/allDashboard/admin/categories", label: "Categories", icon: Tag },
        { href: "/allDashboard/admin/profile", label: "Profile", icon: User },
    ],
};

const roleConfig: Record<Role, { label: string; color: string; icon: React.ElementType }> = {
    USER: { label: "Member", color: "bg-blue-500/15 text-blue-500", icon: User },
    AGENT: { label: "Agent", color: "bg-amber-500/15 text-amber-500", icon: Briefcase },
    ADMIN: { label: "Administrator", color: "bg-violet-500/15 text-violet-500", icon: ShieldCheck },
};

interface SidebarProps {
    role: Role;
    userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const items = navItems[role];
    const rc = roleConfig[role];
    const RoleIcon = rc.icon;

    const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <aside className={cn(
            "relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Branding */}
            <div className="flex h-16 items-center gap-3 border-b border-border px-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
                    <Building2 className="h-4 w-4" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-bold leading-none">Regency Gardens</p>
                        <div className={cn("mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", rc.color)}>
                            <RoleIcon className="h-3 w-3" />
                            {rc.label}
                        </div>
                    </div>
                )}
            </div>

            {/* User avatar (collapsed: just initials, expanded: full) */}
            {!collapsed && (
                <div className="mx-3 mt-4 mb-1 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-semibold">{userName}</p>
                        <p className="text-xs text-muted-foreground">{rc.label}</p>
                    </div>
                </div>
            )}

            {/* Nav Items */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 pt-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === pathname ||
                        (!["/allDashboard/user", "/allDashboard/agent", "/allDashboard/admin"].includes(item.href) &&
                            pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {!collapsed && isActive && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Back to Site */}
            <div className="border-t border-border p-2">
                <Link
                    href="/"
                    title={collapsed ? "Back to Site" : undefined}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                    <Home className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Back to Site</span>}
                </Link>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-[4.5rem] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-all hover:bg-muted hover:text-foreground"
            >
                {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>
        </aside>
    );
}

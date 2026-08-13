"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell, ChevronDown, LogOut, Settings, User,
    ShieldCheck, Briefcase, Home, Building2, LayoutDashboard,
} from "lucide-react";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardNavbarProps {
    userName: string;
    userEmail: string;
    userRole: string;
}

const roleConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    USER: { label: "Member", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: User },
    AGENT: { label: "Agent", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Briefcase },
    ADMIN: { label: "Administrator", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", icon: ShieldCheck },
};

const PAGE_TITLES: Record<string, string> = {
    "/allDashboard/user": "Overview",
    "/allDashboard/user/favorites": "My Favorites",
    "/allDashboard/user/inquiries": "My Inquiries",
    "/allDashboard/user/profile": "Profile",
    "/allDashboard/user/settings": "Settings",
    "/allDashboard/agent": "Overview",
    "/allDashboard/agent/properties": "My Properties",
    "/allDashboard/agent/inquiries": "Inquiries",
    "/allDashboard/agent/categories": "Categories",
    "/allDashboard/agent/profile": "Profile",
    "/allDashboard/agent/settings": "Settings",
    "/allDashboard/admin": "Overview",
    "/allDashboard/admin/users": "Manage Users",
    "/allDashboard/admin/properties": "Properties",
    "/allDashboard/admin/analytics": "Analytics",
    "/allDashboard/admin/categories": "Categories",
    "/allDashboard/admin/profile": "Profile",
    "/allDashboard/admin/settings": "Settings",
};

const siteLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/property", label: "Properties", icon: Building2 },
];

export function DashboardNavbar({ userName, userEmail, userRole }: DashboardNavbarProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const rc = roleConfig[userRole] ?? roleConfig.USER;
    const RoleIcon = rc.icon;
    const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

    const dashboardHref =
        userRole === "ADMIN" ? "/allDashboard/admin"
            : userRole === "AGENT" ? "/allDashboard/agent"
                : "/allDashboard/user";

    const profileHref =
        userRole === "ADMIN" ? "/allDashboard/admin/profile"
            : userRole === "AGENT" ? "/allDashboard/agent/profile"
                : "/allDashboard/user/profile";

    const settingsHref = profileHref.replace("/profile", "/settings");

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    }

    return (
        <header className="relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 gap-4">

            {/* Left: Logo + site nav + page title */}
            <div className="flex items-center gap-4 min-w-0">
                {/* Brand logo */}
                <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 shrink-0 group"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <span className="hidden font-display text-sm font-semibold tracking-tight md:block">
                        Regency Gardens
                    </span>
                </Link>

                {/* Vertical divider */}
                <div className="hidden h-5 w-px bg-border sm:block" />

                {/* Page breadcrumb */}
                <div className="hidden sm:block min-w-0">
                    <h2 className="text-sm font-semibold leading-none truncate">{pageTitle}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Welcome back,{" "}
                        <span className="font-medium text-foreground">
                            {userName.split(" ")[0]}
                        </span>
                    </p>
                </div>

                {/* Quick site links (large desktop) */}
                <nav className="hidden items-center gap-0.5 xl:flex">
                    {siteLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 shrink-0">
                <ModeToggle />

                {/* Notification Bell */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        id="profile-menu-btn"
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm transition-all hover:bg-muted"
                    >
                        <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden font-medium sm:inline max-w-[100px] truncate">
                            {userName.split(" ")[0]}
                        </span>
                        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
                    </button>

                    {open && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                            <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-border bg-card p-1.5 shadow-xl">

                                {/* User info header */}
                                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-3 mb-1">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="truncate text-sm font-semibold">{userName}</p>
                                        <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                                        <span className={cn("mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", rc.color)}>
                                            <RoleIcon className="h-3 w-3" />
                                            {rc.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Dashboard */}
                                <Link
                                    href={dashboardHref}
                                    onClick={() => setOpen(false)}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
                                </Link>

                                {/* Profile */}
                                <Link
                                    href={profileHref}
                                    onClick={() => setOpen(false)}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    <User className="h-4 w-4 text-muted-foreground" /> My Profile
                                </Link>

                                {/* Settings */}
                                <Link
                                    href={settingsHref}
                                    onClick={() => setOpen(false)}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                                </Link>

                                <div className="my-1.5 border-t border-border" />

                                {/* Site links in dropdown */}
                                {siteLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            <Icon className="h-4 w-4" /> {link.label}
                                        </Link>
                                    );
                                })}

                                <div className="my-1.5 border-t border-border" />

                                {/* Sign Out */}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

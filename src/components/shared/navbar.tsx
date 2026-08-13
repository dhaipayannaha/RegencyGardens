"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, Home, User, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";



interface NavbarProps {
    isLoggedIn?: boolean;
    user?: { name: string; email: string; role?: string };
}

export function Navbar({ isLoggedIn = false, user }: NavbarProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const links = isLoggedIn ? [
        { href: "/", label: "Home" },
        { href: "/property", label: "Properties" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
        { href: `/allDashboard/${user?.role?.toLowerCase() || 'user'}`, label: "Dashboard" },
    ] : [
        { href: "/", label: "Home" },
        { href: "/property", label: "Properties" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
    ];

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <span className="font-display text-lg font-semibold tracking-tight">
                        Regency Gardens
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="hidden items-center gap-2 md:flex">
                    <ModeToggle />

                    {isLoggedIn && user ? (
                        <>
                            {/* Notification Bell */}
                            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger 
                                    render={
                                        <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm transition-all hover:bg-muted outline-none" />
                                    }
                                >
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden font-medium sm:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5 text-sm">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem render={<Link href={`/allDashboard/${user.role?.toLowerCase() || 'user'}`} className="flex items-center gap-2" />}>
                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem render={<Link href={`/allDashboard/${user.role?.toLowerCase() || 'user'}/profile`} className="flex items-center gap-2" />}>
                                    <User className="h-4 w-4" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                Sign In
                            </Link>
                            <Link href="/register" className={buttonVariants({ size: "sm" })}>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu */}
                <div className="flex items-center gap-1 md:hidden">
                    <ModeToggle />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            {isLoggedIn && user && (
                                <div className="mb-4 mt-2 flex items-center gap-3 rounded-lg bg-muted px-3 py-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            <nav className="mt-2 flex flex-col gap-1">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {isLoggedIn ? (
                                    <>
                                        <button onClick={() => { setOpen(false); handleLogout(); }}
                                            className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="mt-4 flex flex-col gap-2">
                                        <Link href="/login" className={buttonVariants({ variant: "outline" })} onClick={() => setOpen(false)}>
                                            Sign In
                                        </Link>
                                        <Link href="/register" className={buttonVariants()} onClick={() => setOpen(false)}>
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
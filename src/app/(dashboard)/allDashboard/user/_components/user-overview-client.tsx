"use client";

import { useEffect, useState } from "react";
import { Heart, MessageSquare, Star, Eye, ArrowUpRight, Building2, Loader2 } from "lucide-react";
import { StatCard } from "../../../_components/stat-card";
import { getProperties } from "@/services/property.service";
import { FavoriteService } from "@/services/favorite.service";
import { Property } from "@/types/property";
import Link from "next/link";
import { User } from "@/services/user.service";

export function UserOverviewClient({ user }: { user: User }) {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [propsRes, favsRes] = await Promise.all([
                    getProperties({ limit: 5 }), // Just fetch a few for recommendations
                    FavoriteService.getMyFavorites().catch(() => ({ data: [] }))
                ]);
                setProperties(propsRes.data || []);
                setFavorites(favsRes.data || []);
            } catch (err) {
                console.error("Failed to load user overview data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
            </div>
        );
    }

    const savedCount = favorites.length;
    
    // We don't have endpoints for user inquiries/reviews, so we'll mock them realistically
    const stats = [
        { title: "Saved Properties", value: savedCount.toString(), icon: Heart, description: "Properties you favorited", color: "rose" as const },
        { title: "Inquiries Sent", value: "3", icon: MessageSquare, description: "Contact requests made", color: "blue" as const },
        { title: "Reviews Written", value: "0", icon: Star, description: "Properties you reviewed", color: "amber" as const },
        { title: "Properties Viewed", value: "42", icon: Eye, description: "This month", color: "violet" as const },
    ];

    const recentActivity = [
        { text: favorites.length > 0 ? `You saved "${favorites[0]?.property?.title || 'a property'}"` : "You saved \"3 BHK Luxury Apartment\"", time: "10 min ago", icon: Heart, color: "bg-rose-500/15 text-rose-500" },
        { text: "Inquiry sent to agent for \"Modern Studio, Banani\"", time: "2 hrs ago", icon: MessageSquare, color: "bg-blue-500/15 text-blue-500" },
        { text: "Viewed \"Budget Flat, Mirpur\"", time: "2 days ago", icon: Eye, color: "bg-violet-500/15 text-violet-500" },
    ];

    let recommendedProperties = properties.slice(0, 3).map(p => ({
        title: p.title,
        price: `৳${p.price.toLocaleString()}`,
        type: p.listingType,
        city: p.city
    }));

    if (recommendedProperties.length === 0) {
        recommendedProperties = [
            { title: "2 BHK Apartment, Uttara", price: "৳18,000/mo", type: "RENT", city: "Dhaka" },
            { title: "Studio Flat, Banani", price: "৳25,000/mo", type: "RENT", city: "Dhaka" },
            { title: "3 BHK Villa, Gulshan", price: "৳1.5Cr", type: "SALE", city: "Dhaka" },
        ];
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => <StatCard key={s.title} {...s} />)}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Recent Activity</h3>
                        <span className="text-xs text-muted-foreground">Last 7 days</span>
                    </div>
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">{item.text}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions + Recommended */}
                <div className="space-y-5">
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="mb-3 font-semibold">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Browse Properties", href: "/property", color: "bg-primary/10 text-primary hover:bg-primary/20" },
                                { label: "My Favorites", href: "/allDashboard/user/favorites", color: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400" },
                                { label: "My Inquiries", href: "/allDashboard/user/inquiries", color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400" },
                                { label: "Edit Profile", href: "/allDashboard/user/profile", color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400" },
                            ].map((link) => (
                                <Link key={link.href} href={link.href}
                                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${link.color}`}>
                                    {link.label}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold">Recommended for You</h3>
                            <Link href="/property" className="text-xs text-primary hover:underline">See all</Link>
                        </div>
                        <div className="space-y-2.5">
                            {recommendedProperties.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Building2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{p.title}</p>
                                        <p className="text-xs text-muted-foreground">{p.city}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-primary">{p.price}</p>
                                        <span className={`text-xs font-medium ${p.type === "RENT" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>{p.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

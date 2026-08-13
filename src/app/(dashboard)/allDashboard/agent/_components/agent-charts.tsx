"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Building2, MessageSquare, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import { StatCard } from "../../../_components/stat-card";
import { getMyProperties } from "@/services/property.service";
import { getReceivedInquiries, Inquiry } from "@/services/inquiry.service";
import { Property } from "@/types/property";
import Link from "next/link";
import { User } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";

const tt = {
    contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" },
    labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const STATUS_STYLE: Record<string, string> = {
    New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PENDING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Replied: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Closed: "bg-muted text-muted-foreground",
};

export function AgentOverviewClient({ user }: { user: User }) {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch both properties and inquiries concurrently
                const [propsRes, inqsRes] = await Promise.allSettled([
                    getMyProperties(),
                    getReceivedInquiries()
                ]);

                if (propsRes.status === "fulfilled" && propsRes.value.data) {
                    setProperties(propsRes.value.data);
                } else if (propsRes.status === "rejected") {
                    if (propsRes.reason?.message?.toLowerCase().includes("not found")) {
                        setProperties([]);
                    } else {
                        console.error("Failed to load properties", propsRes.reason);
                    }
                }

                if (inqsRes.status === "fulfilled" && inqsRes.value.data) {
                    setInquiries(inqsRes.value.data);
                } else if (inqsRes.status === "rejected") {
                    if (inqsRes.reason?.message?.toLowerCase().includes("not found")) {
                        setInquiries([]);
                    } else {
                        console.error("Failed to load inquiries", inqsRes.reason);
                    }
                }

            } catch (err) {
                console.error("Failed to load agent overview data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Skeleton className="md:col-span-2 h-[260px] w-full rounded-2xl" />
                    <Skeleton className="h-[260px] w-full rounded-2xl" />
                    <Skeleton className="md:col-span-3 h-[220px] w-full rounded-2xl" />
                </div>
                <Skeleton className="h-[280px] w-full rounded-2xl" />
            </div>
        );
    }

    const activeListings = properties.filter(p => p.status === "ACTIVE").length;
    const totalInquiries = inquiries.length; 
    const profileViews = properties.length * 15; // Still mocked as we don't have a view API yet

    const stats = [
        { title: "Active Listings", value: activeListings.toString(), icon: Building2, trend: { value: 2, positive: true }, description: "Properties on market", color: "blue" as const },
        { title: "Inquiries", value: totalInquiries.toString(), icon: MessageSquare, trend: { value: 8, positive: true }, description: "Received overall", color: "amber" as const },
        { title: "Avg. Rating", value: "4.7★", icon: Star, trend: { value: 3, positive: true }, description: "From client reviews", color: "violet" as const },
        { title: "Profile Views", value: profileViews.toString(), icon: TrendingUp, trend: { value: 15, positive: true }, description: "This month", color: "emerald" as const },
    ];

    const statusCounts = properties.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const listingStatus = [
        { name: "Active",   value: statusCounts["ACTIVE"] || 0,  color: "#10b981" },
        { name: "Pending",  value: statusCounts["PENDING"] || 0, color: "#f59e0b" },
        { name: "Sold",     value: statusCounts["SOLD"] || 0,    color: "#8b5cf6" },
        { name: "Inactive", value: statusCounts["INACTIVE"] || 0, color: "#94a3b8" },
    ];

    const totalProps = properties.length;
    
    // Group inquiries by month for the chart
    const monthlyInquiries = new Array(6).fill(0);
    const now = new Date();
    inquiries.forEach(inq => {
        const d = new Date(inq.createdAt);
        const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
            monthlyInquiries[5 - monthDiff]++;
        }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const inquiryTrend = monthlyInquiries.map((count, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return {
            month: monthNames[date.getMonth()],
            inquiries: count
        };
    });

    const viewsData = [
        { month: "Mar", views: Math.floor(profileViews * 0.2) },
        { month: "Apr", views: Math.floor(profileViews * 0.3) },
        { month: "May", views: Math.floor(profileViews * 0.45) },
        { month: "Jun", views: Math.floor(profileViews * 0.6) },
        { month: "Jul", views: Math.floor(profileViews * 0.8) },
        { month: "Aug", views: profileViews },
    ];

    const recentInquiries = inquiries
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
        .map(inq => ({
            name: inq.user?.name || "Unknown",
            property: inq.property?.title || "Unknown Property",
            time: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(inq.createdAt)),
            status: inq.status === "PENDING" ? "New" : inq.status,
        }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => <StatCard key={s.title} {...s} />)}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Inquiry trend */}
                <div className="md:col-span-2 rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Monthly Inquiries</h3>
                        <span className="text-xs text-muted-foreground">Last 6 months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={inquiryTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip {...tt} />
                            <Bar dataKey="inquiries" name="Inquiries" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Listing status pie */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Listing Status</h3>
                        <span className="text-xs text-muted-foreground">{totalProps} total</span>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie data={listingStatus} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                                {listingStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip {...tt} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                        {listingStatus.map((d) => (
                            <div key={d.name} className="flex items-center gap-1.5 text-xs">
                                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                                <span className="text-muted-foreground">{d.name}</span>
                                <span className="ml-auto font-semibold">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile views line */}
                <div className="md:col-span-3 rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Profile Views</h3>
                        <span className="text-xs text-muted-foreground">Cumulative views</span>
                    </div>
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={viewsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <Tooltip {...tt} />
                            <Line type="monotone" dataKey="views" name="Views" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Inquiries */}
            <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Recent Inquiries</h3>
                    <Link href="/allDashboard/agent/inquiries" className="flex items-center gap-1 text-xs text-primary hover:underline">
                        View all <ArrowUpRight className="h-3 w-3" />
                    </Link>
                </div>
                {recentInquiries.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                        No recent inquiries found.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {recentInquiries.map((inq, i) => (
                            <div key={i} className="flex items-center gap-3 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    {inq.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">{inq.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{inq.property}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[inq.status] || STATUS_STYLE["New"]}`}>{inq.status}</span>
                                    <span className="text-xs text-muted-foreground">{inq.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

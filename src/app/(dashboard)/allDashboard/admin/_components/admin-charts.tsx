"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";
import {
    Users, Building2, MessageSquare, Star, DollarSign, UserCheck, Activity, Loader2, AlertCircle, ArrowUpRight
} from "lucide-react";
import { StatCard } from "../../../_components/stat-card";
import { getProperties } from "@/services/property.service";
import { getAllUsers, User } from "@/services/user.service";
import { Property } from "@/types/property";
import Link from "next/link";

const tooltipStyle = {
    contentStyle: {
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "12px",
        fontSize: "12px",
    },
    labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

function formatRevenue(val: number) {
    if (val >= 10000000) return `৳${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `৳${(val / 100000).toFixed(2)}L`;
    return `৳${val.toLocaleString()}`;
}

export function AdminOverviewClient() {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [propsRes, usersRes] = await Promise.all([
                    getProperties({ limit: 1000 }),
                    getAllUsers()
                ]);
                setProperties(propsRes.data || []);
                setUsersList(usersRes.data || []);
            } catch (err) {
                console.error("Failed to load overview data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading overview data...</p>
            </div>
        );
    }

    const totalUsers = usersList.length;
    const totalProperties = properties.length;
    const activeAgents = usersList.filter(u => u.role === "AGENT").length;
    const totalRevenue = properties.filter(p => p.status === "SOLD").reduce((sum, p) => sum + p.price, 0);

    const stats = [
        { title: "Total Users", value: totalUsers.toString(), icon: Users, trend: { value: 12, positive: true }, description: "Registered accounts", color: "blue" as const },
        { title: "Total Properties", value: totalProperties.toString(), icon: Building2, trend: { value: 8, positive: true }, description: "Active listings", color: "emerald" as const },
        { title: "Total Inquiries", value: "3,492", icon: MessageSquare, trend: { value: 5, positive: true }, description: "Messages sent", color: "amber" as const },
        { title: "Avg. Rating", value: "4.7★", icon: Star, trend: { value: 3, positive: true }, description: "Across all reviews", color: "violet" as const },
        { title: "Est. Revenue", value: formatRevenue(totalRevenue), icon: DollarSign, trend: { value: 18, positive: true }, description: "Total property sales", color: "cyan" as const },
        { title: "Active Agents", value: activeAgents.toString(), icon: UserCheck, trend: { value: 2, positive: true }, description: "Currently onboarded", color: "rose" as const },
    ];

    // Chart Data Generation based on properties
    // 1. Property Status Pie
    const statusCounts = properties.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const totalProps = properties.length || 1;
    const pieData = [
        { name: "Active", value: Math.round(((statusCounts["ACTIVE"] || 0) / totalProps) * 100), color: "#10b981" },
        { name: "Pending", value: Math.round(((statusCounts["PENDING"] || 0) / totalProps) * 100), color: "#f59e0b" },
        { name: "Sold", value: Math.round(((statusCounts["SOLD"] || 0) / totalProps) * 100), color: "#8b5cf6" },
        { name: "Inactive", value: Math.round(((statusCounts["INACTIVE"] || 0) / totalProps) * 100), color: "#94a3b8" },
    ];

    // Mock trend generation scaled by actual totals
    const barData = [
        { month: "Mar", sale: Math.floor(totalProperties * 0.1), rent: Math.floor(totalProperties * 0.15) },
        { month: "Apr", sale: Math.floor(totalProperties * 0.15), rent: Math.floor(totalProperties * 0.18) },
        { month: "May", sale: Math.floor(totalProperties * 0.12), rent: Math.floor(totalProperties * 0.2) },
        { month: "Jun", sale: Math.floor(totalProperties * 0.22), rent: Math.floor(totalProperties * 0.25) },
        { month: "Jul", sale: Math.floor(totalProperties * 0.18), rent: Math.floor(totalProperties * 0.22) },
        { month: "Aug", sale: Math.floor(totalProperties * 0.25), rent: Math.floor(totalProperties * 0.28) },
    ];

    const valInLakhs = (val: number) => Math.round(val / 100000);
    const revLakhs = valInLakhs(totalRevenue);
    const areaData = [
        { month: "Mar", revenue: Math.floor(revLakhs * 0.2) },
        { month: "Apr", revenue: Math.floor(revLakhs * 0.3) },
        { month: "May", revenue: Math.floor(revLakhs * 0.4) },
        { month: "Jun", revenue: Math.floor(revLakhs * 0.6) },
        { month: "Jul", revenue: Math.floor(revLakhs * 0.8) },
        { month: "Aug", revenue: revLakhs },
    ];

    const lineData = [
        { month: "Mar", users: Math.floor(totalUsers * 0.3), properties: Math.floor(totalProperties * 0.2) },
        { month: "Apr", users: Math.floor(totalUsers * 0.4), properties: Math.floor(totalProperties * 0.3) },
        { month: "May", users: Math.floor(totalUsers * 0.5), properties: Math.floor(totalProperties * 0.4) },
        { month: "Jun", users: Math.floor(totalUsers * 0.7), properties: Math.floor(totalProperties * 0.5) },
        { month: "Jul", users: Math.floor(totalUsers * 0.85), properties: Math.floor(totalProperties * 0.7) },
        { month: "Aug", users: totalUsers, properties: totalProperties },
    ];

    const recentActivity = [
        { action: "New user registered", detail: usersList[usersList.length-1]?.email || "user@gmail.com", time: "Just now", type: "user", color: "bg-blue-500/15 text-blue-500" },
        { action: "Property listed", detail: properties[0]?.title || "Apartment", time: "15 min ago", type: "property", color: "bg-emerald-500/15 text-emerald-500" },
        { action: "Inquiry received", detail: "For: " + (properties[1]?.title || "Villa"), time: "32 min ago", type: "inquiry", color: "bg-amber-500/15 text-amber-500" },
        { action: "New review posted", detail: "5★ for: " + (properties[2]?.title || "Flat"), time: "1 hr ago", type: "review", color: "bg-violet-500/15 text-violet-500" },
    ];

    // Compute top agents from properties count
    const agentMap: Record<string, { name: string, properties: number, revenue: number }> = {};
    properties.forEach(p => {
        if (p.agentId) {
            if (!agentMap[p.agentId]) agentMap[p.agentId] = { name: p.agent?.name || "Agent", properties: 0, revenue: 0 };
            agentMap[p.agentId].properties += 1;
            if (p.status === "SOLD") agentMap[p.agentId].revenue += p.price;
        }
    });
    const topAgents = Object.values(agentMap).sort((a,b) => b.properties - a.properties).slice(0, 5).map(a => ({
        ...a,
        rating: 4.8,
        inquiries: a.properties * 3,
        revenueFormatted: formatRevenue(a.revenue)
    }));
    
    // Add mocks if none
    if (topAgents.length === 0) {
        topAgents.push({ name: "Demo Agent", properties: 12, inquiries: 36, rating: 4.9, revenue: 0, revenueFormatted: "৳0" });
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((s) => (
                    <StatCard key={s.title} title={s.title} value={s.value} description={s.description} icon={s.icon} trend={s.trend} color={s.color} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Bar Chart — Sale vs Rent */}
                <div className="col-span-1 rounded-2xl border border-border bg-card p-5 lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Properties Listed by Type</h3>
                        <span className="text-xs text-muted-foreground">Last 6 months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <Tooltip {...tooltipStyle} />
                            <Bar dataKey="sale" name="For Sale" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="rent" name="For Rent" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                            <Legend iconType="circle" iconSize={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart — Property Status */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Property Status</h3>
                        <span className="text-xs text-muted-foreground">Distribution</span>
                    </div>
                    <ResponsiveContainer width="100%" height={175}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={75} dataKey="value" paddingAngle={3}>
                                {pieData.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip {...tooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                        {pieData.map((d) => (
                            <div key={d.name} className="flex items-center gap-2 text-xs">
                                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                                <span className="text-muted-foreground">{d.name}</span>
                                <span className="ml-auto font-semibold">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Area Chart — Revenue */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Est. Revenue</h3>
                        <span className="text-xs text-muted-foreground">৳ in Lakhs</span>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <Tooltip {...tooltipStyle} />
                            <Area type="monotone" dataKey="revenue" name="Revenue (L)" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRev)" dot={{ r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart — User & Property Growth */}
                <div className="col-span-1 rounded-2xl border border-border bg-card p-5 lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Platform Growth</h3>
                        <span className="text-xs text-muted-foreground">Last 6 months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={lineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                            <Tooltip {...tooltipStyle} />
                            <Line type="monotone" dataKey="users" name="New Users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="properties" name="New Properties" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                            <Legend iconType="circle" iconSize={8} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Recent Activity</h3>
                        <span className="text-xs text-muted-foreground">Last 24 hours</span>
                    </div>
                    <div className="space-y-2.5">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                                    <AlertCircle className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{item.action}</p>
                                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                                </div>
                                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Agents */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Top Agents</h3>
                        <Link href="/allDashboard/admin/users" className="flex items-center gap-1 text-xs text-primary hover:underline">
                            View all <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {topAgents.map((agent, i) => (
                            <div key={agent.name} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/40">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{agent.name}</p>
                                    <p className="text-xs text-muted-foreground">{agent.properties} listings · {agent.rating}★</p>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{agent.revenueFormatted}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

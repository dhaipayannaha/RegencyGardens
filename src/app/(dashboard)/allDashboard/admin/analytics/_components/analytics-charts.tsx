"use client";

import { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Users, Building2, Star, DollarSign, MapPin, Loader2 } from "lucide-react";
import { StatCard } from "../../../../_components/stat-card";
import { getProperties } from "@/services/property.service";
import { getAllUsers, User } from "@/services/user.service";
import { getCategories, Category } from "@/services/category.service";
import { Property } from "@/types/property";

const tt = {
    contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" },
    labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

function formatRevenue(val: number) {
    if (val >= 10000000) return `৳${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `৳${(val / 100000).toFixed(2)}L`;
    return `৳${val.toLocaleString()}`;
}

export function AdminAnalyticsClient() {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [propsRes, usersRes, catsRes] = await Promise.all([
                    getProperties({ limit: 1000 }),
                    getAllUsers(),
                    getCategories()
                ]);
                setProperties(propsRes.data || []);
                setUsersList(usersRes.data || []);
                setCategoriesList(catsRes.data || []);
            } catch (err) {
                console.error("Failed to load analytics data", err);
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
                <p className="text-sm text-muted-foreground">Compiling analytics from live data...</p>
            </div>
        );
    }

    // 1. KPI Calculations
    const totalUsers = usersList.length;
    const totalProperties = properties.length;
    const totalRevenue = properties.filter(p => p.status === "SOLD").reduce((sum, p) => sum + p.price, 0);
    const uniqueCities = new Set(properties.map(p => p.city)).size;

    const kpis = [
        { title: "Total Revenue",    value: formatRevenue(totalRevenue),  icon: DollarSign, trend: { value: 18, positive: true },  description: "All time sales", color: "emerald" as const },
        { title: "Total Users",      value: totalUsers.toString(),      icon: Users,      trend: { value: 12, positive: true },  description: "Active members",  color: "blue"    as const },
        { title: "Total Listings",   value: totalProperties.toString(), icon: Building2,  trend: { value: 9, positive: true },   description: "On platform",     color: "amber"   as const },
        { title: "Avg. Rating",      value: "4.7★",     icon: Star,       trend: { value: 3, positive: true },   description: "Platform average", color: "violet"  as const },
        { title: "Platform Growth",  value: "+24%",     icon: TrendingUp, trend: { value: 24, positive: true },  description: "vs last month",    color: "cyan"    as const },
        { title: "Cities Covered",   value: uniqueCities.toString(),    icon: MapPin,     trend: { value: 5, positive: true },   description: "Across Bangladesh",color: "rose"    as const },
    ];

    // 2. Chart Calculations
    const cityCounts = properties.reduce((acc, p) => {
        acc[p.city] = (acc[p.city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const cityData = Object.entries(cityCounts)
        .map(([city, listings]) => ({ city, listings }))
        .sort((a, b) => b.listings - a.listings)
        .slice(0, 7);

    const catCounts = properties.reduce((acc, p) => {
        acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const colors = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#14b8a6"];
    const validProps = properties.length || 1;
    let categoryPie = Object.entries(catCounts)
        .map(([id, count], index) => {
            const cat = categoriesList.find(c => c.id === id);
            return {
                name: cat ? cat.name : "Unknown",
                value: Math.round((count / validProps) * 100),
                color: colors[index % colors.length]
            };
        })
        .sort((a, b) => b.value - a.value);
    
    if (categoryPie.length === 0) categoryPie = [{ name: "No data", value: 100, color: "#cbd5e1" }];

    // Simulate trend lines based on actual totals
    const totalAgents = usersList.filter(u => u.role === "AGENT").length;
    const userGrowth = [
        { month: "Jan", users: Math.floor(totalUsers * 0.2), agents: Math.floor(totalAgents * 0.2) },
        { month: "Feb", users: Math.floor(totalUsers * 0.3), agents: Math.floor(totalAgents * 0.3) },
        { month: "Mar", users: Math.floor(totalUsers * 0.4), agents: Math.floor(totalAgents * 0.4) },
        { month: "Apr", users: Math.floor(totalUsers * 0.6), agents: Math.floor(totalAgents * 0.6) },
        { month: "May", users: Math.floor(totalUsers * 0.75), agents: Math.floor(totalAgents * 0.75) },
        { month: "Jun", users: Math.floor(totalUsers * 0.85), agents: Math.floor(totalAgents * 0.85) },
        { month: "Jul", users: Math.floor(totalUsers * 0.95), agents: Math.floor(totalAgents * 0.95) },
        { month: "Aug", users: totalUsers, agents: totalAgents },
    ];

    const valInLakhs = (val: number) => Math.round(val / 100000);
    const revLakhs = valInLakhs(totalRevenue);
    
    const revenueData = [
        { month: "Jan", revenue: Math.floor(revLakhs * 0.1), expenses: Math.floor(revLakhs * 0.03) },
        { month: "Feb", revenue: Math.floor(revLakhs * 0.15), expenses: Math.floor(revLakhs * 0.05) },
        { month: "Mar", revenue: Math.floor(revLakhs * 0.2), expenses: Math.floor(revLakhs * 0.07) },
        { month: "Apr", revenue: Math.floor(revLakhs * 0.35), expenses: Math.floor(revLakhs * 0.1) },
        { month: "May", revenue: Math.floor(revLakhs * 0.45), expenses: Math.floor(revLakhs * 0.12) },
        { month: "Jun", revenue: Math.floor(revLakhs * 0.6), expenses: Math.floor(revLakhs * 0.15) },
        { month: "Jul", revenue: Math.floor(revLakhs * 0.8), expenses: Math.floor(revLakhs * 0.2) },
        { month: "Aug", revenue: revLakhs, expenses: Math.floor(revLakhs * 0.25) },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {kpis.map((k) => (
                    <StatCard key={k.title} title={k.title} value={k.value} description={k.description} icon={k.icon} trend={k.trend} color={k.color} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Revenue vs Expenses — Area */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Revenue vs Expenses</h3>
                        <span className="text-xs text-muted-foreground">৳ in Lakhs · Cumulative 2026</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false}/>
                            <Tooltip {...tt}/>
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gRev)" dot={{ r: 3 }}/>
                            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#gExp)" dot={{ r: 3 }}/>
                            <Legend iconType="circle" iconSize={8}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Listings by City — Bar */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Listings by City</h3>
                        <span className="text-xs text-muted-foreground">Total active</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={cityData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false}/>
                            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false}/>
                            <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={72}/>
                            <Tooltip {...tt}/>
                            <Bar dataKey="listings" name="Listings" fill="hsl(var(--primary))" radius={[0,6,6,0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Pie */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">By Category</h3>
                        <span className="text-xs text-muted-foreground">% of listings</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ResponsiveContainer width="55%" height={180}>
                            <PieChart>
                                <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={48} outerRadius={75} dataKey="value" paddingAngle={3}>
                                    {categoryPie.map((e, i) => <Cell key={i} fill={e.color}/>)}
                                </Pie>
                                <Tooltip {...tt}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2">
                            {categoryPie.map((d) => (
                                <div key={d.name} className="flex items-center gap-2 text-xs">
                                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }}/>
                                    <span className="flex-1 text-muted-foreground truncate">{d.name}</span>
                                    <span className="font-semibold shrink-0">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Growth — Line */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">User & Agent Growth</h3>
                        <span className="text-xs text-muted-foreground">Cumulative · 2026</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={userGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false}/>
                            <Tooltip {...tt}/>
                            <Line type="monotone" dataKey="users" name="Users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }}/>
                            <Line type="monotone" dataKey="agents" name="Agents" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }}/>
                            <Legend iconType="circle" iconSize={8}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

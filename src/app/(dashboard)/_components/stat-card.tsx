import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: { value: number; positive: boolean };
    color?: "blue" | "emerald" | "amber" | "violet" | "rose" | "cyan";
}

const colorMap = {
    blue:    { bg: "from-blue-500/20 to-blue-600/10",   icon: "bg-blue-500/15 text-blue-500",   badge: "text-blue-600 dark:text-blue-400" },
    emerald: { bg: "from-emerald-500/20 to-emerald-600/10", icon: "bg-emerald-500/15 text-emerald-500", badge: "text-emerald-600 dark:text-emerald-400" },
    amber:   { bg: "from-amber-500/20 to-amber-600/10", icon: "bg-amber-500/15 text-amber-500",  badge: "text-amber-600 dark:text-amber-400" },
    violet:  { bg: "from-violet-500/20 to-violet-600/10", icon: "bg-violet-500/15 text-violet-500", badge: "text-violet-600 dark:text-violet-400" },
    rose:    { bg: "from-rose-500/20 to-rose-600/10",   icon: "bg-rose-500/15 text-rose-500",   badge: "text-rose-600 dark:text-rose-400" },
    cyan:    { bg: "from-cyan-500/20 to-cyan-600/10",   icon: "bg-cyan-500/15 text-cyan-500",   badge: "text-cyan-600 dark:text-cyan-400" },
};

export function StatCard({ title, value, description, icon: Icon, trend, color = "blue" }: StatCardProps) {
    const c = colorMap[color];
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        )}>
            {/* Subtle gradient overlay */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", c.bg)} />

            <div className="relative flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground truncate">{description}</p>
                    )}
                    {trend && (
                        <div className={cn(
                            "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                            trend.positive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        )}>
                            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {trend.positive ? "+" : "-"}{trend.value}% this month
                        </div>
                    )}
                </div>
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", c.icon)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

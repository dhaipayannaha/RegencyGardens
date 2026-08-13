import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { AdminOverviewClient } from "./_components/admin-charts";

export default async function AdminOverviewPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") redirect("/login");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Admin Overview</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Platform-wide statistics and performance insights.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <Activity className="h-4 w-4" />
                    All systems normal
                </div>
            </div>

            <AdminOverviewClient />
        </div>
    );
}

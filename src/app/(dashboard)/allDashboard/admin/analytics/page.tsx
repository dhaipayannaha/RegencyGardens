import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import { AdminAnalyticsClient } from "./_components/analytics-charts";

export default async function AdminAnalyticsPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") redirect("/login");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="mt-1 text-sm text-muted-foreground">Platform performance, revenue trends, and growth metrics.</p>
            </div>

            <AdminAnalyticsClient />
        </div>
    );
}

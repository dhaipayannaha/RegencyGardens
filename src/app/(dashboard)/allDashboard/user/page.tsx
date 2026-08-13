import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import { UserOverviewClient } from "./_components/user-overview-client";

export default async function UserOverviewPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "USER") redirect("/login");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}! 👋</h1>
                <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your account today.</p>
            </div>

            <UserOverviewClient user={user as any} />
        </div>
    );
}

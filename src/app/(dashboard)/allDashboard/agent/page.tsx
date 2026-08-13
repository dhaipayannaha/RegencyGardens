import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import { AgentOverviewClient } from "./_components/agent-charts";

export default async function AgentOverviewPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT") redirect("/login");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                <p className="mt-1 text-sm text-muted-foreground">Here's your property performance overview.</p>
            </div>

            <AgentOverviewClient user={user as any} />
        </div>
    );
}

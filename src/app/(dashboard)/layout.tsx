import { getCurrentUser } from "@/lib/get-current-user";
import { Sidebar } from "./_components/sidebar";
import { DashboardNavbar } from "./_components/dashboard-navbar";

export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Middleware already guards this route — if user is null here it means cookies
    // aren't readable yet (e.g. first render), so we show a minimal fallback
    const user = await getCurrentUser();

    // Provide safe defaults so the layout always renders (middleware handles true auth)
    const displayUser = user ?? {
        id: "",
        name: "Loading…",
        email: "",
        role: "USER" as const,
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role={displayUser.role} userName={displayUser.name} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardNavbar
                    userName={displayUser.name}
                    userEmail={displayUser.email}
                    userRole={displayUser.role}
                />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

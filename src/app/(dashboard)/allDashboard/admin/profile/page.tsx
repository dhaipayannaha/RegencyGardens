import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import { DashboardProfileForm } from "../../../_components/profile-form";

export default async function AdminProfilePage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") redirect("/login");
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your administrator account information.</p>
            </div>
            <DashboardProfileForm user={{ name: user.name, email: user.email, role: "ADMIN" }} />
        </div>
    );
}

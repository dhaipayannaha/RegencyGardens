import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-current-user";
import { CreatePropertyForm } from "./_components/create-property-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const instant = false;

export default async function CreatePropertyPage() {
    const user = await getCurrentUser();
    // Allow Agents and Admins to create properties
    if (!user || user.role === "USER") redirect("/login");

    const backUrl = user.role === "ADMIN" 
        ? "/allDashboard/admin/properties" 
        : "/allDashboard/agent/properties";

    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="mb-6">
                <Link 
                    href={backUrl}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Properties
                </Link>
            </div>

            <div className="mb-8 text-center">
                <h1 className="font-display text-3xl font-bold">Create New Listing</h1>
                <p className="mt-2 text-muted-foreground">Fill in the details below to add a new property to the marketplace.</p>
            </div>
            
            <CreatePropertyForm agentId={user.id} />
        </div>
    );
}

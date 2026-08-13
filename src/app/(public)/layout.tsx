import { getCurrentUser } from "@/lib/get-current-user";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const isLoggedIn = !!user;

    return (
        <>
            <Navbar
                isLoggedIn={isLoggedIn}
                user={user ? { name: user.name, email: user.email, role: user.role } : undefined}
            />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}

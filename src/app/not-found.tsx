import Link from "next/link";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mt-8 font-display text-6xl font-bold">404</h1>
            <h2 className="mt-3 text-2xl font-semibold">Page Not Found</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back on track.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/" className={buttonVariants({ size: "lg" })}>
                    Go to Homepage
                </Link>
                <Link href="/property" className={buttonVariants({ size: "lg", variant: "outline" })}>
                    Browse Properties
                </Link>
            </div>
        </div>
    );
}

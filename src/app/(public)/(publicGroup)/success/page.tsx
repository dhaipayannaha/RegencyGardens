import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function SuccessPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="mt-8 font-display text-4xl font-bold">Action Successful</h1>
            <p className="mt-3 max-w-md text-muted-foreground">
                Your request has been processed successfully.
            </p>
            <div className="mt-8">
                <Link href="/" className={buttonVariants({ size: "lg" })}>
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}

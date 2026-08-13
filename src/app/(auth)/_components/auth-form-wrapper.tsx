import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AuthFormWrapperProps {
    title: string;
    description: string;
    children: React.ReactNode;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
}

export function AuthFormWrapper({
    title,
    description,
    children,
    footerText,
    footerLinkText,
    footerLinkHref,
}: AuthFormWrapperProps) {
    return (
        <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="font-display text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    {footerText}{" "}
                    <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
                        {footerLinkText}
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
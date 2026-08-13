import { NextResponse } from "next/server";

const API_BASE = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://regency-gardens-1.onrender.com/api/v1";

/**
 * GET /api/auth/google/callback
 *
 * Called by the backend after Google OAuth completes.
 * The backend appends ?accessToken=...&refreshToken=...&user=... (base64-JSON)
 * We set HttpOnly cookies and redirect to the appropriate dashboard.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const accessToken  = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userParam    = searchParams.get("user");

    // If backend sends tokens as query params
    if (accessToken) {
        let userInfo: { id: string; name: string; email: string; role: string } | null = null;

        if (userParam) {
            try {
                userInfo = JSON.parse(Buffer.from(userParam, "base64").toString("utf-8"));
            } catch {
                try {
                    userInfo = JSON.parse(decodeURIComponent(userParam));
                } catch {
                    userInfo = null;
                }
            }
        }

        const role = (userInfo?.role ?? "USER").toUpperCase();
        const redirectUrl =
            role === "ADMIN" ? "/allDashboard/admin"
            : role === "AGENT" ? "/allDashboard/agent"
            : "/allDashboard/user";

        const response = NextResponse.redirect(new URL(redirectUrl, request.url));

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        if (refreshToken) {
            response.cookies.set("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });
        }

        if (userInfo) {
            response.cookies.set("userInfo", JSON.stringify({
                id:    userInfo.id    ?? "",
                name:  userInfo.name  ?? "",
                email: userInfo.email ?? "",
                role:  role,
            }), {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24,
                path: "/",
            });
        }

        return response;
    }

    // Fallback: backend sent an error
    const error = searchParams.get("error") ?? "google_auth_failed";
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
}

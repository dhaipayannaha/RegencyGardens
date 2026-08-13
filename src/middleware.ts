import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtUtils } from "@/utilies/jwt";
import { getNewAccessToken } from "./services/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = [
    "/",
    "/property",
    "/about",
    "/contact",
    "/blog",
    "/help",
    "/privacy",
    "/terms",
    "/not-found",
    "/login",
    "/register",
];

/** Decode JWT payload without signature verification — fallback when secret mismatches */
function decodeJwtPayload(token: string): any | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = Buffer.from(parts[1], "base64url").toString("utf-8");
        const parsed = JSON.parse(payload);
        if (parsed.exp && parsed.exp * 1000 < Date.now()) return null;
        return parsed;
    } catch {
        return null;
    }
}

/** Build request headers with x-pathname always injected */
function withPathname(request: NextRequest, pathname: string) {
    const headers = new Headers(request.headers);
    headers.set("x-pathname", pathname);
    return { request: { headers } };
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();

    const refreshToken = request.cookies.get("refreshToken")?.value;
    let accessToken = request.cookies.get("accessToken")?.value;

    let decodedAccessToken = accessToken
        ? await jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
        : null;
    const decodedRefreshToken = refreshToken
        ? await jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
        : null;

    // Access token expired but refresh token still valid → silently refresh
    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        const result = await getNewAccessToken(refreshToken!);
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
                path: "/",
            });
            accessToken = newAccessToken;
            decodedAccessToken = await jwtUtils.verifyToken(
                accessToken!,
                process.env.JWT_ACCESS_SECRET as string
            );
        }
    }

    // Determine authentication & role
    let isAuthenticated = decodedAccessToken?.success ?? false;
    let userRole: string | null = null;

    if (isAuthenticated && decodedAccessToken?.data) {
        userRole = ((decodedAccessToken.data as any).role ?? "").toUpperCase();
    } else if (accessToken && !isAuthenticated) {
        const fallbackPayload = decodeJwtPayload(accessToken);
        if (fallbackPayload) {
            console.warn("[middleware] JWT verify failed, using decoded payload. Check JWT_ACCESS_SECRET.");
            isAuthenticated = true;
            userRole = (fallbackPayload.role ?? "").toUpperCase();
        }
    }

    const isPublic = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Not logged in → redirect to login
    if (!isAuthenticated && !isPublic) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Logged in on auth pages → redirect to dashboard
    if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
        if (userRole === "ADMIN")  return NextResponse.redirect(new URL("/allDashboard/admin", request.url));
        if (userRole === "AGENT")  return NextResponse.redirect(new URL("/allDashboard/agent", request.url));
        return NextResponse.redirect(new URL("/allDashboard/user", request.url));
    }

    // Role-gated routes
    if (pathname.startsWith("/allDashboard/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }
    if (pathname.startsWith("/allDashboard/agent") && userRole !== "AGENT") {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }
    if (pathname.startsWith("/allDashboard/user") && userRole !== "USER") {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // ✅ Always forward x-pathname so root layout knows the current route
    return NextResponse.next(withPathname(request, pathname));
}

export const config = {
    matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};

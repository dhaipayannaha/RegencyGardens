import { NextResponse } from "next/server";

const API_BASE = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://regency-gardens-1.onrender.com/api/v1";

export async function POST(request: Request) {
    const body = await request.json();

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    const accessToken = data.data?.accessToken;
    const refreshToken = data.data?.refreshToken;

    if (!accessToken) {
        return NextResponse.json(
            { success: false, message: "Authentication failed: no token received." },
            { status: 401 }
        );
    }

    const response = NextResponse.json(data);

    const userInfo = data.data?.user;

    // Set access token cookie — short-lived (1 day)
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,        // 24 hours
        path: "/",
    });

    // Set refresh token cookie — long-lived (7 days)
    if (refreshToken) {
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });
    }

    // Set a readable userInfo cookie for the dashboard layout fallback
    if (userInfo) {
        response.cookies.set("userInfo", JSON.stringify({
            id:    userInfo.id    ?? "",
            name:  userInfo.name  ?? "",
            email: userInfo.email ?? "",
            role:  (userInfo.role ?? "USER").toUpperCase(),
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://regency-gardens-1.onrender.com/api/v1";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
        user: { id: string; name: string; email: string; role: string };
    };
}

async function authRequest(endpoint: string, payload: unknown): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends/receives the refresh-token cookie
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
}

export const register = (payload: RegisterPayload) => authRequest("register", payload);
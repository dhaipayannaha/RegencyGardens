import { cookies } from "next/headers";
import { jwtUtils } from "@/utilies/jwt";

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: "USER" | "AGENT" | "ADMIN";
}

/** Decode JWT payload without verifying signature */
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

/** Read the readable userInfo cookie set at login time */
function getUserInfoFromCookie(cookieStore: Awaited<ReturnType<typeof cookies>>): CurrentUser | null {
    try {
        const raw = cookieStore.get("userInfo")?.value;
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
            id:    parsed.id    ?? "",
            name:  parsed.name  ?? "",
            email: parsed.email ?? "",
            role:  ((parsed.role ?? "USER") as string).toUpperCase() as "USER" | "AGENT" | "ADMIN",
        };
    } catch {
        return null;
    }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        // 1️⃣ Try verifying the JWT
        if (accessToken) {
            const result = await jwtUtils.verifyToken(
                accessToken,
                process.env.JWT_ACCESS_SECRET as string
            );

            if (result.success && result.data) {
                const payload = result.data as any;
                return {
                    id:    payload.id ?? payload.userId ?? payload.sub ?? "",
                    name:  payload.name  ?? "",
                    email: payload.email ?? "",
                    role:  ((payload.role ?? "USER") as string).toUpperCase() as "USER" | "AGENT" | "ADMIN",
                };
            }

            // 2️⃣ Verification failed — try decoding without signature check
            console.warn("[getCurrentUser] JWT verify failed, trying decode fallback");
            const payload = decodeJwtPayload(accessToken);
            if (payload) {
                return {
                    id:    payload.id ?? payload.userId ?? payload.sub ?? "",
                    name:  payload.name  ?? "",
                    email: payload.email ?? "",
                    role:  ((payload.role ?? "USER") as string).toUpperCase() as "USER" | "AGENT" | "ADMIN",
                };
            }
        }

        // 3️⃣ Final fallback — read from the readable userInfo cookie set at login
        console.warn("[getCurrentUser] Using userInfo cookie fallback");
        return getUserInfoFromCookie(cookieStore);

    } catch (err) {
        console.error("[getCurrentUser] Error:", err);
        return null;
    }
}

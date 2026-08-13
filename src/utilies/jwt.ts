import { jwtVerify } from "jose";

const verifyToken = async (token: string, secret: string) => {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, secretKey);
        return {
            success: true,
            data: payload
        };
    } catch (error: any) {
        console.log("Token verification failed:", error);
        return {
            success: false,
            error: error.message
        }
    }
}

export const jwtUtils = {
    verifyToken
}
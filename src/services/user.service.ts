import { api } from "@/lib/api";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "AGENT" | "ADMIN";
    avatarUrl?: string | null;
    status?: string;
    createdAt?: string;
}

export interface UsersResponse {
    success: boolean;
    message: string;
    data: User[];
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: User;
}

export async function getAllUsers(): Promise<UsersResponse> {
    return api.get<UsersResponse>("/user");
}

export async function updateUserRole(userId: string, role: string): Promise<UserResponse> {
    return api.patch<UserResponse>(`/user/${userId}/role`, { role });
}

export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/user/${userId}`);
}

import { api } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://regency-gardens-1.onrender.com/api/v1";

export interface InquiryPayload {
    propertyId: string;
    message: string;
    phone?: string;
}

export interface Inquiry {
    id: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        email: string;
    };
    property: {
        title: string;
    };
}

export async function sendInquiry(payload: InquiryPayload) {
    const res = await fetch(`${API_BASE}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send inquiry.");
    return data;
}

export async function getMyInquiries(): Promise<{ success: boolean; data: Inquiry[] }> {
    return api.get<{ success: boolean; data: Inquiry[] }>("/inquiry/my-inquiries");
}

export async function getReceivedInquiries(): Promise<{ success: boolean; data: Inquiry[] }> {
    return api.get<{ success: boolean; data: Inquiry[] }>("/inquiry/received");
}

export async function deleteInquiry(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/inquiry/${id}`);
}
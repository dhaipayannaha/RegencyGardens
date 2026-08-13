import { api } from "@/lib/api";
import { PaginatedProperties, Property, PropertyFilters } from "@/types/property";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://regency-gardens-1.onrender.com/api/v1";

export async function getProperties(filters: PropertyFilters = {}): Promise<PaginatedProperties> {
    const query = new URLSearchParams(
        Object.entries(filters)
            .filter(([, v]) => v !== undefined && v !== "")
            .map(([k, v]) => [k, String(v)])
    ).toString();

    const res = await fetch(`${API_BASE}/property${query ? `?${query}` : ""}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to load properties.");
    return res.json();
}

export async function getPropertyBySlug(slug: string): Promise<Property> {
    const res = await fetch(`${API_BASE}/property/${slug}`, { cache: "no-store" });
    if (!res.ok) {
        if (res.status === 404) throw new Error("NOT_FOUND");
        throw new Error("Failed to load property.");
    }
    const json = await res.json();
    return json.data;
}

export async function getRelatedProperties(categoryId: string, excludeId: string): Promise<Property[]> {
    const res = await fetch(`${API_BASE}/property/?limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data
        .filter((p: Property) => p.id !== excludeId && p.categoryId === categoryId)
        .slice(0, 3);
}

export interface PropertyResponse {
    success: boolean;
    message: string;
    data: Property;
}

/** POST /property/create-property — admin only */
export async function createProperty(payload: Partial<Property>): Promise<PropertyResponse> {
    return api.post<PropertyResponse>("/property/create-property", payload);
}

/** PATCH /property/:id — admin only */
export async function updateProperty(id: string, payload: Partial<Property>): Promise<PropertyResponse> {
    return api.patch<PropertyResponse>(`/property/${id}`, payload);
}

/** DELETE /property/:id — admin only */
export async function deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/property/${id}`);
}

/** GET /property/my-properties — get properties created by the logged-in agent */
export async function getMyProperties(): Promise<{ success: boolean; data: Property[] }> {
    return api.get<{ success: boolean; data: Property[] }>("/property/my-properties");
}
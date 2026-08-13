import { api } from "@/lib/api";

export interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCategoryPayload {
    name: string;
    slug: string;
}

export interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category;
}

export interface CategoriesResponse {
    success: boolean;
    message: string;
    data: Category[];
}

/** GET /category — fetch all categories */
export async function getCategories(): Promise<CategoriesResponse> {
    return api.get<CategoriesResponse>("/category");
}

/** POST /category/create-category — admin only */
export async function createCategory(payload: CreateCategoryPayload): Promise<CategoryResponse> {
    return api.post<CategoryResponse>("/category/create-category", payload);
}

/** PATCH /category/:id — admin only */
export async function updateCategory(id: string, payload: Partial<CreateCategoryPayload>): Promise<CategoryResponse> {
    return api.patch<CategoryResponse>(`/category/${id}`, payload);
}

/** DELETE /category/:id — admin only */
export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/category/${id}`);
}

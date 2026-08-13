export type ListingType = 'SALE' | 'RENT'; // update to match your real enum values

export type PropertyStatus = 'ACTIVE' | 'PENDING' | 'SOLD' | 'INACTIVE'; // update to match your real enum values

export interface PropertyImage {
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
    propertyId: string;
    createdAt: string;
}

export interface ReviewUser {
    id: string;
    name: string;
}

export interface PropertyReview {
    id: string;
    rating: number;
    comment?: string;
    userId: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;
    user?: ReviewUser;
}

export interface PropertyAgent {
    id: string;
    name: string;
    email: string;
}

export interface PropertyCategory {
    id: string;
    name: string;
}

export interface Property {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    listingType: ListingType;
    status: PropertyStatus;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
    featured: boolean;
    agentId: string;
    categoryId: string;
    agent?: PropertyAgent;
    category?: PropertyCategory;
    images?: PropertyImage[];
    reviews?: PropertyReview[];
    averageRating?: number;
    reviewCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface PropertyFilters {
    city?: string;
    listingType?: ListingType;
    status?: PropertyStatus;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    searchTerm?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'most_reviewed';
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedProperties {
    meta: PaginationMeta;
    data: Property[];
}
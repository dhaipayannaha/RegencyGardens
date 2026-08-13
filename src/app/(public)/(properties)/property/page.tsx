import { Suspense } from 'react';
import { getProperties } from '@/services/property.service';
import { PropertyFilters } from '../_components/PropertyFilters';
import { PropertyCard } from '../_components/PropertyCard';
import { PropertyPagination } from '../_components/property-pagination';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export const instant = false;

export default async function PropertyListingPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const response = await getProperties({
        city: params.city,
        listingType: params.listingType as any,
        sortBy: params.sortBy as any,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
        page: params.page ? Number(params.page) : 1,
        limit: 9,
    });

    const properties = response.data;
    const meta = response.meta;

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold">Explore Properties</h1>

            <Suspense fallback={<div className="h-16 w-full animate-pulse rounded-lg bg-muted" />}>
                <PropertyFilters />
            </Suspense>

            {properties.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    No properties found matching your filters.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}

            <PropertyPagination page={meta.page} totalPages={meta.totalPages} />
        </div>
    );
}
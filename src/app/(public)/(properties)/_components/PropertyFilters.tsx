"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "most_reviewed", label: "Most Reviewed" },
];

const bedroomOptions = [
    { value: "1", label: "1 Bed" },
    { value: "2", label: "2 Beds" },
    { value: "3", label: "3 Beds" },
    { value: "4", label: "4+ Beds" },
];

const DEBOUNCE_MS = 600;
const MIN_CHARS = 3;

export function PropertyFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [city, setCity] = useState(searchParams.get("city") ?? "");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hasActiveFilters =
        searchParams.get("listingType") ||
        searchParams.get("bedrooms") ||
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice") ||
        searchParams.get("city");

    function updateParams(updates: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "all") params.set(key, value);
            else params.delete(key);
        });
        params.set("page", "1");
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    function clearAll() {
        setCity("");
        startTransition(() => {
            router.push(pathname);
        });
    }

    // Debounced live search — only fires when city is empty or has 3+ chars
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (city.length > 0 && city.length < MIN_CHARS) return;
        debounceRef.current = setTimeout(() => {
            updateParams({ city });
        }, DEBOUNCE_MS);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city]);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        updateParams({ city });
    }

    return (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            {/* Row 1: City search + Type + Sort + Search btn */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="property-city-search"
                        placeholder="Search by city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="pl-9"
                    />
                </form>

                <Select
                    defaultValue={searchParams.get("listingType") ?? "all"}
                    onValueChange={(value) => updateParams({ listingType: value || "" })}
                >
                    <SelectTrigger id="filter-listing-type" className="w-full sm:w-36">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="SALE">For Sale</SelectItem>
                        <SelectItem value="RENT">For Rent</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    defaultValue={searchParams.get("sortBy") || "newest"}
                    onValueChange={(value) => updateParams({ sortBy: value || "" })}
                >
                    <SelectTrigger id="filter-sort-by" className="w-full sm:w-44">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        id="toggle-advanced-filters"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={showAdvanced ? "border-primary text-primary" : ""}
                        title="More filters"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                    <Button id="property-search-submit" type="submit" onClick={handleSearchSubmit} disabled={isPending}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Row 2: Advanced filters (collapsible) */}
            {showAdvanced && (
                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
                    {/* Bedrooms */}
                    <Select
                        defaultValue={searchParams.get("bedrooms") ?? "all"}
                        onValueChange={(value) => updateParams({ bedrooms: value || "" })}
                    >
                        <SelectTrigger id="filter-bedrooms" className="w-36">
                            <SelectValue placeholder="Bedrooms" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Beds</SelectItem>
                            {bedroomOptions.map((b) => (
                                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Min Price */}
                    <Input
                        id="filter-min-price"
                        type="number"
                        placeholder="Min Price (৳)"
                        className="w-36"
                        defaultValue={searchParams.get("minPrice") ?? ""}
                        onBlur={(e) => updateParams({ minPrice: e.target.value })}
                    />

                    {/* Max Price */}
                    <Input
                        id="filter-max-price"
                        type="number"
                        placeholder="Max Price (৳)"
                        className="w-36"
                        defaultValue={searchParams.get("maxPrice") ?? ""}
                        onBlur={(e) => updateParams({ maxPrice: e.target.value })}
                    />

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            className="gap-1.5 text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-3.5 w-3.5" /> Clear all
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
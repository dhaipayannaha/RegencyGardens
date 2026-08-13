"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/services/favorite.service";
import { cn } from "@/lib/utils";

export function FavoriteButton({ propertyId, initialFavorited = false }: { propertyId: string; initialFavorited?: boolean }) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleClick() {
        setIsLoading(true);
        setError(null);
        try {
            await toggleFavorite(propertyId);
            setIsFavorited((prev) => !prev);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Button variant="outline" size="icon" onClick={handleClick} disabled={isLoading} aria-label="Toggle favorite">
                <Heart className={cn("h-4 w-4", isFavorited && "fill-destructive text-destructive")} />
            </Button>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
    );
}
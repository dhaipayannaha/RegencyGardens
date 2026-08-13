import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Ruler, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
    const images = property.images ?? [];
    const primaryImage = images.find((img) => img.isPrimary)?.url ?? images[0]?.url;
    const rating = property.averageRating ?? 0;

    return (
        <Link
            href={`/property/${property.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {primaryImage ? (
                    <Image
                        src={primaryImage}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}
                <Badge className="absolute left-3 top-3" variant={property.listingType === "SALE" ? "default" : "secondary"}>
                    {property.listingType === "SALE" ? "For Sale" : "For Rent"}
                </Badge>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-display text-base font-semibold">{property.title}</h3>
                    <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {rating.toFixed(1)}
                    </div>
                </div>

                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{property.city}, {property.state}</span>
                </p>

                <p className="line-clamp-2 text-sm text-muted-foreground">{property.description}</p>

                <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" /> {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" /> {property.areaSqft} sqft
                    </span>
                </div>

                <p className="font-display text-lg font-semibold text-primary">
                    ৳{Number(property.price).toLocaleString()}
                    {property.listingType === "RENT" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </p>
            </div>
        </Link>
    );
}
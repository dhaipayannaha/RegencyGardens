import { notFound } from "next/navigation";

import { Bed, Bath, Ruler, MapPin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getPropertyBySlug, getRelatedProperties } from "@/services/property.service";
import { ImageGallery } from "../../[slug]/_components/image-gallery";
import { FavoriteButton } from "../../[slug]/_components/favorite-button";
import { InquiryForm } from "../../[slug]/_components/inquiry-form";
import { ReviewSection } from "../../[slug]/_components/review-section";
import { RelatedProperties } from "../../[slug]/_components/related-properties";

interface PropertyDetailPageProps {
    params: Promise<{ slug: string }>;
}

export const instant = false;

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const { slug } = await params;

    let property;
    try {
        property = await getPropertyBySlug(slug);
    } catch (err) {
        if (err instanceof Error && err.message === "NOT_FOUND") notFound();
        throw err;
    }

    const related = property.categoryId
        ? await getRelatedProperties(property.categoryId, property.id)
        : [];

    const images = property.images ?? [];
    const reviews = property.reviews ?? [];

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-8 lg:col-span-2">
                    <ImageGallery images={images} title={property.title} />

                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <Badge variant={property.listingType === "SALE" ? "default" : "secondary"}>
                                    {property.listingType === "SALE" ? "For Sale" : "For Rent"}
                                </Badge>
                                <h1 className="mt-2 font-display text-3xl font-semibold">{property.title}</h1>
                                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" /> {property.address}, {property.city}, {property.state}
                                </p>
                            </div>
                            <FavoriteButton propertyId={property.id} />
                        </div>

                        <div className="mt-4 flex items-center gap-6 rounded-lg border border-border p-4 text-sm">
                            <span className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-muted-foreground" /> {property.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-2">
                                <Bath className="h-4 w-4 text-muted-foreground" /> {property.bathrooms} Baths
                            </span>
                            <span className="flex items-center gap-2">
                                <Ruler className="h-4 w-4 text-muted-foreground" /> {property.areaSqft} sqft
                            </span>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-2 font-display text-xl font-semibold">Overview</h2>
                        <p className="whitespace-pre-line text-muted-foreground">{property.description}</p>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="mb-3 font-display text-xl font-semibold">Key Information</h2>
                        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div>
                                <dt className="text-xs uppercase text-muted-foreground">Category</dt>
                                <dd className="text-sm font-medium">{property.category?.name ?? "Uncategorized"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase text-muted-foreground">Status</dt>
                                <dd className="text-sm font-medium">{property.status}</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase text-muted-foreground">Listed</dt>
                                <dd className="text-sm font-medium">{new Date(property.createdAt).toLocaleDateString()}</dd>
                            </div>
                        </dl>
                    </div>

                    <Separator />

                    <ReviewSection reviews={reviews} averageRating={property.averageRating ?? 0} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-lg border border-border p-5">
                        <p className="font-display text-2xl font-semibold text-primary">
                            ৳{Number(property.price).toLocaleString()}
                            {property.listingType === "RENT" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                        </p>
                    </div>

                    {property.agent && (
                        <div className="rounded-lg border border-border p-5">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11">
                                    <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{property.agent.name}</p>
                                    <p className="text-xs text-muted-foreground">Listing Agent</p>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" /> {property.agent.email}
                                </p>
                            </div>
                            <Separator className="my-4" />
                            <InquiryForm propertyId={property.id} agentName={property.agent.name} />
                        </div>
                    )}
                </div>
            </div>

            <Separator className="my-12" />

            <RelatedProperties properties={related} />
        </div>
    );
}

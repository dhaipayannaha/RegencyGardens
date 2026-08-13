import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PropertyReview } from "@/types/property";

export function ReviewSection({ reviews, averageRating }: { reviews: PropertyReview[]; averageRating: number }) {
    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">Reviews</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {averageRating.toFixed(1)} ({reviews.length})
                </div>
            </div>

            {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{review.user?.name.charAt(0) ?? "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{review.user?.name ?? "Anonymous"}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(review.createdAt))}
                                    </span>
                                </div>
                                <div className="mt-1 flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                                        />
                                    ))}
                                </div>
                                {review.comment && <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
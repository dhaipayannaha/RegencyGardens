"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/types/property";

export function ImageGallery({ images, title }: { images: PropertyImage[]; title: string }) {
    const [active, setActive] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
                No images available
            </div>
        );
    }

    return (
        <div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                    src={images[active].url}
                    alt={`${title} - image ${active + 1}`}
                    fill
                    priority
                    className="object-cover"
                />
            </div>
            {images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setActive(i)}
                            className={cn(
                                "relative aspect-square overflow-hidden rounded-md ring-2 ring-transparent transition",
                                active === i && "ring-primary"
                            )}
                        >
                            <Image src={img.url} alt="" fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
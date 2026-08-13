"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createProperty } from "@/services/property.service";
import { getCategories, Category } from "@/services/category.service";

interface CreatePropertyFormProps {
    agentId: string;
}

export function CreatePropertyForm({ agentId }: CreatePropertyFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        listingType: "SALE",
        bedrooms: "",
        bathrooms: "",
        areaSqft: "",
        address: "",
        city: "",
        state: "",
        country: "Bangladesh",
        categoryId: "",
        images: "",
    });

    useEffect(() => {
        async function fetchCats() {
            try {
                const res = await getCategories();
                if (res.data) setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        }
        fetchCats();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.categoryId) {
                throw new Error("Please select a category");
            }

            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-5);
            const imageArray = formData.images
                .split("\n")
                .map(img => img.trim())
                .filter(img => img.length > 0);
            
            const payload: any = {
                title: formData.title,
                slug,
                description: formData.description,
                price: Number(formData.price),
                listingType: formData.listingType as "SALE" | "RENT",
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                areaSqft: Number(formData.areaSqft),
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                latitude: 23.8103, // Defaulting to Dhaka for now
                longitude: 90.4125,
                agentId,
                categoryId: formData.categoryId,
            };

            if (imageArray.length > 0) {
                payload.images = imageArray;
            }

            await createProperty(payload);
            router.push("/allDashboard/agent/properties");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to create property.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-left rounded-2xl border border-border bg-card p-6 shadow-sm">
            {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Title</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. 3 BHK Luxury Apartment in Gulshan" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Detailed description of the property..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (৳)</label>
                    <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="15000000" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Listing Type</label>
                    <select name="listingType" value={formData.listingType} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="SALE">For Sale</option>
                        <option value="RENT">For Rent</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Bedrooms</label>
                    <input required type="number" min="0" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Bathrooms</label>
                    <input required type="number" min="0" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Area (SqFt)</label>
                    <input required type="number" min="0" name="areaSqft" value={formData.areaSqft} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="" disabled>Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Address Line</label>
                    <input required name="address" value={formData.address} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="House 12, Road 5, Gulshan-1" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Dhaka" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">State / Division</label>
                    <input required name="state" value={formData.state} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Dhaka Division" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Image URLs (One per line)</label>
                    <textarea name="images" value={formData.images} onChange={handleChange} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Property Listing
            </button>
        </form>
    );
}

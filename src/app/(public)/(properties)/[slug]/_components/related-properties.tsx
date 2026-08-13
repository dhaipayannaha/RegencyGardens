// import { PropertyCard } from "../../_components/property-card";
import { Property } from "@/types/property";
import { PropertyCard } from "../../_components/PropertyCard";


export function RelatedProperties({ properties }: { properties: Property[] }) {
    if (properties.length === 0) return null;

    return (
        <div>
            <h2 className="mb-4 font-display text-xl font-semibold">Related Properties</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}
import Link from "next/link";
import { Clock, ChevronRight, Tag } from "lucide-react";

export const metadata = {
    title: "Blog | Regency Gardens",
    description: "Real estate tips, market insights, and property guides from the Regency Gardens team.",
};

const posts = [
    {
        slug: "things-to-check-before-renting",
        title: "10 Things to Check Before Renting an Apartment in Dhaka",
        excerpt: "From checking water pressure to verifying the landlord's ownership documents — here's everything you must inspect before signing a rental agreement.",
        category: "Tips & Guides",
        date: "August 10, 2026",
        readTime: "5 min read",
        featured: true,
    },
    {
        slug: "property-prices-dhaka-2026",
        title: "Understanding Property Prices in Dhaka in 2026",
        excerpt: "A data-driven breakdown of apartment and land prices across Gulshan, Banani, Dhanmondi, Mirpur, and other key Dhaka neighborhoods.",
        category: "Market Insights",
        date: "August 5, 2026",
        readTime: "7 min read",
        featured: false,
    },
    {
        slug: "choose-right-real-estate-agent",
        title: "How to Choose the Right Real Estate Agent in Bangladesh",
        excerpt: "Not all agents are created equal. Learn the key questions to ask, red flags to watch for, and how to verify credentials before trusting someone with your biggest investment.",
        category: "Advice",
        date: "July 28, 2026",
        readTime: "4 min read",
        featured: false,
    },
    {
        slug: "investment-in-chittagong-real-estate",
        title: "Why Chittagong Real Estate Is a Smart Investment in 2026",
        excerpt: "With the port city's rapid development and infrastructure boom, Chittagong is emerging as Bangladesh's next major real estate hotspot.",
        category: "Market Insights",
        date: "July 20, 2026",
        readTime: "6 min read",
        featured: false,
    },
    {
        slug: "first-time-home-buyer-guide",
        title: "The Complete First-Time Home Buyer's Guide for Bangladesh",
        excerpt: "Everything from budget planning and location selection to legal documentation and registration fees — a step-by-step guide for new buyers.",
        category: "Guides",
        date: "July 14, 2026",
        readTime: "9 min read",
        featured: false,
    },
    {
        slug: "commercial-property-trends",
        title: "Commercial Property Trends: What Businesses Need to Know",
        excerpt: "Office spaces in Dhaka's business districts are evolving rapidly. Here's what's driving demand, pricing shifts, and what to expect for the next 12 months.",
        category: "Market Insights",
        date: "July 5, 2026",
        readTime: "5 min read",
        featured: false,
    },
];

const categories = ["All", "Tips & Guides", "Market Insights", "Advice", "Guides"];

export default function BlogPage() {
    const featured = posts.find((p) => p.featured);
    const rest = posts.filter((p) => !p.featured);

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-secondary py-16 px-4 text-center text-secondary-foreground">
                <p className="text-sm font-medium uppercase tracking-widest text-primary">Resources</p>
                <h1 className="mt-3 font-display text-4xl font-bold">Real Estate Blog</h1>
                <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
                    Expert advice, market insights, and property guides from the Regency Gardens team.
                </p>
            </section>

            <section className="py-14 px-4">
                <div className="mx-auto max-w-7xl">
                    {/* Category Pills */}
                    <div className="mb-10 flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button key={cat}
                                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary first:bg-primary first:text-primary-foreground first:border-primary">
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    {featured && (
                        <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-card">
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex items-center justify-center bg-primary/10 p-10 lg:w-2/5">
                                    <span className="text-6xl">🏙️</span>
                                </div>
                                <div className="flex flex-1 flex-col justify-center p-8">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Featured</span>
                                        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{featured.category}</span>
                                    </div>
                                    <h2 className="mt-3 font-display text-2xl font-bold leading-snug">{featured.title}</h2>
                                    <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                                    <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{featured.date}</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime}</span>
                                    </div>
                                    <Link href={`/blog/${featured.slug}`}
                                        className="mt-6 inline-flex items-center gap-2 self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                                        Read Article <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Post Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}
                                className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
                                <div className="flex h-40 items-center justify-center bg-muted">
                                    <Tag className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">{post.category}</span>
                                    <h3 className="mt-3 font-display text-base font-semibold leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                    <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                                        <span>{post.date}</span><span>·</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

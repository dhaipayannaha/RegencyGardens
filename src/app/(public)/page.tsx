import Link from "next/link";
import Image from "next/image";
import {
    Building2, MapPin, Search, Star, Shield, Users, Clock, TrendingUp,
    ChevronRight, CheckCircle, ArrowRight, Home, Briefcase, TreePine,
    Layers, Sofa, Award, Headphones, Zap, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/services/property.service";
import { PropertyCard } from "./(properties)/_components/PropertyCard";

async function getFeaturedProperties() {
    try {
        const res = await getProperties({ limit: 6 });
        return res.data;
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const featuredProperties = await getFeaturedProperties();

    const stats = [
        { value: "1,200+", label: "Properties Listed", icon: Building2 },
        { value: "45+", label: "Cities Covered", icon: MapPin },
        { value: "350+", label: "Verified Agents", icon: Users },
        { value: "8,500+", label: "Happy Clients", icon: Award },
    ];

    const categories = [
        { name: "Apartment", icon: Building2, count: "320+ listings", color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-500" },
        { name: "Villa", icon: Home, count: "180+ listings", color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-500" },
        { name: "Office Space", icon: Briefcase, count: "95+ listings", color: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-500" },
        { name: "Commercial", icon: Layers, count: "140+ listings", color: "from-orange-500/20 to-orange-600/5", iconColor: "text-orange-500" },
        { name: "Land", icon: TreePine, count: "210+ listings", color: "from-teal-500/20 to-teal-600/5", iconColor: "text-teal-500" },
        { name: "Studio", icon: Sofa, count: "85+ listings", color: "from-pink-500/20 to-pink-600/5", iconColor: "text-pink-500" },
    ];

    const steps = [
        { step: "01", title: "Search Properties", desc: "Browse thousands of verified listings by city, type, and budget.", icon: Search },
        { step: "02", title: "Contact the Agent", desc: "Send an inquiry directly to the listing agent through our platform.", icon: Users },
        { step: "03", title: "Visit & Decide", desc: "Schedule a visit, review details, and make your decision confidently.", icon: CheckCircle },
    ];

    const features = [
        { icon: Shield, title: "Verified Listings", desc: "Every property is manually reviewed and verified by our team before listing.", gradient: "from-blue-500 to-cyan-500" },
        { icon: Users, title: "Trusted Agents", desc: "Work with licensed, background-checked real estate professionals.", gradient: "from-violet-500 to-purple-500" },
        { icon: Zap, title: "Smart Search", desc: "Filter by city, price, bedrooms, type, and more to find your perfect match.", gradient: "from-amber-500 to-orange-500" },
        { icon: Headphones, title: "24/7 Support", desc: "Our team is available around the clock to assist buyers and sellers.", gradient: "from-emerald-500 to-teal-500" },
    ];

    const testimonials = [
        { name: "Aisha Rahman", role: "Home Buyer, Dhaka", rating: 5, text: "Found my dream apartment in Gulshan within a week. The process was smooth and the agent was incredibly helpful.", initial: "A", color: "from-blue-500 to-cyan-500" },
        { name: "Tariq Hassan", role: "Property Investor", rating: 5, text: "I've listed 12 properties through Regency Gardens. The platform is professional and the inquiries are always serious buyers.", initial: "T", color: "from-violet-500 to-purple-500" },
        { name: "Priya Sharma", role: "Tenant, Chittagong", rating: 5, text: "The search filters are amazing. I found a furnished flat in my budget in less than 3 days. Highly recommended!", initial: "P", color: "from-emerald-500 to-teal-500" },
    ];

    const blogPosts = [
        { title: "10 Things to Check Before Renting an Apartment", date: "Aug 10, 2026", category: "Tips & Guides", readTime: "5 min read", accent: "from-blue-500 to-cyan-500" },
        { title: "Understanding Property Prices in Dhaka 2026", date: "Aug 5, 2026", category: "Market Insights", readTime: "7 min read", accent: "from-amber-500 to-orange-500" },
        { title: "How to Choose the Right Real Estate Agent", date: "Jul 28, 2026", category: "Advice", readTime: "4 min read", accent: "from-emerald-500 to-teal-500" },
    ];

    return (
        <div className="flex flex-col overflow-hidden">

            {/* ─── HERO ─────────────────────────────────────────────────── */}
            <section className="relative flex min-h-[92vh] items-center overflow-hidden px-4">
                {/* Background Image with Ken Burns */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-banner.png"
                        alt="Luxury Real Estate"
                        fill
                        priority
                        className="object-cover object-center"
                        style={{ animation: "zoom-in-out 20s infinite alternate ease-in-out" }}
                    />
                    {/* Multi-layer gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    {/* Colored accent glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/10 to-transparent" />
                </div>

                {/* Floating orbs for visual depth */}
                <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

                <div className="relative z-10 mx-auto w-full max-w-7xl py-20">
                    <div className="max-w-3xl text-white" style={{ animation: "fadeSlideUp 0.9s ease-out forwards" }}>

                        {/* Premium badge */}
                        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md shadow-lg shadow-primary/10">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
                            </span>
                            Bangladesh&apos;s #1 Premium Real Estate Platform
                        </div>

                        {/* Main heading */}
                        <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                            Find Your{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent" style={{ backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }}>
                                    Dream
                                </span>
                            </span>
                            <br />
                            <span className="text-white/95">Home Today</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed">
                            Discover thousands of verified apartments, villas, and premium properties across Bangladesh. Handpicked for your lifestyle.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Link href="/property">
                                <Button size="lg" className="group h-14 gap-2 px-8 text-base shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50">
                                    <Search className="h-5 w-5" />
                                    Browse Properties
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/property?listingType=RENT">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 gap-2 border-white/25 bg-white/8 px-8 text-base text-white backdrop-blur-md transition-all duration-300 hover:bg-white/18 hover:scale-105 hover:border-white/40"
                                >
                                    View Rentals
                                </Button>
                            </Link>
                        </div>

                        {/* Trust signals */}
                        <div className="mt-14 flex flex-wrap gap-6 border-t border-white/15 pt-8">
                            {["1,200+ Listings", "45+ Cities", "350+ Agents", "8,500+ Happy Clients"].map((s) => (
                                <div key={s} className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40">
                    <div className="h-12 w-6 rounded-full border border-white/20 flex items-start justify-center p-1">
                        <div className="h-2 w-1 rounded-full bg-white/60" style={{ animation: "scrollPulse 2s ease-in-out infinite" }} />
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes zoom-in-out { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
                    @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                    @keyframes scrollPulse { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(6px); opacity: 0.4; } }
                `}} />
            </section>

            {/* ─── STATS BAR ────────────────────────────────────────────── */}
            <section className="relative py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/90" />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 25% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(var(--primary)) 0%, transparent 50%)`
                }} />
                <div className="relative mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="relative">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                        <s.icon className="h-6 w-6" />
                                    </div>
                                    <p className="font-display text-4xl font-bold text-white">{s.value}</p>
                                    <p className="mt-1 text-sm font-medium text-white/60">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURED PROPERTIES ──────────────────────────────────── */}
            <section className="relative py-20 px-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                New Listings
                            </div>
                            <h2 className="mt-3 font-display text-4xl font-bold">Featured Properties</h2>
                            <p className="mt-2 text-muted-foreground">Handpicked listings from across Bangladesh</p>
                        </div>
                        <Link href="/property" className="group hidden items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary sm:flex">
                            View all listings
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {featuredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                <Building2 className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <p className="mt-4 font-medium text-muted-foreground">No properties available right now.</p>
                            <p className="mt-1 text-sm text-muted-foreground/60">Check back soon for fresh listings.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── CATEGORIES ───────────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/30 to-background" />
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
                <div className="relative mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Explore
                        </div>
                        <h2 className="mt-3 font-display text-4xl font-bold">Browse by Category</h2>
                        <p className="mt-2 text-muted-foreground">Find exactly what you&apos;re looking for</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                href="/property"
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                                <div className="relative">
                                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} transition-transform duration-300 group-hover:scale-110`}>
                                        <cat.icon className={`h-7 w-7 ${cat.iconColor}`} />
                                    </div>
                                    <p className="font-semibold text-sm">{cat.name}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{cat.count}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="mx-auto max-w-7xl">
                    <div className="mb-14 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Simple Process
                        </div>
                        <h2 className="mt-3 font-display text-4xl font-bold">How It Works</h2>
                        <p className="mt-2 text-muted-foreground">Get from search to keys in 3 easy steps</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {steps.map((step, i) => (
                            <div key={step.step} className="relative">
                                {i < steps.length - 1 && (
                                    <div className="absolute left-[calc(50%+4rem)] top-10 hidden h-px w-[calc(100%-8rem)] bg-gradient-to-r from-primary/40 to-border md:block" />
                                )}
                                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="relative">
                                        <div className="mb-6 flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-black text-primary font-display">
                                                {step.step}
                                            </div>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                                <step.icon className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <h3 className="font-display text-xl font-bold">{step.title}</h3>
                                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── WHY CHOOSE US ────────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary to-secondary/90" />
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
                <div className="absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/3 -right-20 h-64 w-64 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
                <div className="relative mx-auto max-w-7xl">
                    <div className="mb-14 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Our Advantage
                        </div>
                        <h2 className="mt-3 font-display text-4xl font-bold text-white">Why Choose Regency Gardens?</h2>
                        <p className="mt-2 text-white/50">Built to make your property journey effortless and trustworthy</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg`}>
                                        <f.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
                                    <p className="mt-3 text-sm text-white/55 leading-relaxed">{f.desc}</p>
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
                <div className="relative mx-auto max-w-7xl">
                    <div className="mb-14 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Reviews
                        </div>
                        <h2 className="mt-3 font-display text-4xl font-bold">What Our Clients Say</h2>
                        <p className="mt-2 text-muted-foreground">Trusted by thousands of buyers, sellers, and renters</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {testimonials.map((t) => (
                            <div
                                key={t.name}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="relative">
                                    <Quote className="mb-4 h-10 w-10 text-primary/20" />
                                    <div className="flex gap-1">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white shadow-md`}>
                                            {t.initial}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${t.color} opacity-0 transition-opacity group-hover:opacity-60`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── BLOG TEASER ──────────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/20 to-background" />
                <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="relative mx-auto max-w-7xl">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Insights
                            </div>
                            <h2 className="mt-3 font-display text-4xl font-bold">From Our Blog</h2>
                            <p className="mt-2 text-muted-foreground">Expert advice and market intelligence</p>
                        </div>
                        <Link href="/blog" className="group hidden items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary sm:flex">
                            All articles
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {blogPosts.map((post) => (
                            <Link
                                key={post.title}
                                href="/blog"
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className={`h-1.5 w-full bg-gradient-to-r ${post.accent}`} />
                                <div className="relative p-7">
                                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                        {post.category}
                                    </span>
                                    <h3 className="mt-4 font-display text-base font-bold leading-snug transition-colors group-hover:text-primary">
                                        {post.title}
                                    </h3>
                                    <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span>{post.date}</span>
                                            <span>·</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── NEWSLETTER / CTA ─────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90" />
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                <div className="relative mx-auto max-w-2xl text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-2xl shadow-primary/30">
                        <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-display text-4xl font-bold text-white">Stay Ahead of the Market</h2>
                    <p className="mt-4 text-white/55 leading-relaxed">
                        Get the latest property listings, market insights, and investment tips delivered to your inbox every week.
                    </p>
                    <form className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 rounded-xl border border-white/15 bg-white/8 px-5 py-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm sm:max-w-xs transition-all"
                        />
                        <Button type="submit" className="shrink-0 rounded-xl px-7 h-auto py-3.5 shadow-lg shadow-primary/20">
                            Subscribe Free
                        </Button>
                    </form>
                    <p className="mt-4 text-xs text-white/35">No spam. Unsubscribe anytime. Join 8,500+ subscribers.</p>
                </div>
            </section>

            {/* ─── FINAL CTA ────────────────────────────────────────────── */}
            <section className="relative py-24 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="relative mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Get Started Today
                    </div>
                    <h2 className="font-display text-4xl font-bold sm:text-5xl leading-tight">
                        Ready to Find Your<br />
                        <span className="bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent" style={{ backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }}>
                            Dream Property?
                        </span>
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
                        Join thousands of satisfied clients who found their perfect home through Regency Gardens.
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/property">
                            <Button size="lg" className="group h-14 gap-2 px-10 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                                <Search className="h-5 w-5" />
                                Start Searching
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="lg" variant="outline" className="h-14 gap-2 px-10 text-base transition-all hover:scale-105 hover:border-primary hover:bg-primary/5">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                        {[
                            { icon: Shield, text: "Verified Properties" },
                            { icon: Award, text: "Licensed Agents" },
                            { icon: Clock, text: "24/7 Support" },
                        ].map((badge) => (
                            <div key={badge.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <badge.icon className="h-4 w-4 text-primary" />
                                {badge.text}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}

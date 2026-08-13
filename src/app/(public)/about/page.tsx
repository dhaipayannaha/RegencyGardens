import { Shield, Users, Building2, TrendingUp, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "About Us | Regency Gardens",
    description: "Learn about Regency Gardens — Bangladesh's trusted real estate platform connecting buyers, renters, and agents.",
};

const team = [
    { name: "Rashid Karim", role: "CEO & Founder", initials: "RK", bio: "15+ years in Bangladesh real estate market. Former property developer turned platform builder." },
    { name: "Nadia Islam", role: "Head of Operations", initials: "NI", bio: "Operations expert with a background in PropTech. Oversees agent onboarding and property verification." },
    { name: "Tanvir Hossain", role: "Lead Engineer", initials: "TH", bio: "Full-stack engineer specializing in scalable real estate platforms and map integrations." },
    { name: "Fahmida Akter", role: "Customer Success", initials: "FA", bio: "Dedicated to ensuring every buyer, seller, and renter has an exceptional experience." },
];

const milestones = [
    { year: "2019", event: "Founded in Dhaka with 50 listings" },
    { year: "2021", event: "Expanded to 10 cities, 5,000 listings" },
    { year: "2023", event: "Launched agent portal and review system" },
    { year: "2026", event: "1,200+ properties, 8,500+ satisfied clients" },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col">

            {/* Hero */}
            <section className="bg-secondary py-20 px-4 text-center text-secondary-foreground">
                <p className="text-sm font-medium uppercase tracking-widest text-primary">About Us</p>
                <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Building Trust in<br />Bangladesh Real Estate</h1>
                <p className="mx-auto mt-5 max-w-2xl text-lg text-secondary-foreground/70">
                    Regency Gardens was founded to bring transparency, trust, and technology to the Bangladesh property market. We connect buyers, renters, and agents on a single verified platform.
                </p>
            </section>

            {/* Stats */}
            <section className="border-y border-border bg-card py-12 px-4">
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
                    {[
                        { value: "1,200+", label: "Properties Listed", icon: Building2 },
                        { value: "8,500+", label: "Happy Clients", icon: Users },
                        { value: "350+", label: "Verified Agents", icon: Shield },
                        { value: "45+", label: "Cities Covered", icon: MapPin },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <s.icon className="mx-auto h-7 w-7 text-primary" />
                            <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-4">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-widest text-primary">Our Mission</p>
                            <h2 className="mt-2 font-display text-3xl font-bold">Transparent, Accessible Real Estate for Everyone</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                We believe finding a home or investment property should be straightforward, not stressful. Every listing on our platform is verified by our team. Every agent is licensed and background-checked. And every transaction is supported by our customer success team from inquiry to keys.
                            </p>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Our technology makes it easy to search by city, filter by your needs, and connect directly with the agent — no middlemen, no hidden fees.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Shield, title: "Verified Properties", desc: "Manual review of every listing before it goes live." },
                                { icon: Users, title: "Licensed Agents", desc: "All agents are screened and certified." },
                                { icon: TrendingUp, title: "Market Insights", desc: "Real data to help you make smart decisions." },
                                { icon: Building2, title: "All Categories", desc: "Apartments, villas, offices, land — all in one place." },
                            ].map((f) => (
                                <div key={f.title} className="rounded-xl border border-border bg-card p-4">
                                    <f.icon className="h-6 w-6 text-primary" />
                                    <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Milestones */}
            <section className="bg-muted/40 py-16 px-4">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-10 text-center font-display text-3xl font-bold">Our Journey</h2>
                    <div className="relative border-l-2 border-primary/20 pl-8 space-y-8">
                        {milestones.map((m) => (
                            <div key={m.year} className="relative">
                                <div className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    {m.year.slice(2)}
                                </div>
                                <p className="text-sm font-semibold text-primary">{m.year}</p>
                                <p className="mt-1 text-muted-foreground">{m.event}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 px-4">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-10 text-center font-display text-3xl font-bold">Meet Our Team</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {team.map((member) => (
                            <div key={member.name} className="rounded-xl border border-border bg-card p-6 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                                    {member.initials}
                                </div>
                                <h3 className="mt-4 font-semibold">{member.name}</h3>
                                <p className="text-sm font-medium text-primary">{member.role}</p>
                                <p className="mt-2 text-xs text-muted-foreground">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-secondary py-14 px-4 text-center text-secondary-foreground">
                <h2 className="font-display text-3xl font-bold">Join Our Growing Community</h2>
                <p className="mt-3 text-secondary-foreground/70">Thousands of families trust us. Be the next success story.</p>
                <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link href="/property"><Button size="lg" className="px-8">Browse Properties</Button></Link>
                    <Link href="/contact"><Button size="lg" variant="outline" className="border-secondary-foreground/20 px-8 text-secondary-foreground hover:bg-secondary-foreground/10">Contact Us</Button></Link>
                </div>
            </section>

        </div>
    );
}

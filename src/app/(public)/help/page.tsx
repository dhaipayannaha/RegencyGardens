export const metadata = { title: "Help & Support | Regency Gardens", description: "Get help and support from the Regency Gardens team." };

const faqs = [
    { q: "How do I search for properties?", a: "Use the search bar on the Properties page to filter by city. You can also use the advanced filters (bedroom count, price range, listing type) to narrow results." },
    { q: "Is it free to browse listings?", a: "Yes! Browsing and searching properties is completely free. You only need an account to save favorites or send inquiries." },
    { q: "How do I contact an agent?", a: "On any property detail page, you will find the agent's contact card. Fill in the inquiry form and the agent will respond within 24 hours." },
    { q: "How do I list a property?", a: "Register as an Agent, then navigate to your dashboard and click 'New Listing'. Fill in all property details and submit for review." },
    { q: "How do I save a property to favorites?", a: "Log in to your account, then click the heart icon on any property card or detail page. View all favorites in your dashboard." },
    { q: "What payment methods are accepted?", a: "Regency Gardens is a listing platform. Payment and negotiations happen directly between buyer/renter and agent. We do not process payments." },
];

export default function HelpPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16">
            <h1 className="font-display text-4xl font-bold">Help & Support</h1>
            <p className="mt-3 text-muted-foreground">Find answers to common questions below. Need more help? <a href="/contact" className="text-primary hover:underline">Contact us</a>.</p>
            <div className="mt-10 space-y-5">
                {faqs.map((faq) => (
                    <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                        <h2 className="font-semibold">{faq.q}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const metadata = { title: "Privacy Policy | Regency Gardens", description: "Regency Gardens privacy policy — how we collect, use, and protect your data." };

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16">
            <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>
            <div className="prose prose-sm dark:prose-invert mt-10 max-w-none space-y-6 text-muted-foreground">
                {[
                    { title: "1. Information We Collect", body: "We collect information you provide directly (name, email, phone, property details) and information collected automatically when you use our platform (usage data, device info, cookies)." },
                    { title: "2. How We Use Your Information", body: "We use your data to operate and improve our platform, communicate with you about listings and inquiries, send service updates, and ensure platform security." },
                    { title: "3. Sharing of Information", body: "We do not sell your personal data. We may share your information with verified agents when you submit an inquiry, and with service providers who help operate our platform." },
                    { title: "4. Cookies", body: "We use cookies to keep you logged in, remember your preferences, and analyze usage patterns. You can disable cookies in your browser settings, though some features may not function correctly." },
                    { title: "5. Data Security", body: "We use industry-standard security measures including HTTPS encryption and httpOnly cookie storage for authentication tokens to protect your data." },
                    { title: "6. Your Rights", body: "You have the right to access, correct, or delete your personal data. Contact us at hello@regencygardens.com to make a request." },
                    { title: "7. Contact", body: "For privacy concerns, contact our Data Protection team at privacy@regencygardens.com or write to us at Gulshan-1, Dhaka-1212, Bangladesh." },
                ].map((section) => (
                    <div key={section.title}>
                        <h2 className="font-display text-lg font-semibold text-foreground">{section.title}</h2>
                        <p className="mt-2">{section.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

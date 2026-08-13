export const metadata = { title: "Terms of Service | Regency Gardens", description: "Regency Gardens terms of service — rules and guidelines for using our platform." };

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16">
            <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>
            <div className="mt-10 max-w-none space-y-6 text-muted-foreground">
                {[
                    { title: "1. Acceptance of Terms", body: "By accessing or using Regency Gardens, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform." },
                    { title: "2. Platform Role", body: "Regency Gardens is a property listing and search platform. We connect buyers, renters, and agents. We are not a party to any transaction between users and do not process payments." },
                    { title: "3. User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately if you suspect unauthorized access to your account." },
                    { title: "4. Listing Accuracy", body: "Agents and property owners are solely responsible for the accuracy of their listings. Regency Gardens reviews listings but cannot guarantee absolute accuracy of all information." },
                    { title: "5. Prohibited Use", body: "You may not use our platform for fraudulent listings, harassment, spam, scraping, or any activity that violates applicable laws or regulations." },
                    { title: "6. Intellectual Property", body: "All content, design, and code on this platform is owned by Regency Gardens. You may not reproduce or redistribute any part without written permission." },
                    { title: "7. Termination", body: "We reserve the right to suspend or terminate accounts that violate these terms without prior notice." },
                    { title: "8. Governing Law", body: "These terms are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh." },
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

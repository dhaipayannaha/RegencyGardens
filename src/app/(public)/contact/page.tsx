"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email address"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ContactValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", subject: "", message: "" },
    });

    async function onSubmit(values: ContactValues) {
        setServerError(null);
        setIsLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 1000));
            setSuccess(true);
            form.reset();
        } catch {
            setServerError("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-secondary py-16 px-4 text-center text-secondary-foreground">
                <p className="text-sm font-medium uppercase tracking-widest text-primary">Get In Touch</p>
                <h1 className="mt-3 font-display text-4xl font-bold">We&apos;d Love to Hear From You</h1>
                <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
                    Whether you have a question about listings, want to partner as an agent, or just need support — we&apos;re here to help.
                </p>
            </section>

            {/* Contact Grid */}
            <section className="py-16 px-4">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-5">

                    {/* Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="font-display text-2xl font-bold">Contact Information</h2>
                            <p className="mt-2 text-muted-foreground">Our team is available during business hours to assist you.</p>
                        </div>

                        {[
                            { icon: MapPin, title: "Head Office", detail: "Gulshan-1, Dhaka-1212, Bangladesh" },
                            { icon: Phone, title: "Phone", detail: "+880 1700-000000" },
                            { icon: Mail, title: "Email", detail: "hello@regencygardens.com" },
                            { icon: Clock, title: "Working Hours", detail: "Sun–Thu: 9:00 AM – 6:00 PM" },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="rounded-xl border border-border bg-card p-8 lg:col-span-3">
                        <h2 className="mb-6 font-display text-xl font-bold">Send Us a Message</h2>

                        {success ? (
                            <div className="flex flex-col items-center gap-4 py-10 text-center">
                                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                                <h3 className="font-semibold text-lg">Message Sent!</h3>
                                <p className="text-sm text-muted-foreground">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                                <Button variant="outline" onClick={() => setSuccess(false)}>Send Another</Button>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Full Name</FormLabel>
                                                <FormControl><Input id="contact-name" placeholder="Your full name" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email Address</FormLabel>
                                                <FormControl><Input id="contact-email" type="email" placeholder="you@example.com" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="subject" render={({ field }) => (
                                        <FormItem><FormLabel>Subject</FormLabel>
                                            <FormControl><Input id="contact-subject" placeholder="What is this about?" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="message" render={({ field }) => (
                                        <FormItem><FormLabel>Message</FormLabel>
                                            <FormControl><Textarea id="contact-message" rows={5} placeholder="Write your message here..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {serverError && <p className="rounded bg-destructive/10 p-3 text-sm text-destructive">{serverError}</p>}

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Message
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { sendInquiry } from "@/services/inquiry.service";

const inquirySchema = z.object({
    message: z.string().min(10, "Message must be at least 10 characters"),
    phone: z.string().optional(),
});

type InquiryValues = z.infer<typeof inquirySchema>;

export function InquiryForm({ propertyId, agentName }: { propertyId: string; agentName: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<InquiryValues>({
        resolver: zodResolver(inquirySchema),
        defaultValues: { message: `Hi ${agentName}, I'm interested in this property. Could you share more details?`, phone: "" },
    });

    async function onSubmit(values: InquiryValues) {
        setIsLoading(true);
        setError(null);
        try {
            await sendInquiry({ propertyId, ...values });
            setSuccess(true);
            form.reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send inquiry.");
        } finally {
            setIsLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <p className="font-medium">Inquiry sent</p>
                <p className="text-sm text-muted-foreground">The agent will get back to you shortly.</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="message">Message</FormLabel>
                            <FormControl>
                                <Textarea id="message" rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="phone">Phone (optional)</FormLabel>
                            <FormControl>
                                <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Inquiry
                </Button>
            </form>
        </Form>
    );
}
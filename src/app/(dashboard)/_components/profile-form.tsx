"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Camera, Save, Lock, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const profileSchema = z.object({
    name:  z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
    bio:   z.string().max(300, "Bio must be under 300 characters").optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Enter your current password"),
    newPassword:     z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ProfileValues  = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

interface ProfileFormProps {
    user: { name: string; email: string; phone?: string; role?: string };
    extraField?: React.ReactNode;
}

export function DashboardProfileForm({ user, extraField }: ProfileFormProps) {
    const [profileSaved, setProfileSaved] = useState(false);
    const [pwSaved, setPwSaved]           = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [pwLoading, setPwLoading]           = useState(false);

    const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const profileForm = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user.name, email: user.email, phone: user.phone ?? "", bio: "" },
    });

    const pwForm = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

    async function onProfileSubmit(values: ProfileValues) {
        setProfileLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setProfileLoading(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    }

    async function onPasswordSubmit(values: PasswordValues) {
        setPwLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setPwLoading(false);
        setPwSaved(true);
        pwForm.reset();
        setTimeout(() => setPwSaved(false), 3000);
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Avatar Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-2xl font-bold shadow-md">
                            {initials}
                        </div>
                        <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-all hover:scale-110">
                            <Camera className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div>
                        <p className="text-xl font-bold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.role && (
                            <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                {user.role}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-5 flex items-center gap-2 font-semibold">
                    <Shield className="h-4 w-4 text-primary" /> Personal Information
                </h2>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField control={profileForm.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={profileForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={profileForm.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input placeholder="+880 17XX XXXXXX" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={profileForm.control} name="bio" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                                <FormControl>
                                    <textarea
                                        {...field}
                                        rows={3}
                                        placeholder="Tell us a bit about yourself…"
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {extraField}

                        {profileSaved && (
                            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                ✓ Profile updated successfully!
                            </p>
                        )}
                        <Button type="submit" disabled={profileLoading} className="gap-2">
                            {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-5 flex items-center gap-2 font-semibold">
                    <Lock className="h-4 w-4 text-primary" /> Change Password
                </h2>
                <Form {...pwForm}>
                    <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField control={pwForm.control} name="currentPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField control={pwForm.control} name="newPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="Min. 8 characters" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={pwForm.control} name="confirmPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="Repeat new password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        {pwSaved && (
                            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                ✓ Password changed successfully!
                            </p>
                        )}
                        <Button type="submit" variant="outline" disabled={pwLoading} className="gap-2">
                            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                            Update Password
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-5 flex items-center gap-2 font-semibold">
                    <Bell className="h-4 w-4 text-primary" /> Notification Preferences
                </h2>
                <div className="space-y-3">
                    {[
                        { label: "Email notifications for new inquiries",   id: "notif-inquiry" },
                        { label: "Email on property status updates",        id: "notif-status" },
                        { label: "Weekly market digest",                    id: "notif-digest" },
                        { label: "Promotional emails & offers",             id: "notif-promo" },
                    ].map((n) => (
                        <label key={n.id} htmlFor={n.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/40">
                            <span className="text-sm font-medium">{n.label}</span>
                            <input id={n.id} type="checkbox" defaultChecked={n.id !== "notif-promo"}
                                className="h-4 w-4 rounded border-border accent-primary cursor-pointer" />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

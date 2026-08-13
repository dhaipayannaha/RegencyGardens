"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string().min(6, "Required"),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

interface UserProfileFormProps {
    user: { name: string; email: string };
}

export function UserProfileForm({ user }: UserProfileFormProps) {
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const profileForm = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user.name, email: user.email, phone: "" },
    });

    const passwordForm = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

    async function onProfileSubmit(values: ProfileValues) {
        setProfileError(null);
        setProfileSuccess(false);
        setProfileLoading(true);
        try {
            // TODO: call PATCH /api/v1/auth/me or profile endpoint
            await new Promise((r) => setTimeout(r, 800));
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (e) {
            setProfileError(e instanceof Error ? e.message : "Failed to update profile.");
        } finally {
            setProfileLoading(false);
        }
    }

    async function onPasswordSubmit(values: PasswordValues) {
        setPasswordError(null);
        setPasswordSuccess(false);
        setPasswordLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            setPasswordSuccess(true);
            passwordForm.reset();
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (e) {
            setPasswordError(e instanceof Error ? e.message : "Failed to update password.");
        } finally {
            setPasswordLoading(false);
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Info */}
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Personal Information</h2>
                        <p className="text-sm text-muted-foreground">Update your name, email, and phone</p>
                    </div>
                </div>

                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField control={profileForm.control} name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input id="profile-name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={profileForm.control} name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input id="profile-email" type="email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={profileForm.control} name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone (optional)</FormLabel>
                                    <FormControl><Input id="profile-phone" type="tel" placeholder="+880..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {profileError && <p className="rounded bg-destructive/10 p-2 text-sm text-destructive">{profileError}</p>}
                        {profileSuccess && (
                            <p className="flex items-center gap-2 rounded bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={profileLoading}>
                            {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Change Password */}
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-5">
                    <h2 className="font-semibold">Change Password</h2>
                    <p className="text-sm text-muted-foreground">Keep your account secure</p>
                </div>

                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField control={passwordForm.control} name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl><Input id="current-password" type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={passwordForm.control} name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl><Input id="new-password" type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={passwordForm.control} name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl><Input id="confirm-password" type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {passwordError && <p className="rounded bg-destructive/10 p-2 text-sm text-destructive">{passwordError}</p>}
                        {passwordSuccess && (
                            <p className="flex items-center gap-2 rounded bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" /> Password changed successfully!
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={passwordLoading}>
                            {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

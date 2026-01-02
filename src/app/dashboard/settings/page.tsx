import { User, CreditCard, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get the base checkout URL from your .env.local
    const checkoutBaseUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL || '#';

    // 2. Append the user_id as a custom parameter for the webhook logic
    // This ensures Lemon Squeezy passes the ID back to us after payment
    const checkoutUrl = user
        ? `${checkoutBaseUrl}?checkout[custom][user_id]=${user.id}`
        : '#';

    return (
        <div className="p-6 lg:p-12 max-w-4xl mx-auto space-y-12">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Settings</h1>
                <p className="text-zinc-500 mt-2">Manage your account and preferences for DeepWork by Tenz.</p>
            </header>

            <div className="space-y-10">
                {/* Account Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <User size={16} className="text-indigo-500" /> Account Details
                    </h2>
                    <div className="bg-zinc-900/50 rounded-[2rem] border border-zinc-800 p-8 space-y-6">
                        <div className="flex justify-between items-center pb-6 border-b border-zinc-800/50">
                            <div>
                                <p className="text-sm font-medium text-zinc-300">Email Address</p>
                                <p className="text-lg font-mono text-white">{user?.email}</p>
                            </div>
                            <button type="button" className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-xl transition">
                                Change
                            </button>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <div>
                                <p className="text-sm font-medium text-zinc-300">Account Security</p>
                                <p className="text-xs text-zinc-500 mt-1">Update your password or manage 2FA settings.</p>
                            </div>
                            <ChevronRight size={20} className="text-zinc-700" />
                        </div>
                    </div>
                </section>

                {/* Subscription Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={16} className="text-indigo-500" /> Billing
                    </h2>
                    <div className="bg-gradient-to-br from-indigo-600/20 to-zinc-900 rounded-[2rem] border border-indigo-500/20 p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-white italic underline decoration-indigo-500 underline-offset-4">Current Plan: <span className="text-indigo-400 not-italic font-bold">Free</span></p>
                                </div>
                                <p className="text-xs text-zinc-400 max-w-sm">
                                    Unlock global access. Upgrade to Pro for unlimited soundscapes, full analytics history, and custom focus intervals.
                                </p>
                            </div>

                            {/* Updated Go Pro Button: Now a Link to Lemon Squeezy */}
                            <Link
                                href={checkoutUrl}
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/10 active:scale-95 whitespace-nowrap"
                            >
                                <Sparkles size={16} className="text-indigo-600" />
                                Upgrade to Pro
                            </Link>
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
                        Secure Global Checkout powered by Lemon Squeezy
                    </p>
                </section>

                {/* Sign Out Section */}
                <section className="pt-8 border-t border-zinc-900">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 text-red-500 hover:text-red-400 font-medium transition group"
                        >
                            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition">
                                <LogOut size={20} />
                            </div>
                            Sign Out
                        </button>
                    </form>
                    <p className="text-[10px] text-zinc-600 mt-6 uppercase tracking-widest text-center">
                        DeepWork by Tenz — Version 1.0.0
                    </p>
                </section>
            </div>
        </div>
    );
}
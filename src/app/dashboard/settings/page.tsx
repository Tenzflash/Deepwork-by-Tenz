import { User, CreditCard, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

// Next.js 16 requires props to be handled as Promises if they are dynamic
export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get the base checkout URL from your .env.local
    const checkoutBaseUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL || '#';

    // 2. Construct the URL with user ID
    const checkoutUrl = user
        ? `${checkoutBaseUrl}?checkout[custom][user_id]=${user.id}`
        : '#';

    return (
        <div className="p-6 lg:p-12 max-w-4xl mx-auto space-y-12">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Settings</h1>
                <p className="text-zinc-500 mt-2">Manage your account and preferences for DeepWork.</p>
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
                                <p className="text-lg font-mono text-white">{user?.email || 'Not logged in'}</p>
                            </div>
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
                                <p className="text-sm font-medium text-white mb-1">Current Plan: <span className="text-indigo-400 font-bold">Free</span></p>
                                <p className="text-xs text-zinc-400 max-w-sm">
                                    Upgrade to Pro for unlimited soundscapes and advanced analytics.
                                </p>
                            </div>

                            <Link
                                href={checkoutUrl}
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl text-sm font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
                            >
                                <Sparkles size={16} className="text-indigo-600" />
                                Upgrade to Pro
                            </Link>
                        </div>
                    </div>
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
                </section>
            </div>
        </div>
    );
}
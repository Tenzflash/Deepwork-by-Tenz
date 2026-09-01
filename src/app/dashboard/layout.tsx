'use client';

import { Clock, Zap, BarChart3, Settings, Trophy, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';

const NAV = [
    { icon: Clock, label: 'Today', href: '/dashboard' },
    { icon: Zap, label: 'Soundscapes', href: '/dashboard/soundscapes' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Trophy, label: 'Achievements', href: '/dashboard/achievements' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-ink-950 text-ink-100">
            {/* Sidebar — desktop */}
            <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-ink-800 p-6 lg:flex">
                <Link href="/dashboard" className="mb-10 flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-focus-500 font-bold text-white">
                        D
                    </div>
                    <div className="leading-tight">
                        <div className="text-lg font-semibold tracking-tight">DeepWork</div>
                        <div className="text-xs text-ink-400">by Tenz</div>
                    </div>
                </Link>

                <nav className="flex-1 space-y-1">
                    {NAV.map(({ icon: Icon, label, href }) => (
                        <NavItem
                            key={href}
                            icon={<Icon size={19} />}
                            label={label}
                            href={href}
                            active={pathname === href}
                        />
                    ))}
                </nav>

                <div className="space-y-1 border-t border-ink-800 pt-6">
                    <NavItem
                        icon={<Settings size={19} />}
                        label="Settings"
                        href="/dashboard/settings"
                        active={pathname === '/dashboard/settings'}
                    />
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-ink-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                            <LogOut size={19} />
                            <span>Sign out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top bar — mobile only. Without this there was no way to reach
                    Analytics, Settings or Sign out on a phone at all. */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-800 bg-ink-950/85 px-4 py-3 backdrop-blur lg:hidden">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-focus-500 text-sm font-bold text-white">
                            D
                        </div>
                        <span className="font-semibold tracking-tight">DeepWork</span>
                    </Link>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="rounded-lg p-2 text-ink-400 transition-colors hover:text-red-400"
                            aria-label="Sign out"
                        >
                            <LogOut size={19} />
                        </button>
                    </form>
                </header>

                <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">{children}</main>

                {/* Bottom tab bar — mobile only */}
                <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-ink-800 bg-ink-950/95 backdrop-blur lg:hidden">
                    {[...NAV, { icon: Settings, label: 'Settings', href: '/dashboard/settings' }].map(
                        ({ icon: Icon, label, href }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] transition-colors ${
                                        active ? 'text-focus-400' : 'text-ink-400'
                                    }`}
                                >
                                    <Icon size={19} />
                                    {label}
                                </Link>
                            );
                        }
                    )}
                </nav>
            </div>
        </div>
    );
}

function NavItem({
    icon,
    label,
    href,
    active,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                active
                    ? 'bg-focus-500/10 text-ink-100'
                    : 'text-ink-400 hover:bg-ink-900 hover:text-ink-200'
            }`}
        >
            {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-focus-500" />
            )}
            {icon}
            <span>{label}</span>
        </Link>
    );
}

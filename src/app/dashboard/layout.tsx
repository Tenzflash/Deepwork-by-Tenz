import { Clock, Zap, BarChart3, Settings, Trophy, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/lib/actions/auth';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            {/* Shared Sidebar */}
            <aside className="w-64 border-r border-zinc-800 p-6 hidden lg:flex flex-col h-screen sticky top-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">D</div>
                    <span className="text-xl font-bold tracking-tight">DeepWork</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-semibold mt-1 leading-none">
      by Tenz
    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<Clock size={20} />} label="Focus Timer" href="/dashboard" />
                    <NavItem icon={<Zap size={20} />} label="Soundscapes" href="/dashboard/soundscapes" />
                    <NavItem icon={<BarChart3 size={20} />} label="Analytics" href="/dashboard/analytics" />
                    <NavItem icon={<Trophy size={20} />} label="Achievements" href="/dashboard/achievements" />
                </nav>

                <div className="pt-6 border-t border-zinc-800 space-y-2">
                    <NavItem icon={<Settings size={20} />} label="Settings" href="/dashboard/settings" />
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area - This is where the specific page content loads */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900">
            {icon}
            <span>{label}</span>
        </Link>
    );
}

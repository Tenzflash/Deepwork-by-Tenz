import Timer from '@/components/timer/Timer';
import ProgressChart from '@/components/dashboard/ProgressChart';
import SoundBoard from '@/components/sounds/SoundBoard';
import TaskJournal from '@/components/dashboard/TaskJournal';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Next.js 15.1.11 uses a Promise for searchParams
type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
    // 1. Initialize Supabase safely
    const supabase = await createClient();

    // 2. Fetch User and check session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If no user or auth error, redirect to login
    if (authError || !user) {
        redirect('/login');
    }

    // 3. Parallel Data Fetching (Fastest performance for Next.js 15)
    const [profileRes, tasksRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('is_pro').eq('id', user.id).single(),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('focus_sessions')
            .select('duration_minutes, created_at')
            .eq('mode', 'focus')
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const isPro = profileRes.data?.is_pro ?? false;
    const tasks = tasksRes.data ?? [];
    const sessions = sessionsRes.data ?? [];

    // 4. Progress Calculations
    const todayStr = new Date().toISOString().split('T')[0];
    const totalMinsToday = sessions
        .filter(s => s.created_at.startsWith(todayStr))
        .reduce((acc, curr) => acc + curr.duration_minutes, 0);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateString = date.toISOString().split('T')[0];
        return {
            day: days[date.getDay()],
            mins: sessions
                .filter(s => s.created_at.startsWith(dateString))
                .reduce((acc, curr) => acc + curr.duration_minutes, 0)
        };
    });

    return (
        <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        Focus Journal 
                        {isPro && (
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold uppercase">
                                Pro
                            </span>
                        )}
                    </h1>
                    <p className="text-zinc-500 text-sm">Eliminate the shallow. Focus on the deep.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-1">Daily Target</p>
                    <p className="text-xl font-mono text-white leading-none">
                        {totalMinsToday}
                        <span className="text-zinc-600 text-sm ml-1">/ 300m</span>
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT: Stats & Analytics */}
                <div className="lg:col-span-3 space-y-6 order-3 lg:order-1">
                    <ProgressChart data={chartData} />
                    <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800/50">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Focus Insight</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                            "Deep work is the superpower of the 21st century."
                        </p>
                    </div>
                </div>

                {/* CENTER: The Task Journal */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                    <TaskJournal initialTasks={tasks} />
                </div>

                {/* RIGHT: Timer & Audio */}
                <div className="lg:col-span-3 space-y-6 order-2 lg:order-3">
                    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex flex-col items-center shadow-lg">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 text-center w-full">Focus Timer</h3>
                        <Timer />
                    </div>
                    <SoundBoard isPro={isPro} />
                </div>
            </div>
        </div>
    );
}
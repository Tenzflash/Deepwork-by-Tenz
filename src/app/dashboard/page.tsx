import Timer from '@/components/timer/Timer';
import ProgressChart from '@/components/dashboard/ProgressChart';
import SoundBoard from '@/components/sounds/SoundBoard';
import TaskJournal from '@/components/dashboard/TaskJournal';
import { createClient } from '@/lib/supabase/server';

// Note the updated type for Next.js 16/React 19
export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Fetch User and Pro Status
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null; // Middleware handles redirection
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user?.id)
        .single();

    const isPro = profile?.is_pro || false;

    // 2. Fetch Tasks
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    // 3. Fetch Sessions for Charting & Today's Total
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const { data: sessions } = await supabase
        .from('focus_sessions')
        .select('duration_minutes, created_at')
        .eq('mode', 'focus')
        .gte('created_at', sevenDaysAgo.toISOString());

    const todayStr = new Date().toISOString().split('T')[0];
    const totalMinsToday = sessions?.filter(s => s.created_at.startsWith(todayStr))
        .reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0;

    // 4. Map Chart Data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateString = date.toISOString().split('T')[0];
        return {
            day: days[date.getDay()],
            mins: sessions?.filter(s => s.created_at.startsWith(dateString))
                .reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0
        };
    });

    return (
        <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        My Journal {isPro && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">PRO</span>}
                    </h1>
                    <p className="text-zinc-500 text-sm">Designate your focus, then execute.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-1">Today's Progress</p>
                    <p className="text-xl font-mono text-white leading-none">{totalMinsToday}<span className="text-zinc-600 text-sm ml-1">/ 300m</span></p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT: Stats & Analytics */}
                <div className="lg:col-span-3 space-y-6 order-3 lg:order-1">
                    <ProgressChart data={chartData} />
                    <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800/50">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Deep Work Tips</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                            "The key to deep work is not just to schedule it, but to protect it from all shallow distractions."
                        </p>
                    </div>
                </div>

                {/* CENTER: The Task Journal (FOCUS POINT) */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                    <TaskJournal initialTasks={tasks || []} />
                </div>

                {/* RIGHT: Timer & Audio */}
                <div className="lg:col-span-3 space-y-6 order-2 lg:order-3">
                    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex flex-col items-center">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 text-center w-full">Focus Engine</h3>
                        <Timer />
                    </div>
                    <SoundBoard isPro={isPro} />
                </div>
            </div>
        </div>
    );
}

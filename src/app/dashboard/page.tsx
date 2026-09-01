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

// TODO: move this onto the profiles table so people can set their own target.
// Five hours of deep work a day is a lot to show someone on day one.
const DAILY_TARGET_MINUTES = 300;

function formatHours(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    // 1. Initialize Supabase safely
    const supabase = await createClient();

    // 2. Fetch User and check session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If no user or auth error, redirect to login
    if (authError || !user) {
        redirect('/login');
    }

    // 3. Parallel Data Fetching
    const [profileRes, tasksRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('is_pro').eq('id', user.id).single(),

        supabase.from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),

        supabase.from('focus_sessions')
            .select('duration_minutes, created_at')
            .eq('user_id', user.id)
            .eq('mode', 'focus')
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const isPro = profileRes.data?.is_pro ?? false;
    const tasks = tasksRes.data ?? [];
    const sessions = sessionsRes.data ?? [];

    // 4. Progress Calculations
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.created_at.startsWith(todayStr));
    const totalMinsToday = todaySessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);

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

    // Consecutive days with focus time, counting back from today.
    let streak = 0;
    for (let i = chartData.length - 1; i >= 0; i--) {
        if (chartData[i].mins > 0) streak++;
        else break;
    }

    const weekTotal = chartData.reduce((acc, d) => acc + d.mins, 0);
    const targetPct = Math.min(100, Math.round((totalMinsToday / DAILY_TARGET_MINUTES) * 100));
    const openTasks = tasks.filter(t => !t.is_completed).length;

    const firstName =
        (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
        user.email?.split('@')[0] ??
        'there';

    return (
        <div className="mx-auto w-full max-w-7xl p-4 lg:p-8">
            <header className="dw-rise mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2.5 text-3xl font-semibold tracking-tight text-white">
                        Today
                        {isPro && (
                            <span className="rounded-full border border-focus-500/30 bg-focus-500/15 px-2.5 py-0.5 text-xs font-medium text-focus-400">
                                Pro
                            </span>
                        )}
                    </h1>
                    <p className="mt-1 text-ink-400">
                        {totalMinsToday === 0
                            ? `Nothing banked yet, ${firstName}. Start a session whenever you're ready.`
                            : `${formatHours(totalMinsToday)} of focused work so far.`}
                    </p>
                </div>

                {/* Daily target, readable and honest about the unit */}
                <div className="w-full sm:w-56">
                    <div className="mb-2 flex items-baseline justify-between text-sm">
                        <span className="text-ink-400">Daily target</span>
                        <span className="text-ink-200">
                            <span className="font-mono tabular-nums text-white">
                                {formatHours(totalMinsToday)}
                            </span>
                            <span className="text-ink-500"> / {formatHours(DAILY_TARGET_MINUTES)}</span>
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
                        <div
                            className="h-full rounded-full bg-focus-500 transition-[width] duration-700 ease-out"
                            style={{ width: `${targetPct}%` }}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* The session is the product. It gets the space. */}
                <div className="space-y-6 lg:col-span-7">
                    <section className="dw-rise dw-delay-1 rounded-3xl border border-ink-800 bg-ink-900/60 p-6 sm:p-8">
                        <Timer tasks={tasks} />
                    </section>

                    <div className="dw-rise dw-delay-3">
                        <ProgressChart data={chartData} streak={streak} weekTotal={weekTotal} />
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-5">
                    <div className="dw-rise dw-delay-2">
                        <TaskJournal initialTasks={tasks} openCount={openTasks} />
                    </div>
                    <div className="dw-rise dw-delay-4">
                        <SoundBoard isPro={isPro} />
                    </div>
                </div>
            </div>
        </div>
    );
}

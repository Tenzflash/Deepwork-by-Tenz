import ProgressChart from '@/components/dashboard/ProgressChart';
import { Calendar, TrendingUp, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // 1. Fetch Sessions for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: sessions } = await supabase
        .from('focus_sessions')
        .select('duration_minutes, created_at')
        .eq('mode', 'focus')
        .gte('created_at', sevenDaysAgo.toISOString());

    // 2. Process Data for the Chart (matching the Dashboard logic)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = days[date.getDay()];
        const dateString = date.toISOString().split('T')[0];

        const dayMins = sessions
            ?.filter(s => s.created_at.startsWith(dateString))
            .reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0;

        return { day: dayName, mins: dayMins };
    });

    // 3. Calculate Stats
    const totalMins = sessions?.reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0;

    return (
        <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-10">
            <header>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Analytics</h1>
                <p className="text-zinc-500">Detailed insights into your work habits.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pass the processed data here to prevent the 'undefined' error */}
                <div className="lg:col-span-2">
                    <ProgressChart data={chartData} />
                </div>

                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-white font-mono">{totalMins}</h3>
                    <p className="text-sm text-zinc-500 mt-1">Total minutes (Last 7 days)</p>
                </div>
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar size={20} className="text-indigo-500" /> Consistency Heatmap
                </h2>
                <div className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-[2rem] p-20 flex items-center justify-center text-zinc-600 italic">
                    Heatmap visualization for PRO users only.
                </div>
            </section>
        </div>
    );
}
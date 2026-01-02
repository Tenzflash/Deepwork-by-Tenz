import { Trophy, Medal, Star, Target, Flame } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AchievementsPage() {
    const supabase = await createClient();

    // 1. Fetch user stats for achievements
    const { data: sessions } = await supabase
        .from('focus_sessions')
        .select('duration_minutes, created_at')
        .eq('mode', 'focus');

    const totalMinutes = sessions?.reduce((acc, s) => acc + s.duration_minutes, 0) || 0;
    const sessionCount = sessions?.length || 0;

    // 2. Define Badge Logic
    const badges = [
        {
            id: 1,
            name: "First Deep Work",
            desc: "Complete your first focus session",
            icon: <Star />,
            unlocked: sessionCount >= 1
        },
        {
            id: 2,
            name: "Focus Centurion",
            desc: "Reach 100 total minutes",
            icon: <Target />,
            unlocked: totalMinutes >= 100
        },
        {
            id: 3,
            name: "Deep Work Master",
            desc: "Reach 500 total minutes",
            icon: <Trophy />,
            unlocked: totalMinutes >= 500
        },
        {
            id: 4,
            name: "Consistency King",
            desc: "Complete 10 separate sessions",
            icon: <Medal />,
            unlocked: sessionCount >= 10
        },
    ];

    return (
        <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-10">
            <header>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Achievements</h1>
                <p className="text-zinc-500">Your progress in numbers: <span className="text-indigo-400 font-mono">{totalMinutes} mins</span> across <span className="text-indigo-400 font-mono">{sessionCount} sessions</span>.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                    <div key={badge.id} className={`p-8 rounded-[2rem] border flex flex-col items-center text-center gap-4 transition-all duration-500 ${
                        badge.unlocked
                            ? 'bg-zinc-900/50 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
                            : 'bg-zinc-950 border-zinc-900 opacity-30 grayscale'
                    }`}>
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-2 ${
                            badge.unlocked ? 'bg-indigo-600 text-white rotate-3 shadow-lg' : 'bg-zinc-800 text-zinc-600'
                        }`}>
                            {badge.icon}
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg ${badge.unlocked ? 'text-white' : 'text-zinc-500'}`}>
                                {badge.name}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                {badge.desc}
                            </p>
                        </div>
                        {badge.unlocked && (
                            <div className="mt-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                Unlocked
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
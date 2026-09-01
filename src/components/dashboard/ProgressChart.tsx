'use client';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
    day: string;
    mins: number;
}

interface ProgressChartProps {
    data: ChartData[];
    /* Optional so the Analytics page can keep using <ProgressChart data={...} />
       without changes. Both fall back to values derived from `data`. */
    streak?: number;
    weekTotal?: number;
}

function formatHours(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

export default function ProgressChart({ data, streak, weekTotal }: ProgressChartProps) {
    const total = weekTotal ?? data.reduce((acc, d) => acc + d.mins, 0);

    let derivedStreak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].mins > 0) derivedStreak++;
        else break;
    }
    const runStreak = streak ?? derivedStreak;

    const hasData = total > 0;

    return (
        <div className="rounded-3xl border border-ink-800 bg-ink-900/60 p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-medium text-ink-100">Last 7 days</h3>
                    <p className="mt-0.5 text-sm text-ink-400">
                        {hasData ? `${formatHours(total)} of focus this week` : 'No sessions yet'}
                    </p>
                </div>
                {runStreak > 0 && (
                    <div className="shrink-0 rounded-xl border border-live-500/25 bg-live-500/10 px-3 py-1.5 text-sm text-live-400">
                        {runStreak} day{runStreak === 1 ? '' : 's'} in a row
                    </div>
                )}
            </div>

            {hasData ? (
                <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.45} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#7d879a', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                                contentStyle={{
                                    backgroundColor: '#141924',
                                    border: '1px solid #29313f',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    color: '#e7eaf0',
                                }}
                                labelStyle={{ color: '#a3adbf' }}
                                formatter={(value) => [formatHours(Number(value ?? 0)), 'Focused']}
                            />
                            <Bar dataKey="mins" radius={[8, 8, 2, 2]} maxBarSize={34}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === data.length - 1 ? '#f0a834' : 'url(#barGradient)'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                /* An empty chart with floating day labels looked like a rendering
                   bug. Say what will fill it instead. */
                <div className="flex h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-800 text-center">
                    <div className="flex items-end gap-1.5" aria-hidden="true">
                        {[18, 30, 22, 40, 26, 34, 20].map((h, i) => (
                            <div
                                key={i}
                                className="w-3 rounded-t bg-ink-800"
                                style={{ height: `${h}px` }}
                            />
                        ))}
                    </div>
                    <p className="max-w-[22rem] px-6 text-sm text-ink-400">
                        Finish your first session and it lands here. Seven days of bars
                        is where the streak starts.
                    </p>
                </div>
            )}
        </div>
    );
}

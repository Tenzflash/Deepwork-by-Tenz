'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
    day: string;
    mins: number;
}

interface ProgressChartProps {
    data: ChartData[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
    return (
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Weekly Progress</h3>
                <div className="text-xs text-zinc-500 font-mono">
                    LAST 7 DAYS
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: '#18181b',
                                border: '1px solid #27272a',
                                borderRadius: '12px',
                                fontSize: '12px'
                            }}
                        />
                        <Bar
                            dataKey="mins"
                            radius={[6, 6, 0, 0]}
                            fill="url(#barGradient)"
                            barSize={30}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === data.length - 1 ? '#818cf8' : 'url(#barGradient)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
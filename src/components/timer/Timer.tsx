'use client';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Plus, Minus } from 'lucide-react';
import { saveSession } from '@/lib/actions/sessions';

type TimerMode = 'focus' | 'break';

export default function Timer() {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    const switchMode = (newMode: TimerMode) => {
        setIsActive(false);
        setMode(newMode);
        setSeconds(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const addMinute = () => setSeconds(prev => prev + 60);
    const subMinute = () => setSeconds(prev => (prev > 60 ? prev - 60 : 0));

    useEffect(() => {
        let interval: any;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds((s) => s - 1), 1000);
        } else if (seconds === 0 && isActive) {
            setIsActive(false);
            handleSessionComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const handleSessionComplete = async () => {
        const duration = mode === 'focus' ? 25 : 5;
        const result = await saveSession(duration, mode);
        if (result.success) {
            console.log("Session recorded.");
        }
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center w-full space-y-6">
            {/* Compact Mode Selector */}
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 w-full">
                <button
                    onClick={() => switchMode('focus')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${mode === 'focus' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Target size={14} /> Focus
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${mode === 'break' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Coffee size={14} /> Break
                </button>
            </div>

            {/* Scaled Down Timer Display */}
            <div className="flex items-center justify-between w-full px-2 group">
                <button onClick={subMinute} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                    <Minus size={18} />
                </button>

                <div className="text-6xl font-light tracking-tight font-mono tabular-nums text-white">
                    {formatTime(seconds)}
                </div>

                <button onClick={addMinute} className="p-2 text-zinc-600 hover:text-indigo-400 transition-colors">
                    <Plus size={18} />
                </button>
            </div>

            {/* Compact Controls */}
            <div className="flex items-center justify-center gap-6 w-full">
                <button
                    onClick={() => { setIsActive(false); setSeconds(mode === 'focus' ? 25*60 : 5*60); }}
                    className="p-2 text-zinc-600 hover:text-zinc-200 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${isActive ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'}`}
                >
                    {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>

                <div className="w-10 flex justify-center">
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest vertical-text">
                {mode}
            </span>
                </div>
            </div>
        </div>
    );
}
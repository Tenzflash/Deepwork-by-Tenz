'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Plus, Coffee, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Timer() {
    const [seconds, setSeconds] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [isBreak, setIsBreak] = useState(false)
    const [initialTime, setInitialTime] = useState(25 * 60)

    const supabase = createClient()

    // Save session to Supabase when finished
    const saveSession = useCallback(async (durationMins: number, mode: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('focus_sessions').insert({
            user_id: user.id,
            duration_minutes: durationMins,
            mode: mode,
            completed_at: new Date().toISOString()
        })
    }, [supabase])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1)
            }, 1000)
        } else if (seconds === 0 && isActive) {
            setIsActive(false)
            const minutesWorked = Math.floor(initialTime / 60)
            saveSession(minutesWorked, isBreak ? 'break' : 'focus')
            
            // Auto-switch logic: If focus ended, set to 5 min break
            if (!isBreak) {
                toggleBreakMode(true)
            }
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, seconds, isBreak, initialTime, saveSession])

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setSeconds(isBreak ? 5 * 60 : 25 * 60)
        setInitialTime(isBreak ? 5 * 60 : 25 * 60)
    }

    const addMinutes = (mins: number) => {
        setSeconds((prev) => prev + mins * 60)
        setInitialTime((prev) => prev + mins * 60)
    }

    const toggleBreakMode = (forceBreak?: boolean) => {
        const newBreakState = typeof forceBreak === 'boolean' ? forceBreak : !isBreak
        setIsBreak(newBreakState)
        setIsActive(false)
        const newTime = newBreakState ? 5 * 60 : 25 * 60
        setSeconds(newTime)
        setInitialTime(newTime)
    }

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    return (
        <div className="w-full flex flex-col items-center space-y-6">
            {/* Mode Switcher */}
            <div className="flex bg-black/40 p-1 rounded-2xl border border-zinc-800">
                <button 
                    onClick={() => toggleBreakMode(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!isBreak ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Target size={14} /> Focus
                </button>
                <button 
                    onClick={() => toggleBreakMode(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isBreak ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Coffee size={14} /> Break
                </button>
            </div>

            {/* Timer Display */}
            <div className="relative flex items-center justify-center">
                <div className="text-7xl font-mono font-bold tracking-tighter text-white">
                    {formatTime(seconds)}
                </div>
            </div>

            {/* Quick Add Minutes */}
            <div className="flex gap-2">
                {[5, 10, 15].map((amount) => (
                    <button
                        key={amount}
                        onClick={() => addMinutes(amount)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700 text-[10px] text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <Plus size={10} /> {amount}m
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={resetTimer}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
                
                <button 
                    onClick={toggleTimer}
                    className={`p-6 rounded-[2rem] transition-all transform hover:scale-105 active:scale-95 ${
                        isActive 
                        ? 'bg-zinc-100 text-black' 
                        : isBreak ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                    }`}
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <div className="w-[54px]" /> {/* Spacer to balance reset button */}
            </div>
        </div>
    )
}
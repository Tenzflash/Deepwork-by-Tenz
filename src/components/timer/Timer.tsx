'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react'
import { saveSession } from '@/lib/actions/sessions' // Adjust path if your session.ts is elsewhere

interface Task {
  id: string
  text: string
}

export default function Timer({ tasks }: { tasks: Task[] }) {
  const [time, setTime] = useState(0) // Start from 0
  const [isActive, setIsActive] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')

  // Save session to Supabase and reset timer
  const handleSaveAndReset = useCallback(async () => {
    if (time > 0) {
      // Convert seconds to minutes. Math.max ensures at least 1 min is saved if > 0 seconds
      const minutes = Math.max(1, Math.round(time / 60)) 
      
      // Call your existing server action, passing the task ID
      await saveSession(minutes, 'focus', selectedTaskId || null)
    }
    setTime(0)
    setIsActive(false)
  }, [time, selectedTaskId])

  // The interval that counts UP every second
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  const toggleTimer = () => setIsActive(!isActive)

  // Adjust time by 1 minute (60 seconds)
  const adjustTime = (seconds: number) => {
    if (!isActive) { // Only allow adjusting when the timer is paused
      setTime((prev) => Math.max(0, prev + seconds))
    }
  }

  const mins = Math.floor(time / 60)
  const secs = time % 60

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      {/* Task Selector Dropdown */}
      <select
        value={selectedTaskId}
        onChange={(e) => setSelectedTaskId(e.target.value)}
        className="w-full bg-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={isActive}
      >
        <option value="">-- Select a Task (Optional) --</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.text.length > 25 ? task.text.substring(0, 25) + '...' : task.text}
          </option>
        ))}
      </select>

      {/* Timer Display */}
      <div className="text-5xl font-mono text-white tabular-nums">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>

      {/* +/- Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => adjustTime(-60)}
          disabled={isActive || time === 0}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={20} />
        </button>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Adjust 1m</span>
        <button
          onClick={() => adjustTime(60)}
          disabled={isActive}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Play/Pause & Reset/Save */}
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleSaveAndReset}
          disabled={time === 0}
          className="p-4 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Save session and reset"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  )
}

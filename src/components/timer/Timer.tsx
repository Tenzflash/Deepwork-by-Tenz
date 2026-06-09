'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Plus, Minus, Loader2, CheckCircle2 } from 'lucide-react'
import { saveSession } from '@/lib/actions/sessions'

interface Task {
  id: string
  text: string
}

export default function Timer({ tasks }: { tasks: Task[] }) {
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSaveAndReset = useCallback(async () => {
    if (time > 0) {
      setIsSaving(true)
      setSaveStatus('idle')
      
      try {
        const minutes = Math.max(1, Math.round(time / 60))
        console.log('Saving session:', { minutes, task_id: selectedTaskId })
        
        const result = await saveSession(minutes, 'focus', selectedTaskId || null)
        
        if (result?.error) {
          console.error('Save failed:', result.error)
          setSaveStatus('error')
        } else {
          console.log('✓ Session saved successfully!')
          setSaveStatus('success')
          setTime(0)
          setIsActive(false)
          
          setTimeout(() => setSaveStatus('idle'), 3000)
        }
      } catch (err) {
        console.error('Failed to save session:', err)
        setSaveStatus('error')
      } finally {
        setIsSaving(false)
      }
    }
  }, [time, selectedTaskId])

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

  const adjustTime = (seconds: number) => {
    if (!isActive) {
      setTime((prev) => Math.max(0, prev + seconds))
    }
  }

  const mins = Math.floor(time / 60)
  const secs = time % 60

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      {/* Task Selector */}
      <select
        value={selectedTaskId}
        onChange={(e) => setSelectedTaskId(e.target.value)}
        className="w-full bg-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isActive || isSaving}
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
          disabled={isActive || isSaving || time === 0}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={20} />
        </button>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Adjust 1m</span>
        <button
          onClick={() => adjustTime(60)}
          disabled={isActive || isSaving}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Play/Pause & Save/Reset Buttons */}
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          disabled={isSaving}
          className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={handleSaveAndReset}
          disabled={time === 0 || isSaving}
          className="p-4 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative"
          title="Save session and reset timer"
        >
          {isSaving ? (
            <Loader2 size={24} className="animate-spin" />
          ) : saveStatus === 'success' ? (
            <CheckCircle2 size={24} className="text-green-400" />
          ) : (
            <RotateCcw size={24} />
          )}
        </button>
      </div>

      {/* Status Messages */}
      <div className="h-5 flex items-center justify-center">
        {saveStatus === 'success' && (
          <p className="text-xs text-green-400 font-medium animate-in fade-in slide-in-from-bottom-2 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Session saved!
          </p>
        )}
        {saveStatus === 'error' && (
          <p className="text-xs text-red-400 font-medium animate-in fade-in slide-in-from-bottom-2">
            ✗ Save failed. Check console.
          </p>
        )}
        {isSaving && (
          <p className="text-xs text-zinc-400 font-medium animate-in fade-in">
            Saving...
          </p>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-[10px] text-zinc-600 text-center">
        {isActive ? 'Timer running...' : time > 0 ? 'Click ↻ to save & reset' : 'Press ▶ to start'}
      </p>
    </div>
  )
}

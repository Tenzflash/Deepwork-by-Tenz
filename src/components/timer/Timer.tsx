'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  // 1. Wrap the completion logic in useCallback
  const handleSessionComplete = useCallback(async () => {
    try {
      // Your existing Supabase save logic here
      console.log("Session complete and saved.")
    } catch (err) {
      console.error("Failed to save session:", err)
    }
  }, []) // Add dependencies here if you use specific props or state

  // 2. The useEffect now safely includes handleSessionComplete
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      handleSessionComplete() // Trigger the callback
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, handleSessionComplete]) // All dependencies are now stable

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl font-mono text-white tabular-nums">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
      <div className="flex gap-4">
        <button onClick={toggleTimer} className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={resetTimer} className="p-4 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors">
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  )
}
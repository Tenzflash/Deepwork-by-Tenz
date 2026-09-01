'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, Check, Trash2, Loader2, Plus } from 'lucide-react'
import { saveSession } from '@/lib/actions/sessions'

interface Task {
  id: string
  text: string
}

/** Preset session lengths in minutes. `null` means an open-ended stopwatch. */
const PRESETS: { label: string; minutes: number | null }[] = [
  { label: '25 min', minutes: 25 },
  { label: '50 min', minutes: 50 },
  { label: '90 min', minutes: 90 },
  { label: 'Open', minutes: null },
]

const RADIUS = 108
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer({ tasks }: { tasks: Task[] }) {
  const [durationMin, setDurationMin] = useState<number | null>(25)
  const [elapsed, setElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const autoSavedRef = useRef(false)

  const targetSec = durationMin !== null ? durationMin * 60 : null
  const isComplete = targetSec !== null && elapsed >= targetSec
  const hasProgress = elapsed > 0

  // Countdown mode shows time remaining; open mode counts up.
  const displaySec =
    targetSec !== null ? Math.max(0, targetSec - elapsed) : elapsed

  // Ring fills over the target. In open mode it fills once per hour.
  const progress =
    targetSec !== null
      ? Math.min(1, elapsed / targetSec)
      : (elapsed % 3600) / 3600

  const mins = Math.floor(displaySec / 60)
  const secs = displaySec % 60

  const banked = Math.max(1, Math.round(elapsed / 60))

  const persist = useCallback(async () => {
    setIsSaving(true)
    setStatus('idle')
    try {
      const result = await saveSession(banked, 'focus', selectedTaskId || null)
      if (result?.error) {
        setStatus('error')
        return false
      }
      setStatus('saved')
      setElapsed(0)
      setIsActive(false)
      setTimeout(() => setStatus('idle'), 3500)
      return true
    } catch {
      setStatus('error')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [banked, selectedTaskId])

  // Tick
  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => setElapsed((p) => p + 1), 1000)
    return () => clearInterval(id)
  }, [isActive])

  // A finished countdown stops itself and banks the session — no session
  // is ever lost because the user walked away from the screen.
  useEffect(() => {
    if (!isComplete || autoSavedRef.current || !hasProgress) return
    autoSavedRef.current = true
    setIsActive(false)
    void persist()
  }, [isComplete, hasProgress, persist])

  useEffect(() => {
    if (elapsed === 0) autoSavedRef.current = false
  }, [elapsed])

  const start = () => {
    setStatus('idle')
    setConfirmDiscard(false)
    setIsActive((a) => !a)
  }

  const choosePreset = (minutes: number | null) => {
    if (hasProgress) return
    setDurationMin(minutes)
  }

  const extend = () => {
    if (durationMin === null) return
    setDurationMin(durationMin + 5)
    autoSavedRef.current = false
  }

  const discard = () => {
    if (!confirmDiscard) {
      setConfirmDiscard(true)
      setTimeout(() => setConfirmDiscard(false), 4000)
      return
    }
    setElapsed(0)
    setIsActive(false)
    setConfirmDiscard(false)
    setStatus('idle')
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId)

  // State-driven accent: gold while the lamp is on, indigo when idle.
  const ringColor = isActive ? 'var(--color-live-500)' : 'var(--color-focus-500)'

  return (
    <div className="flex w-full flex-col items-center gap-7">
      {/* What this session is for */}
      <div className="w-full max-w-sm">
        <label
          htmlFor="timer-task"
          className="mb-2 block text-sm text-ink-400"
        >
          Working on
        </label>
        <select
          id="timer-task"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          disabled={isActive || isSaving}
          className="w-full cursor-pointer rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-sm text-ink-100 transition-colors hover:border-ink-600 focus:border-focus-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Nothing in particular</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.text}
            </option>
          ))}
        </select>
      </div>

      {/* Session length */}
      <div
        className="flex w-full max-w-sm gap-2"
        role="group"
        aria-label="Session length"
      >
        {PRESETS.map((preset) => {
          const active = durationMin === preset.minutes
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => choosePreset(preset.minutes)}
              disabled={hasProgress}
              aria-pressed={active}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? 'border-focus-500 bg-focus-500/15 text-focus-400'
                  : 'border-ink-700 bg-ink-850 text-ink-400 hover:border-ink-600 hover:text-ink-200'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>

      {/* The clock */}
      <div className="relative flex items-center justify-center">
        {isActive && (
          <div
            className="dw-glow pointer-events-none absolute h-56 w-56 rounded-full bg-live-500/25 blur-3xl"
            aria-hidden="true"
          />
        )}

        <svg
          width="248"
          height="248"
          viewBox="0 0 248 248"
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="124"
            cy="124"
            r={RADIUS}
            fill="none"
            stroke="var(--color-ink-800)"
            strokeWidth="8"
          />
          <circle
            cx="124"
            cy="124"
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            style={{
              transition:
                'stroke-dashoffset 0.9s linear, stroke 0.6s ease-in-out',
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span
            className="font-mono text-6xl leading-none tabular-nums tracking-tight text-ink-100"
            aria-live="off"
          >
            {mins.toString().padStart(2, '0')}
            <span className={isActive ? 'text-ink-600' : 'text-ink-700'}>:</span>
            {secs.toString().padStart(2, '0')}
          </span>
          <span className="mt-3 text-sm text-ink-400">
            {isActive
              ? targetSec !== null
                ? 'left in this session'
                : 'elapsed'
              : hasProgress
                ? 'paused'
                : targetSec !== null
                  ? 'ready when you are'
                  : 'counts up until you stop'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={start}
          disabled={isSaving}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 ${
            isActive
              ? 'bg-live-500 shadow-live-500/30 hover:bg-live-400'
              : 'bg-focus-500 shadow-focus-500/30 hover:bg-focus-400'
          }`}
          aria-label={isActive ? 'Pause session' : 'Start session'}
        >
          {isActive ? (
            <Pause size={26} fill="currentColor" />
          ) : (
            <Play size={26} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        {/* Save and discard are separate, labelled, and impossible to mix up */}
        {hasProgress && !isSaving && (
          <div className="dw-fade flex items-center gap-2">
            <button
              type="button"
              onClick={persist}
              className="flex items-center gap-2 rounded-xl border border-done-500/30 bg-done-500/10 px-4 py-2.5 text-sm font-medium text-done-400 transition-colors hover:bg-done-500/20"
            >
              <Check size={16} />
              Save {banked} min
            </button>

            {durationMin !== null && (
              <button
                type="button"
                onClick={extend}
                className="flex items-center gap-1.5 rounded-xl border border-ink-700 bg-ink-850 px-4 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100"
              >
                <Plus size={16} />5 min
              </button>
            )}

            <button
              type="button"
              onClick={discard}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                confirmDiscard
                  ? 'border-red-500/40 bg-red-500/15 text-red-300'
                  : 'border-ink-700 bg-ink-850 text-ink-400 hover:border-red-500/30 hover:text-red-400'
              }`}
            >
              <Trash2 size={16} />
              {confirmDiscard ? 'Tap to confirm' : 'Discard'}
            </button>
          </div>
        )}

        {isSaving && (
          <p className="flex items-center gap-2 text-sm text-ink-400">
            <Loader2 size={15} className="animate-spin" />
            Saving your session
          </p>
        )}

        {status === 'saved' && !isSaving && (
          <p className="dw-pop flex items-center gap-2 text-sm font-medium text-done-400">
            <Check size={15} />
            Session saved
            {selectedTask ? ` to "${selectedTask.text}"` : ''}
          </p>
        )}

        {status === 'error' && !isSaving && (
          <p className="dw-fade max-w-xs text-center text-sm text-red-400">
            That session didn&apos;t save. Check your connection and press Save
            again — the time is still on the clock.
          </p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { login, signup, resetPasswordAction } from '@/lib/actions/auth'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [view, setView] = useState<'login' | 'forgot'>('login')

  return (
    <form className="space-y-4">
      {view === 'forgot' ? (
        <>
          <button
            type="button"
            onClick={() => setView('login')}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Back to login
          </button>
          <p className="text-xs text-zinc-400 text-center">
            Enter your email and we'll send you a reset link.
          </p>
          <div className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>
          <button
            formAction={resetPasswordAction}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Send Reset Link
          </button>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-700"
            />
            
            {/* Password Input with Eye Icon */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3.5 pr-12 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end -mt-1">
            <button
              type="button"
              onClick={() => setView('forgot')}
              className="text-[11px] text-zinc-500 hover:text-indigo-400 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              formAction={login}
              className="bg-zinc-800 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all active:scale-95 border border-zinc-700/50"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              Sign Up
            </button>
          </div>
        </>
      )}
    </form>
  )
}
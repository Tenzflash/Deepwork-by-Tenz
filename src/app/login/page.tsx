import { login, signup, signInWithGoogle } from '@/lib/actions/auth'
import { Chrome, Zap } from 'lucide-react'

export default function LoginPage({
                                      searchParams,
                                  }: {
    searchParams: { error?: string }
}) {
    return (
        <div className="flex min-h-screen bg-black items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-indigo-600/20">
                        <Zap size={24} className="text-white" fill="white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        DeepWork by Tenz
                    </h1>
                    <p className="text-zinc-500 text-sm italic">
                        Master your focus, reclaim your time.
                    </p>
                </div>

                {/* Error Message */}
                {searchParams.error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl text-center">
                        {decodeURIComponent(searchParams.error)}
                    </div>
                )}

                <div className="space-y-4">

                    {/* Google Sign In */}
                    <form action={signInWithGoogle}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
                        >
                            <Chrome size={20} />
                            Continue with Google
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-900/50 px-2 text-zinc-600 font-bold tracking-widest">
                                Or email
                            </span>
                        </div>
                    </div>

                    {/* Email Auth */}
                    <form action={login} className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-zinc-800 text-white py-3 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all active:scale-95"
                            >
                                Sign In
                            </button>

                            <button
                                type="submit"
                                formAction={signup}
                                className="bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

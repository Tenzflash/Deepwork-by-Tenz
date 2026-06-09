import { login, signup, signInWithGoogle } from '@/lib/actions/auth'
import { Zap, Chrome } from 'lucide-react'
import LoginForm from '@/components/auth/Loginform' // <-- 1. Added import

// searchParams is a Promise in Next.js 16
export default async function LoginPage(props: {
    searchParams: Promise<{ error?: string, message?: string }> // <-- 2. Added message
}) {
    // CRITICAL: Await the params
    const searchParams = await props.searchParams;
    const error = searchParams.error;
    const message = searchParams.message; // <-- 3. Extract message

    return (
        <div className="flex min-h-screen bg-black items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8 bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl backdrop-blur-sm">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-indigo-600/20 group">
                        <Zap size={24} className="text-white fill-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">DeepWork by Tenz</h1>
                    <p className="text-zinc-500 text-sm italic">Master your focus, reclaim your time.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-4 rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-1">
                        {decodeURIComponent(error)}
                    </div>
                )}

                {/* Success Message (For Forgot Password) */}
                {message && !error && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] p-4 rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-1">
                        {decodeURIComponent(message)}
                    </div>
                )}

                <div className="space-y-4">
                    <form action={signInWithGoogle}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 group"
                        >
                            <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
                            Continue with Google
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-zinc-900/50 px-3 text-zinc-600 font-bold tracking-[0.2em]">Or email access</span></div>
                    </div>

                    {/* 4. Replaced the old hardcoded form with our new Client Component */}
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
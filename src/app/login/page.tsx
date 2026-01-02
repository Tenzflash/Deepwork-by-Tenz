import { login, signup } from '@/app/auth/actions'

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
            <form className="flex flex-col gap-4 w-full max-w-sm p-8 bg-zinc-900 rounded-xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center">Get Started</h1>

                <label htmlFor="email">Email</label>
                <input className="p-2 rounded bg-zinc-800 border border-zinc-700" id="email" name="email" type="email" required />

                <label htmlFor="password">Password</label>
                <input className="p-2 rounded bg-zinc-800 border border-zinc-700" id="password" name="password" type="password" required />

                <div className="flex gap-2 mt-4">
                    <button formAction={login} className="flex-1 bg-indigo-600 p-2 rounded font-bold hover:bg-indigo-500 transition">
                        Log in
                    </button>
                    <button formAction={signup} className="flex-1 border border-zinc-700 p-2 rounded font-bold hover:bg-zinc-800 transition">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}
import Link from 'next/link';
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">D</div>
            DeepWork
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition">Log in</Link>
            <Link href="/login" className="bg-zinc-100 text-zinc-950 px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Focus is your <span className="text-indigo-500">unfair advantage.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The minimalist deep work dashboard designed to help you reclaim your time and hit peak productivity every single day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login" className="group bg-indigo-600 px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 hover:bg-indigo-500 transition w-full sm:w-auto justify-center">
              Start Your First Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
            <FeatureCard icon={<Clock />} title="Smart Pomodoro" desc="Scientific intervals designed to maximize neuroplasticity and focus." />
            <FeatureCard icon={<Zap />} title="Real-time Stats" desc="Track your daily streaks and minutes to build a lasting work habit." />
            <FeatureCard icon={<Shield />} title="Zero Distractions" desc="A clean, minimalist UI that fades away while you work." />
          </div>
        </main>
      </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition">
        <div className="w-12 h-12 text-indigo-500 mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{desc}</p>
      </div>
  );
}
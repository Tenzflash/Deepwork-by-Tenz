import SoundBoard from '@/components/sounds/SoundBoard';
import { Headphones } from 'lucide-react';

export default function SoundscapesPage() {
    return (
        <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-10">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Soundscapes</h1>
                    <p className="text-zinc-500">Immersive audio environments for deep work.</p>
                </div>
                <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-full">
                    <Headphones size={24} />
                </div>
            </header>

            <div className="max-w-md">
                <SoundBoard />
            </div>
        </div>
    );
}
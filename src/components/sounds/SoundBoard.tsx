'use client';
import { useState, useEffect, useRef } from 'react';
import { CloudRain, Wind, Coffee, Trees, Volume2, Lock } from 'lucide-react';

const SOUNDS = [
    { id: 'rain', name: 'Rainfall', icon: <CloudRain size={24} />, premium: false, file: '/rain.mp3' },
    { id: 'white-noise', name: 'White Noise', icon: <Wind size={24} />, premium: false, file: '/white-noise.mp3' },
    { id: 'cafe', name: 'Busy Cafe', icon: <Coffee size={24} />, premium: true, file: '/cafe.mp3' },
    { id: 'forest', name: 'Zen Forest', icon: <Trees size={24} />, premium: true, file: '/forest.mp3' },
];

export default function SoundBoard() {
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Handle sound switching
        if (!activeSound) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            return;
        }

        const sound = SOUNDS.find(s => s.id === activeSound);
        if (sound && sound.file) {
            if (!audioRef.current) {
                audioRef.current = new Audio(sound.file);
            } else {
                audioRef.current.src = sound.file;
            }
            audioRef.current.loop = true;
            audioRef.current.volume = volume / 100;
            audioRef.current.play().catch(e => console.log("Audio playback blocked", e));
        }

        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, [activeSound]);

    // Sync volume slider with audio object
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const toggleSound = (id: string, isPremium: boolean) => {
        if (isPremium) {
            alert("Upgrade to PRO to unlock this soundscape!");
            return;
        }
        setActiveSound(activeSound === id ? null : id);
    };

    return (
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Atmosphere</h3>
                {activeSound && (
                    <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
             </span>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Streaming</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
                {SOUNDS.map((sound) => (
                    <button
                        key={sound.id}
                        onClick={() => toggleSound(sound.id, sound.premium)}
                        className={`relative p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                            activeSound === sound.id
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                    >
                        {sound.premium && <Lock size={12} className="absolute top-3 right-3 text-zinc-700" />}
                        {sound.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{sound.name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Volume2 size={14} />
                        <span>Volume</span>
                    </div>
                    <span>{volume}%</span>
                </div>
                <input
                    type="range" min="0" max="100" value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
        </div>
    );
}
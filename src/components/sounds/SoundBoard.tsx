'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CloudRain, Wind, Coffee, Trees, Lock, X } from 'lucide-react';

interface SoundBoardProps {
    isPro: boolean;
}

const SOUNDS = [
    { id: 'rain', name: 'Rainfall', icon: CloudRain, premium: false, file: '/rain.mp3' },
    { id: 'white-noise', name: 'White noise', icon: Wind, premium: false, file: '/white-noise.mp3' },
    { id: 'cafe', name: 'Busy cafe', icon: Coffee, premium: true, file: '/cafe.mp3' },
    { id: 'forest', name: 'Zen forest', icon: Trees, premium: true, file: '/forest.mp3' },
];

export default function SoundBoard({ isPro }: SoundBoardProps) {
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState(50);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!activeSound) {
            if (audioRef.current) audioRef.current.pause();
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
            audioRef.current.play().catch(e => console.log('Playback blocked', e));
        }

        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSound]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const toggleSound = (id: string, isPremium: boolean) => {
        // Previously this hard-navigated to /dashboard/settings with no
        // explanation, which felt like the app had thrown you out.
        if (isPremium && !isPro) {
            setShowUpgrade(true);
            return;
        }
        setActiveSound(activeSound === id ? null : id);
    };

    const playing = SOUNDS.find(s => s.id === activeSound);

    return (
        <div className="rounded-3xl border border-ink-800 bg-ink-900/60 p-6">
            <div className="mb-5 flex items-baseline justify-between gap-3">
                <h3 className="font-medium text-ink-100">Background sound</h3>
                {playing && (
                    <span className="flex items-center gap-2 text-sm text-live-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-live-500" />
                        </span>
                        {playing.name}
                    </span>
                )}
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
                {SOUNDS.map((sound) => {
                    const Icon = sound.icon;
                    const locked = sound.premium && !isPro;
                    const active = activeSound === sound.id;

                    return (
                        <button
                            key={sound.id}
                            type="button"
                            onClick={() => toggleSound(sound.id, sound.premium)}
                            aria-pressed={active}
                            className={`relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                                active
                                    ? 'border-focus-500 bg-focus-500/10 text-focus-400'
                                    : locked
                                      ? 'border-ink-800 bg-ink-850/40 text-ink-500 hover:border-ink-700'
                                      : 'border-ink-800 bg-ink-850/60 text-ink-300 hover:border-ink-600 hover:text-ink-100'
                            }`}
                        >
                            <Icon size={22} />
                            <span className="text-sm font-medium">{sound.name}</span>
                            {/* A bare padlock told nobody anything. Name the tier. */}
                            {locked && (
                                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-ink-800 px-1.5 py-0.5 text-[11px] font-medium text-ink-400">
                                    <Lock size={10} />
                                    Pro
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {showUpgrade && (
                <div className="dw-fade mb-6 flex items-start gap-3 rounded-2xl border border-focus-500/25 bg-focus-500/10 p-4">
                    <div className="flex-1 text-sm">
                        <p className="font-medium text-ink-100">Cafe and forest are Pro sounds</p>
                        <p className="mt-1 text-ink-300">
                            Rainfall and white noise are free and always will be.{' '}
                            <Link
                                href="/dashboard/settings"
                                className="font-medium text-focus-400 underline underline-offset-2 hover:text-focus-300"
                            >
                                See what Pro includes
                            </Link>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowUpgrade(false)}
                        aria-label="Dismiss"
                        className="shrink-0 rounded-lg p-1 text-ink-400 transition-colors hover:text-ink-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-baseline justify-between text-sm">
                    <label htmlFor="volume" className="text-ink-400">
                        Volume
                    </label>
                    <span className="font-mono tabular-nums text-ink-300">{volume}%</span>
                </div>
                <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="dw-range w-full"
                />
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Loader2 } from 'lucide-react';
import { addTaskAction, toggleTaskAction, deleteTaskAction } from '@/lib/actions/task';

interface Task {
    id: string;
    text: string;
    is_completed: boolean;
}

interface TaskJournalProps {
    initialTasks: Task[];
    openCount: number;
}

export default function TaskJournal({ initialTasks, openCount }: TaskJournalProps) {
    const [input, setInput] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        setIsPending(true);
        setError(null);
        try {
            await addTaskAction(input);
            setInput('');
        } catch {
            setError("That didn't save. Try again in a moment.");
        } finally {
            setIsPending(false);
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleTaskAction(id, !currentStatus);
        } catch {
            setError("Couldn't update that task.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTaskAction(id);
        } catch {
            setError("Couldn't delete that task.");
        }
    };

    return (
        <div className="flex flex-col rounded-3xl border border-ink-800 bg-ink-900/60 p-6">
            <div className="mb-5 flex items-baseline justify-between">
                <h3 className="font-medium text-ink-100">Today&apos;s tasks</h3>
                {initialTasks.length > 0 && (
                    <span className="text-sm text-ink-400">
                        {openCount} open
                    </span>
                )}
            </div>

            <form onSubmit={handleAddTask} className="relative mb-5">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isPending}
                    placeholder="What are you working on?"
                    className="w-full rounded-xl border border-ink-700 bg-ink-950 py-3 pl-4 pr-12 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-focus-500 focus:outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isPending || !input.trim()}
                    aria-label="Add task"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-focus-500 p-2 text-white transition-all hover:bg-focus-400 active:scale-90 disabled:bg-ink-700 disabled:text-ink-500"
                >
                    {isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Plus size={16} />
                    )}
                </button>
            </form>

            {error && (
                <p className="dw-fade mb-4 text-sm text-red-400">{error}</p>
            )}

            <div className="custom-scrollbar max-h-[22rem] space-y-2 overflow-y-auto">
                {initialTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-ink-800 px-6 py-10 text-center">
                        <p className="text-sm text-ink-400">
                            Write down the one thing you want to finish today. You can
                            attach it to a session so the time gets credited to it.
                        </p>
                    </div>
                ) : (
                    initialTasks.map(task => (
                        <div
                            key={task.id}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-transparent bg-ink-850/60 p-3 transition-colors hover:border-ink-700"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    onClick={() => handleToggle(task.id, task.is_completed)}
                                    aria-label={
                                        task.is_completed
                                            ? `Mark "${task.text}" as not done`
                                            : `Mark "${task.text}" as done`
                                    }
                                    className="shrink-0 text-ink-500 transition-colors hover:text-focus-400"
                                >
                                    {task.is_completed ? (
                                        <CheckCircle2 size={20} className="text-done-500" />
                                    ) : (
                                        <Circle size={20} />
                                    )}
                                </button>
                                <span
                                    className={`truncate text-sm transition-colors ${
                                        task.is_completed
                                            ? 'text-ink-500 line-through decoration-ink-600'
                                            : 'text-ink-100'
                                    }`}
                                >
                                    {task.text}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(task.id)}
                                aria-label={`Delete "${task.text}"`}
                                className="shrink-0 rounded-lg p-1.5 text-ink-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 focus-visible:opacity-100 group-hover:opacity-100"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

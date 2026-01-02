'use client';
import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
// Import the Server Actions we'll create in the next step
import { addTaskAction, toggleTaskAction, deleteTaskAction } from '@/lib/actions/task';

interface Task {
    id: string; // Changed to string because Supabase uses UUIDs
    text: string;
    is_completed: boolean; // Matches the database column name
}

interface TaskJournalProps {
    initialTasks: Task[];
}

export default function TaskJournal({ initialTasks }: TaskJournalProps) {
    const [input, setInput] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        setIsPending(true);
        try {
            await addTaskAction(input);
            setInput('');
        } catch (error) {
            console.error("Failed to add task:", error);
        } finally {
            setIsPending(false);
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleTaskAction(id, !currentStatus);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTaskAction(id);
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    return (
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex flex-col h-full">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Today's Focus</h3>

            <form onSubmit={handleAddTask} className="relative mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isPending}
                    placeholder="What are you working on?"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-indigo-500 transition-colors text-sm disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition disabled:bg-zinc-700"
                >
                    <Plus size={18} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {initialTasks.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-zinc-600 text-sm">No tasks yet. Set an intention.</p>
                    </div>
                ) : (
                    initialTasks.map(task => (
                        <div key={task.id} className="group flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-transparent hover:border-zinc-800 transition-all">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggle(task.id, task.is_completed)}
                                    className="text-zinc-500 hover:text-indigo-400"
                                >
                                    {task.is_completed ? (
                                        <CheckCircle2 size={20} className="text-indigo-500" />
                                    ) : (
                                        <Circle size={20} />
                                    )}
                                </button>
                                <span className={`text-sm ${task.is_completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                                    {task.text}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-400 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
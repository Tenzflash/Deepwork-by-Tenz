'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTaskAction(text: string) {
    const supabase = await createClient()

    // Get the current user to link the task to them
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be logged in to add tasks')

    const { error } = await supabase
        .from('tasks')
        .insert([{
            text,
            user_id: user.id,
            is_completed: false
        }])

    if (error) {
        console.error('Error adding task:', error.message)
        throw error
    }

    // This clears the cache and shows the new task immediately
    revalidatePath('/dashboard')
}

export async function toggleTaskAction(id: string, is_completed: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('tasks')
        .update({ is_completed })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/dashboard')
}

export async function deleteTaskAction(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/dashboard')
}
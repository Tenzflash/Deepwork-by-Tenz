'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// We added 'task_id' as an optional third parameter
export async function saveSession(duration: number, mode: string, task_id?: string | null) {
    const supabase = await createClient()

    // Get the current session user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('focus_sessions')
        .insert([{
            user_id: user.id,
            duration_minutes: duration,
            mode: mode,
            task_id: task_id || null // Save the linked task (or null if none selected)
        }])

    if (error) {
        console.error('Error saving session:', error.message)
        return { error: error.message }
    }

    // Refresh the dashboard so the "Daily Goal" counter updates
    revalidatePath('/dashboard')
    return { success: true }
}

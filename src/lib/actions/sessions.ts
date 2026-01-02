'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveSession(duration: number, mode: string) {
    const supabase = await createClient()

    // Get the current session user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('focus_sessions')
        .insert([{
            user_id: user.id,
            duration_minutes: duration,
            mode: mode
        }])

    if (error) {
        console.error('Error saving session:', error.message)
        return { error: error.message }
    }

    // Refresh the dashboard so the "Daily Goal" counter updates
    revalidatePath('/dashboard')
    return { success: true }
}
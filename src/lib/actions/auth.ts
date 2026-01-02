'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error.message)
        return
    }

    // Redirect to the login page or home page after logout
    redirect('/login')
}
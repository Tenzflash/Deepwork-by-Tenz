'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithGoogle() {
    const supabase = await createClient()
    
    // Leaving redirectTo empty lets Supabase use the "Site URL" 
    // configured in your dashboard automatically.
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: undefined, 
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
    if (data.url) redirect(data.url)
}

export async function login(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // For signup, Supabase needs to know where to send the confirmation email link
    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
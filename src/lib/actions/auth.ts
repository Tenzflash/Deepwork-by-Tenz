'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

/**
 * HELPER: Gets the absolute base URL safely
 */
async function getOrigin() {
    const headerList = await headers();
    const host = headerList.get('host'); // e.g. deepwork-by-tenz.vercel.app
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = await getOrigin();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Google Auth Error:', error.message)
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    if (data.url) {
        return redirect(data.url)
    }
}

export async function login(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) return redirect('/login?error=Missing credentials')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return redirect(`/login?error=${encodeURIComponent(error.message)}`)

    revalidatePath('/', 'layout')
    return redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const origin = await getOrigin();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) return redirect(`/login?error=${encodeURIComponent(error.message)}`)

    // Turn off 'Confirm Email' in Supabase to avoid this step
    return redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return redirect('/login')
}
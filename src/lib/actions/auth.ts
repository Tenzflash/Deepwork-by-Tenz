'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/**
 * GOOGLE SIGN IN
 * Triggers Supabase OAuth and redirects to Google
 */
export async function signInWithGoogle() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${SITE_URL}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error('Google OAuth error:', error.message)
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    if (data?.url) {
        redirect(data.url)
    }

    // Safety fallback (should never hit)
    redirect('/login?error=OAuth failed')
}

/**
 * EMAIL + PASSWORD LOGIN
 */
export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
        redirect('/login?error=Missing credentials')
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

/**
 * EMAIL + PASSWORD SIGN UP
 */
export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
        redirect('/login?error=Missing credentials')
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${SITE_URL}/auth/callback`,
        },
    })

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

/**
 * SIGN OUT
 */
export async function signOut() {
    const supabase = await createClient()

    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}

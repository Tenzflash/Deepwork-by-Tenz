'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

async function getOrigin() {
    // In Next.js 16, headers() must be awaited
    const headerList = await headers();
    const host = headerList.get('host');
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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
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

    if (error) {
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // Direct login after signup requires 'Confirm Email' to be OFF in Supabase
    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
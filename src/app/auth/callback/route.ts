import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()

        // Exchange the code for a session and set cookies
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else {
                // Force HTTPS in production to ensure cookies are sent securely
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            console.error('Code exchange error:', error.message)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Auth%20session%20failed`)
}
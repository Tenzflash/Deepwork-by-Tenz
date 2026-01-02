import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // We can return to the origin if on localhost
                return NextResponse.redirect(`${origin}${next}`)
            } else {
                // On Vercel, we want to ensure we redirect to the production URL
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // Return the user to an error page with instructions if something goes wrong
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
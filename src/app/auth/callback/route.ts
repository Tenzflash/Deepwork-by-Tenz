import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Success: send the user to the dashboard
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('Exchange error:', error.message)
        }
    }

    // Fail: send back to login with error
    return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
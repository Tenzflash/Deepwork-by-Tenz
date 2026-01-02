import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * AUTH CALLBACK ROUTE
 * This route handles the exchange of an auth code for a user session.
 * It is used for both Email Magic Links/Confirmations and Google OAuth.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // Default redirect to dashboard if no 'next' param is provided
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()

        // Exchange the temporary code for a permanent session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Determine the correct redirect URL
            // In Production, we prioritize the NEXT_PUBLIC_SITE_URL to avoid origin mismatches
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin

            // Construct the final destination URL
            const redirectUrl = `${siteUrl}${next}`

            return NextResponse.redirect(redirectUrl)
        } else {
            console.error('Auth code exchange error:', error.message)
        }
    }

    // If something goes wrong, redirect to login with an error message
    // Using origin here is safe as it's a fallback for the error state
    return NextResponse.redirect(`${origin}/login?error=Authentication failed. Please try again.`)
}
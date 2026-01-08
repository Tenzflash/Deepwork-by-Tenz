import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Get the URL details from the incoming request
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin // This will be https://deepwork-by-tenz.vercel.app on Vercel

  if (code) {
    const supabase = await createClient()
    
    // 2. Exchange the temporary code for a permanent session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 3. SUCCESS: Redirect to dashboard using the dynamic origin
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // 4. FAILURE: Return to login with an error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
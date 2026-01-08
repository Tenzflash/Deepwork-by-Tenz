import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Use the request URL to construct the redirect URL to ensure it matches the current environment
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Return to login if something fails
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url))
}

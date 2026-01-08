import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 'next' allows you to redirect to a specific page after login
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful login -> go to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If code exchange fails, send back to login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
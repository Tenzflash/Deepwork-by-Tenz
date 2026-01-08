import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 'origin' is automatically detected from the current request
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Return to login if something went wrong
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
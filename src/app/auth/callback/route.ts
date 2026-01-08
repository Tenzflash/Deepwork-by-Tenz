import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Hardcode the Vercel URL here just to test and break the loop
  const siteUrl = 'https://deepwork-by-tenz.vercel.app'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Direct redirect to dashboard
      return NextResponse.redirect(`${siteUrl}/dashboard`)
    }
  }

  // If it fails, send the error back to login
  return NextResponse.redirect(`${siteUrl}/login?error=Session_Exchange_Failed`)
}
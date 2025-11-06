import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  // Create Supabase client with proper cookie handling for route handlers
  const cookieStore = await cookies()
  let redirectUrl = `${requestUrl.origin}/login`
  const cookiesToSet: Array<{ name: string; value: string; options: any }> = []
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSetArray) {
          try {
            cookiesToSetArray.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
              // Store for later use in response
              cookiesToSet.push({ name, value, options })
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )

  // Log for debugging
  console.log('Auth callback received:', { 
    code: !!code, 
    token_hash: !!token_hash, 
    type, 
    next,
    fullUrl: requestUrl.toString()
  })

  // Handle email confirmation with code (most common Supabase flow)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      redirectUrl = `${requestUrl.origin}/login?error=verification_failed&message=${encodeURIComponent(error.message)}`
    } else if (data.session && data.user) {
      // IMPORTANT: Verify the email is actually confirmed
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser && currentUser.email_confirmed_at) {
        // Email is confirmed and user is logged in
        console.log('Email verified and user logged in:', currentUser.email)
        redirectUrl = `${requestUrl.origin}/dashboard?verified=true`
      } else if (currentUser) {
        // User exists but email not confirmed - this shouldn't happen but handle it
        console.log('User logged in but email not confirmed, attempting to confirm...')
        // Try to manually confirm by updating the user
        // Note: This might require service role key, so we'll redirect to login
        redirectUrl = `${requestUrl.origin}/login?error=email_not_confirmed`
      } else {
        // Session created but user not found
        console.log('Session created but user not found')
        redirectUrl = `${requestUrl.origin}/login?error=verification_failed`
      }
    } else {
      // No session created
      console.log('No session created from code exchange')
      redirectUrl = `${requestUrl.origin}/login?error=verification_failed`
    }
  }
  // Handle email confirmation with token_hash (alternative flow)
  else if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'email' | 'recovery',
      token_hash,
    })

    if (error) {
      console.error('Error verifying OTP:', error)
      redirectUrl = `${requestUrl.origin}/login?error=verification_failed&message=${encodeURIComponent(error.message)}`
    } else if (data.session && data.user) {
      // Verify email is confirmed
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser && currentUser.email_confirmed_at) {
        console.log('Email verified and user logged in via OTP:', currentUser.email)
        redirectUrl = `${requestUrl.origin}/dashboard?verified=true`
      } else if (currentUser) {
        console.log('User logged in but email not confirmed')
        redirectUrl = `${requestUrl.origin}/login?error=email_not_confirmed`
      } else {
        redirectUrl = `${requestUrl.origin}/login?error=verification_failed`
      }
    } else {
      console.log('No session created from OTP verification')
      redirectUrl = `${requestUrl.origin}/login?error=verification_failed`
    }
  } else {
    // If no valid parameters, check if it's a direct Supabase redirect
    // Sometimes Supabase redirects without parameters if already processed
    console.log('No valid verification parameters found, checking if user is already logged in...')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (user && user.email_confirmed_at) {
      // User is already logged in and confirmed
      redirectUrl = `${requestUrl.origin}/dashboard`
    } else {
      redirectUrl = `${requestUrl.origin}/login?error=invalid_link`
    }
  }

  // Create redirect response and set all cookies that were set during verification
  const response = NextResponse.redirect(redirectUrl)
  
  // Set all cookies that Supabase set during verification
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}


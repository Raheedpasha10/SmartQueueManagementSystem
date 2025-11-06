'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function AuthHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    // Check if this is a Supabase auth redirect
    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    
    // If we have auth parameters, redirect to callback
    if (code || (token_hash && type) || access_token) {
      const params = new URLSearchParams()
      if (code) params.set('code', code)
      if (token_hash) params.set('token_hash', token_hash)
      if (type) params.set('type', type)
      if (access_token) params.set('access_token', access_token)
      if (refresh_token) params.set('refresh_token', refresh_token)
      
      // Redirect to our callback handler
      router.replace(`/auth/callback?${params.toString()}`)
    }
  }, [searchParams, router])
  
  return null
}

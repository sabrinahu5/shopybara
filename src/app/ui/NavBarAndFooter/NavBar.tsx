'use client'

import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js';

export default function NavBar() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://gavjnourkcjfeahrlmjq.supabase.co/auth/v1/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      }
    })

    if (error) {
      console.error('Sign in error:', error.message)
      return
    }

    // User will be redirected to OAuth provider
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error.message)
      return
    }
    setUser(null)
    router.push('/')
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-20 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            shopy<span className="text-[#464646]">bara</span>
          </div>
          <div className="flex gap-4">
            {!user ? (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-[#464646] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-[#464646] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

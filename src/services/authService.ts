import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const authService = {
  async getSession() {
    return supabase.auth.getSession()
  },

  async getUser() {
    return supabase.auth.getUser()
  },

  subscribeToAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  async signInWithGoogle(redirectTo = window.location.origin) {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
  },

  async signOut() {
    return supabase.auth.signOut()
  },
}

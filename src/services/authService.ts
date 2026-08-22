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

  async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  async signUpWithEmail(email: string, password: string, emailRedirectTo = window.location.origin) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    })
  },

  async sendPasswordResetEmail(email: string, redirectTo = `${window.location.origin}/reset-password`) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
  },

  async updateUserPassword(newPassword: string) {
    return supabase.auth.updateUser({
      password: newPassword,
    })
  },

  async signOut() {
    return supabase.auth.signOut()
  },
}

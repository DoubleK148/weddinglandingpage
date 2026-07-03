import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface RsvpPayload {
  name: string
  phone?: string
  guest_count: number
  attending: boolean
  message?: string
}

export interface WishPayload {
  name: string
  message: string
}

export interface WishRecord {
  id: string
  name: string
  message: string
  created_at: string
}

export async function submitRsvp(payload: RsvpPayload) {
  if (!supabase) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.info('[demo] RSVP submitted:', payload)
    return
  }

  const { error } = await supabase.from('rsvps').insert(payload)
  if (error) throw error
}

export async function submitWish(payload: WishPayload) {
  if (!supabase) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.info('[demo] Wish submitted:', payload)
    return
  }

  const { error } = await supabase.from('wishes').insert(payload)
  if (error) throw error
}

export async function fetchWishes(): Promise<WishRecord[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('wishes')
    .select('id, name, message, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

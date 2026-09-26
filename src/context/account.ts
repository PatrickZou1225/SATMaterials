import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  display_name: string
  role: 'student' | 'teacher'
  is_owner: boolean
}

export type Account = {
  user: User
  profile: Profile | null
  signOut: () => Promise<void>
}

export const AccountContext = createContext<Account | null>(null)

export function useAccount() {
  return useContext(AccountContext)
}

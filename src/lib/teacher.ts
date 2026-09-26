import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAccount } from '../context/account'

// Other teachers pay ¥199/year for the backend. The owner is never gated.
export const TEACHER_PRICE_YEAR = 199

export type TeacherStatus = {
  loading: boolean
  isOwner: boolean
  isTeacher: boolean
  // Access to backend features: owner, or a teacher whose subscription is live.
  active: boolean
  expiresAt: string | null
}

export function useTeacherStatus(): TeacherStatus {
  const account = useAccount()
  const isOwner = account?.profile?.is_owner === true
  const isTeacher = account?.profile?.role === 'teacher'
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isTeacher || isOwner) {
      setLoading(false)
      return
    }
    if (!supabase || !account?.user) {
      setLoading(false)
      return
    }
    let active = true
    void supabase
      .from('teacher_subscriptions')
      .select('expires_at')
      .eq('teacher_id', account.user.id)
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return
        setExpiresAt((data as { expires_at: string } | null)?.expires_at ?? null)
        setLoading(false)
      })
    return () => { active = false }
  }, [account?.user, isOwner, isTeacher])

  const active = isOwner || (isTeacher && expiresAt !== null && new Date(expiresAt) > new Date())
  return { loading, isOwner, isTeacher, active, expiresAt }
}

export function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString('zh-CN') : '—'
}

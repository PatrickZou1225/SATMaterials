import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAccount } from '../context/account'

// Real SAT papers are sold by year. 2023 is free for everyone; the rest need a
// per-year entitlement row (see supabase/migrations/20260926000000_entitlements.sql).
// Teachers are never gated.
export const FREE_YEARS = [2023]
export const PAID_YEARS = [2024, 2025, 2026]
export const YEAR_PRICE: Record<number, number> = { 2023: 0, 2024: 20, 2025: 49, 2026: 99 }

export function priceLabel(year: number) {
  const price = YEAR_PRICE[year]
  if (price === undefined || price === 0) return '免费'
  return `¥${price}`
}

export type YearAccess = {
  loading: boolean
  isTeacher: boolean
  unlockedYears: Set<number>
  canAccess: (year: number) => boolean
}

// Reads the signed-in student's entitlements once and exposes a per-year check.
export function useYearAccess(): YearAccess {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const [unlockedYears, setUnlockedYears] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isTeacher) {
      setUnlockedYears(new Set())
      setLoading(false)
      return
    }
    if (!supabase || !account?.user) {
      setLoading(false)
      return
    }
    let active = true
    void supabase
      .from('entitlements')
      .select('year')
      .eq('student_id', account.user.id)
      .then(({ data }) => {
        if (!active) return
        setUnlockedYears(new Set(((data ?? []) as { year: number }[]).map((row) => row.year)))
        setLoading(false)
      })
    return () => { active = false }
  }, [account?.user, isTeacher])

  const canAccess = (year: number) =>
    isTeacher || FREE_YEARS.includes(year) || unlockedYears.has(year)

  return { loading, isTeacher, unlockedYears, canAccess }
}

import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAccount } from '../context/account'

// Paid content comes in two kinds of entitlement (see
// supabase/migrations/20260926000000_entitlements.sql and ..._official_hard.sql):
// real SAT papers are sold per year, and the official-sample "Hard" pool is a
// single one-off product. Teachers are never gated.
export const FREE_YEARS = [2023]
export const PAID_YEARS = [2024, 2025, 2026]
export const YEAR_PRICE: Record<number, number> = { 2023: 0, 2024: 20, 2025: 49, 2026: 99 }

export const OFFICIAL_HARD_PRODUCT = 'official-hard'
export const OFFICIAL_HARD_PRICE = 9.9

export function priceLabel(year: number) {
  const price = YEAR_PRICE[year]
  if (price === undefined || price === 0) return '免费'
  return `¥${price}`
}

export const productLabel = (product: string) =>
  product === OFFICIAL_HARD_PRODUCT ? `¥${OFFICIAL_HARD_PRICE}` : '免费'

export type AccessState = {
  loading: boolean
  isTeacher: boolean
  unlockedYears: Set<number>
  unlockedProducts: Set<string>
  canAccess: (year: number) => boolean
  canAccessProduct: (product: string) => boolean
}

// Reads the signed-in student's entitlements once and exposes per-year and
// per-product checks. Selects `*` (not named columns) so a deploy that lands
// ahead of the product migration still resolves year unlocks.
export function useAccess(): AccessState {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const [unlockedYears, setUnlockedYears] = useState<Set<number>>(new Set())
  const [unlockedProducts, setUnlockedProducts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isTeacher) {
      setUnlockedYears(new Set())
      setUnlockedProducts(new Set())
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
      .select('*')
      .eq('student_id', account.user.id)
      .then(({ data }) => {
        if (!active) return
        const rows = (data ?? []) as { year: number | null; product?: string | null }[]
        setUnlockedYears(new Set(rows.map((row) => row.year).filter((year): year is number => year !== null)))
        setUnlockedProducts(new Set(rows.map((row) => row.product).filter((p): p is string => Boolean(p))))
        setLoading(false)
      })
    return () => { active = false }
  }, [account?.user, isTeacher])

  const canAccess = (year: number) =>
    isTeacher || FREE_YEARS.includes(year) || unlockedYears.has(year)

  const canAccessProduct = (product: string) =>
    isTeacher || unlockedProducts.has(product)

  return { loading, isTeacher, unlockedYears, unlockedProducts, canAccess, canAccessProduct }
}

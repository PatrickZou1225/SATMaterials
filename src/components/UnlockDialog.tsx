import { useState } from 'react'
import { X } from 'lucide-react'
import { useAccount } from '../context/account'
import { priceLabel } from '../lib/access'

// Manual Alipay flow: students pay by scanning the QR code, then the teacher
// grants the year from /students. No payment API — the QR image is a static
// asset the teacher drops at public/alipay-qr.png.
export default function UnlockDialog({ year, onClose }: { year: number; onClose: () => void }) {
  const account = useAccount()
  const email = account?.user.email ?? '你的注册邮箱'
  const [imageError, setImageError] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 max-w-sm w-full border border-gray-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">解锁 {year} 年真题</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="关闭">
            <X size={18} />
          </button>
        </div>

        <p className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">{priceLabel(year)}</p>

        <div className="mt-4 flex justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3">
          {imageError ? (
            <p className="py-10 text-sm text-slate-400">收款码尚未上传，请联系老师。</p>
          ) : (
            <img src="/alipay-qr.png" alt="支付宝收款码" onError={() => setImageError(true)} className="w-56 h-auto rounded-lg" />
          )}
        </div>

        <ol className="mt-4 space-y-2 text-sm text-gray-600 dark:text-slate-300 list-decimal list-inside">
          <li>用<strong>支付宝</strong>扫码付款 {priceLabel(year)}</li>
          <li>付款备注填写：<span className="font-semibold text-gray-900 dark:text-slate-100 break-all">{email}</span></li>
          <li>付款后告诉老师，老师会尽快为你开通</li>
        </ol>

        <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">开通后本年份真题永久有效。老师布置的作业不受此限制。</p>

        <button type="button" onClick={onClose}
          className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">
          知道了
        </button>
      </div>
    </div>
  )
}

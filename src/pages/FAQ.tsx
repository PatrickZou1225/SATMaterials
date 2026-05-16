import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  { q: 'SAT考试是什么？', a: 'SAT是美国大学招生考试，由College Board主办。现在的数字化SAT分为两个模块：阅读与写作（Reading & Writing）和数学（Math），满分1600分。' },
  { q: '数字化SAT和纸笔SAT有什么区别？', a: '数字化SAT在电脑上进行，采用自适应测试机制（第一模块的表现决定第二模块的难度）。考试时间更短（约2.25小时），题目数量也有所减少，但难度和评分标准相同。' },
  { q: '如何高效备考SAT？', a: '建议先做一套完整的模拟题了解自己的薄弱点，然后针对性地练习弱项。数学部分要熟练掌握代数和数据分析；阅读写作部分要积累词汇和练习快速读题。每天保持1-2小时的练习，比临时抱佛脚更有效。' },
  { q: '每道题应该花多少时间？', a: '数字化SAT每个模块约32-35分钟，包含27道题。平均每题约1.2-1.3分钟。阅读写作题由于有短文段，可能需要稍多时间；数学题则需要根据难度灵活分配。' },
  { q: '如何使用这个平台最有效？', a: '建议按科目和难度筛选练习，先从"简单"难度建立信心，再逐步挑战"困难"题目。每道题做完后认真阅读解析，理解解题思路比记住答案更重要。' },
  { q: '练习题和真实SAT题难度一样吗？', a: '本平台的题目参考College Board官方样题风格设计，难度分级（简单/中等/困难）与真实SAT的题目难度分布相对应，可以作为有效的备考练习。' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">常见问题</h1>
        <p className="text-gray-500 mb-10">关于SAT备考和本平台的常见问题解答</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

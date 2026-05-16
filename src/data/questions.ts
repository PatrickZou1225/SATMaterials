// ============================================================
//  SAT 题库文件
//  ✏️  如何添加新题目：
//  1. 在对应的科目数组里复制一个题目对象
//  2. 修改 id（必须唯一）、question、options、answer、explanation
//  3. 保存文件，网站会自动更新
// ============================================================

export type Subject = 'math' | 'reading'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: number
  subject: Subject
  topic: string        // 知识点分类
  difficulty: Difficulty
  question: string     // 题目内容
  options: string[]    // 选项（4个）
  answer: number       // 正确答案的索引（0=A, 1=B, 2=C, 3=D）
  explanation: string  // 解析
}

const questions: Question[] = [

  // ============================================================
  //  数学题 - Math
  // ============================================================

  {
    id: 1,
    subject: 'math',
    topic: '线性方程',
    difficulty: 'easy',
    question: '如果 2x + 3 = 11，那么 x 的值是多少？',
    options: ['A) 2', 'B) 3', 'C) 4', 'D) 5'],
    answer: 2,
    explanation: '将两边减去3得 2x = 8，两边除以2得 x = 4。',
  },
  {
    id: 2,
    subject: 'math',
    topic: '线性方程',
    difficulty: 'easy',
    question: '如果 3x - 7 = 14，那么 x 的值是多少？',
    options: ['A) 5', 'B) 6', 'C) 7', 'D) 8'],
    answer: 2,
    explanation: '两边加7得 3x = 21，两边除以3得 x = 7。',
  },
  {
    id: 3,
    subject: 'math',
    topic: '二次方程',
    difficulty: 'medium',
    question: '方程 x² - 5x + 6 = 0 的解是什么？',
    options: ['A) x = 1 和 x = 6', 'B) x = 2 和 x = 3', 'C) x = -2 和 x = -3', 'D) x = -1 和 x = -6'],
    answer: 1,
    explanation: '分解因式：(x-2)(x-3) = 0，所以 x = 2 或 x = 3。',
  },
  {
    id: 4,
    subject: 'math',
    topic: '二次方程',
    difficulty: 'medium',
    question: '方程 x² - 7x + 12 = 0 的解是什么？',
    options: ['A) x = 3 和 x = 4', 'B) x = 2 和 x = 6', 'C) x = 1 和 x = 12', 'D) x = -3 和 x = -4'],
    answer: 0,
    explanation: '分解因式：(x-3)(x-4) = 0，所以 x = 3 或 x = 4。',
  },
  {
    id: 5,
    subject: 'math',
    topic: '数据分析',
    difficulty: 'easy',
    question: '5个学生的数学成绩为：72, 85, 90, 68, 95。这组数据的平均值是多少？',
    options: ['A) 80', 'B) 82', 'C) 85', 'D) 78'],
    answer: 1,
    explanation: '总和 = 72+85+90+68+95 = 410，平均值 = 410÷5 = 82。',
  },
  {
    id: 6,
    subject: 'math',
    topic: '数据分析',
    difficulty: 'medium',
    question: '数据集 {3, 7, 7, 9, 11, 13} 的中位数是多少？',
    options: ['A) 7', 'B) 8', 'C) 9', 'D) 7.5'],
    answer: 1,
    explanation: '共6个数，排好序后中间两个数是7和9，中位数 = (7+9)÷2 = 8。',
  },
  {
    id: 7,
    subject: 'math',
    topic: '几何',
    difficulty: 'medium',
    question: '一个直角三角形，两直角边分别为3和4，斜边长度是多少？',
    options: ['A) 5', 'B) 6', 'C) 7', 'D) 25'],
    answer: 0,
    explanation: '根据勾股定理：c² = 3² + 4² = 9 + 16 = 25，所以 c = 5。',
  },
  {
    id: 8,
    subject: 'math',
    topic: '几何',
    difficulty: 'hard',
    question: '一个圆的面积是 36π，那么这个圆的周长是多少？',
    options: ['A) 6π', 'B) 12π', 'C) 18π', 'D) 36π'],
    answer: 1,
    explanation: '面积 = πr² = 36π，所以 r² = 36，r = 6。周长 = 2πr = 12π。',
  },
  {
    id: 9,
    subject: 'math',
    topic: '线性方程',
    difficulty: 'hard',
    question: '直线 y = 2x + 3 与 y = -x + 9 的交点坐标是？',
    options: ['A) (2, 7)', 'B) (3, 6)', 'C) (2, 5)', 'D) (1, 5)'],
    answer: 0,
    explanation: '令 2x+3 = -x+9，解得 3x = 6，x = 2。代入得 y = 2(2)+3 = 7。交点为 (2,7)。',
  },
  {
    id: 10,
    subject: 'math',
    topic: '比率与比例',
    difficulty: 'easy',
    question: '如果一辆车以60英里/小时的速度行驶，行驶2.5小时能走多远？',
    options: ['A) 120英里', 'B) 150英里', 'C) 180英里', 'D) 200英里'],
    answer: 1,
    explanation: '距离 = 速度 × 时间 = 60 × 2.5 = 150英里。',
  },

  // ============================================================
  //  阅读与写作题 - Reading & Writing
  // ============================================================

  {
    id: 101,
    subject: 'reading',
    topic: '词汇理解',
    difficulty: 'easy',
    question: '以下哪个词最接近 "meticulous" 的意思？',
    options: ['A) 粗心的 (careless)', 'B) 一丝不苟的 (careful and precise)', 'C) 迅速的 (quick)', 'D) 慷慨的 (generous)'],
    answer: 1,
    explanation: '"Meticulous" 意为"极为仔细的、一丝不苟的"，强调对细节的极度关注。',
  },
  {
    id: 102,
    subject: 'reading',
    topic: '词汇理解',
    difficulty: 'easy',
    question: '以下哪个词最接近 "ambiguous" 的意思？',
    options: ['A) 清晰的 (clear)', 'B) 模糊的、有歧义的 (unclear, having multiple meanings)', 'C) 勇敢的 (brave)', 'D) 悲伤的 (sad)'],
    answer: 1,
    explanation: '"Ambiguous" 意为"含糊不清的、有多种解释的"，指某事物可以有不同理解。',
  },
  {
    id: 103,
    subject: 'reading',
    topic: '语法修辞',
    difficulty: 'medium',
    question: '选择语法正确的句子：',
    options: [
      'A) Each of the students have completed their assignments.',
      'B) Each of the students has completed their assignments.',
      'C) Each of the students have completed his assignments.',
      'D) Each of the students are completing their assignments.',
    ],
    answer: 1,
    explanation: '"Each" 作主语时为单数，动词应用 "has"。"their" 在此处用作性别中立的代词，符合现代英语用法。',
  },
  {
    id: 104,
    subject: 'reading',
    topic: '语法修辞',
    difficulty: 'medium',
    question: '下列哪个句子正确使用了分号？',
    options: [
      'A) I went to the store; because I needed milk.',
      'B) She studied hard; therefore, she passed the exam.',
      'C) He likes pizza; and pasta.',
      'D) They arrived early; but left soon.',
    ],
    answer: 1,
    explanation: '分号可以连接两个独立的句子，或在使用连接副词（therefore, however等）前使用。选项B正确：两个独立分句用分号连接，后跟连接副词。',
  },
  {
    id: 105,
    subject: 'reading',
    topic: '文本分析',
    difficulty: 'hard',
    question: '文章中作者写道："The evidence suggests a correlation, but we must be cautious about assuming causation."（证据显示存在相关性，但我们必须谨慎对待因果关系的假设。）作者的主要目的是？',
    options: [
      'A) 否认研究的有效性',
      'B) 提醒读者区分相关性与因果关系',
      'C) 证明实验的结论是错误的',
      'D) 建议进行更多实验',
    ],
    answer: 1,
    explanation: '作者使用"we must be cautious"（我们必须谨慎）表明其目的是提醒读者批判性地看待数据，区分相关性（correlation）与因果关系（causation）这两个重要概念。',
  },
  {
    id: 106,
    subject: 'reading',
    topic: '词汇理解',
    difficulty: 'medium',
    question: '以下哪个词最接近 "pragmatic" 的意思？',
    options: ['A) 理想化的 (idealistic)', 'B) 实用的、务实的 (practical)', 'C) 悲观的 (pessimistic)', 'D) 固执的 (stubborn)'],
    answer: 1,
    explanation: '"Pragmatic" 意为"务实的、注重实际的"，强调根据实际情况做决定，而非基于理论或原则。',
  },
  {
    id: 107,
    subject: 'reading',
    topic: '论证推理',
    difficulty: 'hard',
    question: '如果一个论证说"所有成功的商人都努力工作，约翰努力工作，所以约翰会成功"，这个论证存在什么问题？',
    options: [
      'A) 前提是错误的',
      'B) 存在逻辑谬误，努力工作不是成功的充分条件',
      'C) 结论太过绝对',
      'D) 以上都是',
    ],
    answer: 1,
    explanation: '这是一个"肯定后件"的逻辑谬误。"所有A都B"不等于"所有B都是A"。努力工作可能是成功的必要条件，但不是充分条件——努力不一定保证成功。',
  },

  // ============================================================
  //  💡 在这里添加你的新题目！
  //  复制上面的格式，注意：
  //  - id 必须是唯一的数字
  //  - subject: 'math' 或 'reading'
  //  - difficulty: 'easy', 'medium', 或 'hard'
  //  - answer 是正确选项的索引（0=第一个, 1=第二个, 2=第三个, 3=第四个）
  // ============================================================

]

export default questions

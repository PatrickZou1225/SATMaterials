# SAT Prep 后端建设

## 已完成：第一批，账号基础

- 学生使用邮箱注册和登录，注册账号默认是 `student`。
- 老师账号需要在数据库中明确授权，注册表单不能自行选择老师身份。
- `profiles` 表启用行级权限：学生只能读取自己的资料，老师可以读取学生资料。学生只能修改自己的显示名称，不能修改角色。
- 配置 Supabase 前，网站继续使用原有访问密码；配置后切换为个人账号登录。

2026-09-18 已创建 Supabase 项目并执行账号迁移。已核对 `profiles`、两条权限规则和两个 Auth 触发器存在。公开认证接口正常，邮箱注册已启用且需要邮件验证。项目 URL 和 publishable key 已写入本机不提交的 `.env.local`，本地构建通过。Vercel `sat-materials` 的 Production 和 Preview 已配置两个公开连接变量，仍需部署新版代码才能生效。

## 启用步骤

1. 创建 Supabase 项目，并在 SQL Editor 执行 `supabase/migrations/20260918000000_accounts.sql`。
2. 从项目的 Connect 页面取得 Project URL 和 publishable key，复制 `.env.example` 为 `.env.local` 并填入。只使用 publishable key，绝不把 service role key 放入 `VITE_` 变量。
3. 邮箱注册和验证已经启用。Auth → URL Configuration 的 Site URL 设为 `https://www.satpreppatrick.com/`，将 `https://www.satpreppatrick.com/**` 和 `http://localhost:5173/**` 加入 Redirect URLs。先在本地注册一个老师账号。
4. 在 SQL Editor 中将该账号授权为老师（将下方邮箱换成老师注册用的邮箱）：

   ```sql
   update public.profiles
   set role = 'teacher'
   where email = 'teacher@example.com';
   ```

5. Vercel 的 `sat-materials` 项目已为 Production 填入相同的两个 `VITE_` 值。推送新版代码后会触发部署。正式网站域名是 `https://www.satpreppatrick.com/`。不要把 `.env.local` 提交到 Git。

目前本地代码尚未推送，线上域名仍运行旧版网站。已从远端 `main` 创建独立的 `backend-phase1` 分支，避免把本地 `main` 的其他未推送提交一起发布。下一步是推送该分支，先验收预览部署，再合并到 `main` 发布正式站。

## 下一批

已完成第二批本地代码：新增作业、指定学生、稳定题目键、提交记录和逐题答案的数据表与行级权限，并新增“作业”页面。老师可填写标题、说明和截止时间并选择学生，学生只能查看分配给自己的已发布作业。

上线前需在 Supabase SQL Editor 执行 `supabase/migrations/20260919000000_assignments.sql`。下一步是在老师端加入题目选择器，在学生端接入答题、交卷和自动判分，再补充老师端错题详情。

2026-09-19 已查看 Veritas 教师后台的信息架构，确认目标应从单一作业页扩展为“学员档案、班级、题库、作业、提交、统计”的教学闭环。详细范围和实施顺序见 `docs/veritas-backend-blueprint.md`。下一步优先补班级和成员模型，再改造作业发布器支持按班级布置。

Veritas 目前只作为流程参考。直接同步其数据需要正式接口及相应授权，尚未验证。

## 2026-09-30：模拟考改为服务端判分（安全修复）

学生端原本自己算分，并把结果直接写进 `correct_count` / `is_correct`；而 `supabase/migrations/20260926000001_attempts.sql:66,69` 恰好把这两列授予了 `authenticated`。任何登录学生只要发一条 REST 请求就能伪造满分，老师在「学员监控」看到的成绩因此不可信。

现在判分全部在数据库里完成：

- 新增 `public.answer_keys`（2567 题 / 48 套）。无策略、无授权，客户端读不到。
- 写入 `attempt_answers` 时由触发器推导 `is_correct`，客户端的值会被覆盖。
- 交卷时由触发器计算 `correct_count`；分母 `total_questions` 取自答案键而不是客户端上报，所以**跳题不会拉高正确率**（之前上报 `total=1` 可造出 100%）。
- 收回客户端对 `correct_count`、`is_correct`、`total_questions` 的写权限。

### 上线步骤（必须做，否则模拟考不再记分）

1. Supabase 控制台 → **SQL Editor** → 粘贴 `supabase/migrations/20260930000000_attempt_grading.sql` 全文并执行。
2. 然后推送前端代码（Vercel 自动部署）。**两者之间约 1-2 分钟内模拟考成绩会写入失败，属正常**。
3. 验证：用学生账号做一套模考 → 老师端 `/monitor` 应显示分数，且分数等于实际答对题数。

### 已知残留

正确答案仍然随前端 bundle 一起下发（`src/data/mockTestQuestions.ts` 的 `answer` 字段），所以有心的学生仍可先读答案再提交。要做到真正防作弊，需要把 `answer` 从客户端数据里拿掉、改为交卷后通过 RPC 取回解析（结果页本来就在交卷后才展示对错，改动是可行的，只是要重排 `MockTest.tsx` 的结果页）。留作后续。

答案键由 `node scripts/generate-answer-key.mjs` 生成（用 Vite 的 SSR 加载器读 TS 数据）。**新增套题后必须重新运行该脚本并重新应用迁移**，否则新题在判分时会被当作答错。

# SAT Prep 后端建设

## 已完成：第一批，账号基础

- 学生使用邮箱注册和登录，注册账号默认是 `student`。
- 老师账号需要在数据库中明确授权，注册表单不能自行选择老师身份。
- `profiles` 表启用行级权限：学生只能读取自己的资料，老师可以读取学生资料。学生只能修改自己的显示名称，不能修改角色。
- 配置 Supabase 前，网站继续使用原有访问密码；配置后切换为个人账号登录。

2026-09-18 已创建 Supabase 项目并执行账号迁移。已核对 `profiles`、两条权限规则和两个 Auth 触发器存在。公开认证接口正常，邮箱注册已启用且需要邮件验证。项目 URL 和 publishable key 已写入本机不提交的 `.env.local`，本地构建通过。正式站尚未配置环境变量或部署新版。

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

5. 在 Vercel 的 `sat-materials` 项目中为 Production 填入相同的两个 `VITE_` 值，然后重新部署。正式网站域名是 `https://www.satpreppatrick.com/`。不要把 `.env.local` 提交到 Git。

目前本地代码尚未推送，线上域名仍运行旧版网站。启用前先完成数据库迁移、账号注册和本地验证，再推送与部署，避免线上出现无法登录的页面。

## 下一批

建立作业、指定学生、提交记录和逐题答案的数据表，接入现有题库的稳定题目 ID。老师可布置作业，学生可查看自己的待完成作业。再下一批接入交卷、自动判分和老师端错题详情。

Veritas 目前只作为流程参考。直接同步其数据需要正式接口及相应授权，尚未验证。

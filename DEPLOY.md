# 「听懂世界」公开发布指南

## 1. 内容版权先处理

当前 `public/audio` 约 358MB，来源为 YouTube 节目。个人学习下载不等于获得公开传播授权。公开版不要把这些音频提交到 GitHub 或部署平台。

可选方案：

1. 使用 YouTube IFrame 官方播放器，网页只保存学习标注和独立转写。
2. 向播客方取得音频及转写授权。
3. 使用自有或 Creative Commons 内容，并核对具体许可条款。

如果使用已授权音频，把文件上传到 Cloudflare R2，并将 `public/data.js` 中每期的 `audio` 地址替换成公开 HTTPS 地址。

## 2. 创建 Supabase

1. 在 Supabase 创建新项目。
2. 打开 SQL Editor，完整运行 `supabase/schema.sql`。
3. 在 Authentication → URL Configuration 中填写正式域名。
4. 复制 Project URL 和 anon public key。不要使用 service role key。

## 3. 上传 GitHub

项目已经通过 `.gitignore` 排除了本地音频、原始词典仓库和日志。

```powershell
cd C:\Users\HP\EnglishPodcastLearner
git init
git add .
git commit -m "Build public Hear the World MVP"
git branch -M main
git remote add origin 你的GitHub仓库地址
git push -u origin main
```

## 4. 部署 Render

1. 登录 Render，选择 New → Blueprint。
2. 连接 GitHub 仓库；Render 会读取 `render.yaml`。
3. 添加环境变量：`SUPABASE_URL`、`SUPABASE_ANON_KEY`。
4. 部署完成后，将 Render 域名填回 Supabase 的 Site URL 和 Redirect URLs。

## 5. 上线前必须补齐

- 用户协议、隐私政策、版权投诉入口。
- 评论举报、屏蔽、管理员审核和发布频率限制。
- 数据删除与注销账号功能。
- AI 故事生成的每日限额、失败重试和内容安全审核。
- 正式域名、HTTPS、错误监控和数据库备份。

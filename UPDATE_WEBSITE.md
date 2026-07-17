# 网站发布后的更新方法

## 普通页面和功能更新

在本机修改并测试完成后，运行：

```powershell
cd C:\Users\HP\EnglishPodcastLearner
git add .
git commit -m "描述本次更新内容"
git push
```

如果 Render 已连接 GitHub，收到新的 `git push` 后会自动重新部署。通常几分钟后正式网站就会更新。旧用户的生词、故事和评论保存在 Supabase，不会因重新部署丢失。

## 更新播客内容

1. 在 `public/data.js` 添加或修改节目资料。
2. 将转写 JSON 放入 `public/transcripts`。
3. 自有或已授权的音频上传到对象存储，将音频 HTTPS 地址写入节目数据。
4. 本地运行 `npm test`。
5. 提交并推送 GitHub。

不要把未取得公开传播授权的 YouTube 下载音频提交到 GitHub。

## 修改数据库

新增字段或数据表时，不要直接修改已上线的历史结构：

1. 在 `supabase/migrations` 新建带日期的 SQL 文件。
2. 先在 Supabase 测试项目运行。
3. 确认数据和权限策略正确后，再在正式项目运行。
4. 随代码一起提交迁移文件。

普通网页更新不需要重新执行 `supabase/schema.sql`。

## 回滚错误版本

在 GitHub 或 Render 中找到上一个正常部署，选择重新部署；或者在本机创建一次反向修改并重新 `git push`。不要用 `git reset --hard` 删除尚未备份的内容。

## 推荐发布节奏

- 内容更新：每周一次，批量上新节目。
- 小功能与文案：随时发布。
- 数据库结构：低流量时段发布，并提前备份。
- 大功能：先部署测试环境，确认登录、支付、评论和移动端均正常后再上线。

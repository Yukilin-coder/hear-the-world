# Signal — English Podcast Learner

个人使用的播客英语精听网页。包含 10 期最近两周节目、音频播放器、双语学习导读、点击查词、生词本、背诵段落和蒙版精听模式。

## 启动

在 PowerShell 中运行：

```powershell
cd C:\Users\HP\EnglishPodcastLearner
npm start
```

浏览器打开：`http://127.0.0.1:4173`

## 内容状态

- `public/audio`：私人学习音频目录
- 页面中的三段中英内容是 AI 学习导读，用于验证交互，不冒充逐字转写
- 完整独立 ASR 转写仍需要安装或配置 Whisper 服务后批量处理
- 第三方音频和完整文本请勿把本地服务暴露到公网


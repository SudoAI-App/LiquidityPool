# Agent Guidelines & Engineering Standards (LiquidityPool)

This document establishes mandatory operational rules, deployment constraints, and SEO maintenance protocols for AI agents working in this repository.

---

## 1. 部署与 CI/CD 核心禁令 (Deployment & CI/CD Directive)

- **严禁本地手动部署**：
  - **切勿在本地终端运行 `wrangler deploy`、`wrangler pages deploy` 或任何直接上传命令**。
  - 所有生产部署必须**严格通过 Git 推送至 GitHub `main` 分支**，由 Cloudflare CI（Cloudflare Workers / Pages Builds）自动拉取、构建和发布上线。
- **原因与约束**：
  1. 确保 Git 仓库分支是生产运行状态的唯一事实来源（Single Source of Truth）。
  2. 防止本地未提交代码、临时文件或工作区差异导致环境污染。
  3. 保留 Cloudflare Dashboard 中完整的提交哈希（Commit SHA）、构建日志与回滚点。

---

## 2. 内容质量审计要求 (Content Quality Floor)

在提交任何新指南或修改前，必须运行：
```bash
pnpm content:audit
```
每次审查标准：
- 每篇指南字数不少于 1,300 词。
- 必须包含：审核日期（lastReviewed）、权威信源清单、上下文内部链接、相关配套图表与教育性风险提示。

---

## 3. SEO 与索引规范 (SEO & Indexing Protocol)

- **站点地图同步**：新增或修改路由时，需确保 [`src/pages/sitemap.xml.ts`](./src/pages/sitemap.xml.ts) 与 `sitemap-index.xml` 同步覆盖，保持全站 URL 100% 可被检索。
- **AI 搜寻开放**：保持 `robots.txt.ts` 对主流 AI 爬虫（GPTBot, ClaudeBot, PerplexityBot 等）的放行规则。
- **全网即时推送**：部署后通过 `pnpm indexnow` 广播全量路由。

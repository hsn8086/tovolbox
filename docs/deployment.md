# TovolBox 部署文档

本文档记录 TovolBox 当前的 Cloudflare Pages 部署方式和验证流程。

## 线上环境

- Cloudflare Pages 项目名：`tovolbox`
- 正式域名：`https://tovolbox.hsn8086.com`
- 默认 Pages 域名：`https://tovolbox.pages.dev`
- GitHub 仓库：`https://github.com/hsn8086/tovolbox`
- 主分支：`main`

## 构建配置

- Runtime：Node.js `22`
- 构建命令：`npm run build`
- 输出目录：`dist`
- Astro 输出模式：静态输出

## 本地验证

完整交付前执行：

```bash
npm run verify
```

该命令会依次执行：

- `npm run test`
- `npm run check`
- `npm run build`
- `npm run test:e2e`

如需分步骤定位问题，可单独运行：

```bash
npm run test
npm run check
npm run build
npm run test:e2e
```

## 手动部署

当前使用 Wrangler 手动部署到 Cloudflare Pages：

```bash
npm run deploy
```

该命令会执行：

```bash
npm run build && bunx wrangler@4.90.0 pages deploy dist --project-name=tovolbox --branch=main
```

注意事项：

- Wrangler token 或 Cloudflare API token 不得提交到仓库。
- 如果本地没有登录 Cloudflare，先通过 Wrangler 完成认证。
- `wrangler` 可以通过 `bunx wrangler@4.90.0` 临时调用，不需要把 Wrangler 加入项目依赖。
- 部署时若工作区有未提交改动，Wrangler 会提示 dirty working directory，这是提示而不是失败。

## GitHub Actions CI

仓库包含 `.github/workflows/ci.yml`，在以下场景运行：

- push 到 `main`
- pull request 到 `main`

CI 使用 Node.js `22`，执行：

- `npm ci`
- `npx playwright install --with-deps chromium`
- `npm run test`
- `npm run check`
- `npm run build`
- `npm run test:e2e`

CI 仅验证，不自动部署。

## Cloudflare Pages Git 自动部署

当前项目仍以手动 Wrangler 部署为主。如需改为 Cloudflare Pages Git 自动部署，应在 Cloudflare Pages 控制台绑定 GitHub 仓库，并使用以下配置：

- Production branch：`main`
- Build command：`npm run build`
- Build output directory：`dist`
- Node.js version：`22`

如果启用 Git 自动部署，需要确保与手动 `npm run deploy` 的流程不会互相混淆，并在本文档中更新部署方式。

## 线上抽查清单

部署后至少抽查：

- `https://tovolbox.hsn8086.com/` 返回 `200`
- `https://tovolbox.hsn8086.com/sitemap.xml` 返回 `200`，URL 使用正式域名
- `https://tovolbox.hsn8086.com/robots.txt` 返回 `200`，包含 sitemap
- `https://tovolbox.hsn8086.com/en/tools/json-formatter/` 返回 `302` 到 `/tools/json-formatter/`
- `https://tovolbox.hsn8086.com/favicon.ico` 返回 `200`
- 一个交互工具页可正常 hydrate，例如 `https://tovolbox.hsn8086.com/tools/image-brightness-adjuster/`

## 回滚策略

如部署后发现严重问题：

- 优先在 Cloudflare Pages 控制台回滚到上一个可用部署。
- 本地修复后重新执行 `npm run verify`。
- 验证通过后再执行 `npm run deploy`。

不要使用 `git reset --hard` 或强制推送来回滚线上问题，除非已明确评估风险并获得确认。

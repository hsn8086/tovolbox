# TovolBox 执行路线图

本文档记录 TovolBox 从当前可上线版本继续推进到稳定、可扩展、SEO 质量更高的工具站的执行计划。所有阶段都应按最小正确变更推进，并在每轮交付前完成验证。

## 当前基线

- 正式域名：`https://tovolbox.hsn8086.com`
- Cloudflare Pages 项目：`tovolbox`
- GitHub 仓库：`https://github.com/hsn8086/tovolbox`
- 技术栈：Astro、TypeScript、React islands、静态输出到 `dist`
- 语言：`en`、`zh-CN`、`zh-TW`、`ja`、`ko`、`es`、`fr`、`de`、`pt`、`ru`、`ar`
- 默认英文使用无前缀 URL；`/en/*` 需要重定向到无前缀路径
- 当前完整验证命令：`npm run verify`
- 当前手动部署命令：`npm run deploy`

## 当前未提交事项

- `package.json` 新增 `verify` 和 `deploy` 脚本。
- `public/_redirects` 已修复 `/en/*` 通用重定向，并补 `/favicon.ico` 到 `/favicon.svg` 的兼容重写。
- `src/components/SeoHead.astro` 已显式声明 SVG favicon。
- 正式域抽查已确认：`/en/tools/json-formatter/` 返回 `302`，`/favicon.ico` 返回 `200`，图片工具页 React island 正常 hydrate。

## 阶段 0：保存当前成果

目标：把当前线上修复入库，避免后续工作丢失。

任务：

- 检查当前 diff，只包含预期文件。
- 提交 `package.json`、`public/_redirects`、`src/components/SeoHead.astro`。
- 推送到 `origin/main`。
- 确认正式域 `/en/tools/json-formatter/` 仍返回 `302` 到 `/tools/json-formatter/`。

验收标准：

- GitHub `main` 包含当前修复。
- 本地 `git status` 干净。
- 正式域重定向和 favicon 均正常。

## 阶段 1：建立 CI

目标：每次 push 或 PR 都自动验证，防止坏版本进入主分支。

任务：

- 新增 `.github/workflows/ci.yml`。
- 使用 Node.js `22`。
- 执行 `npm ci`。
- 安装 Playwright Chromium。
- 执行 `npm run test`。
- 执行 `npm run check`。
- 执行 `npm run build`。
- 执行 `npm run test:e2e`。
- 为 npm 依赖增加缓存。

验收标准：

- GitHub Actions 首次运行通过。
- push 到 `main` 和 PR 都会触发 CI。
- CI 失败时能阻止明显破坏进入主分支。

## 阶段 2：整理部署流程

目标：让部署步骤可复现、可交接。

任务：

- 新增 `docs/deployment.md`。
- 记录 Cloudflare Pages 项目名、正式域名、默认 Pages 域名、构建命令、输出目录、Node 版本。
- 记录当前手动部署命令 `npm run deploy`。
- 说明 Wrangler token 不入库。
- 评估是否接入 Cloudflare Pages Git 自动部署。

验收标准：

- 只看 `docs/deployment.md` 即可完成部署。
- `npm run deploy` 可重复执行。
- 密钥和 token 不进入仓库。

## 阶段 3：补强测试体系

目标：让多语言路由、SEO、工具注册和核心交互都有自动保护。

任务：

- 增加移动端 E2E，覆盖首页、搜索页、工具页和 `/ar/` RTL 页面。
- 增加 canonical、hreflang、`x-default`、默认英文无前缀的单元测试。
- 增加 sitemap 测试，确认不包含 `/en/*`。
- 增加 `_redirects` 规则测试，覆盖 `/en/`、`/en/search/`、`/en/tools/json-formatter/`、`/favicon.ico`。
- 增加工具注册测试，确认专用工具能被 `ToolRegistry` 正确分发，未知工具 fallback 到 `GenericTool`。

验收标准：

- `npm run verify` 覆盖核心路由、SEO、搜索和交互。
- 修改路由或 SEO helper 时，测试能及时发现回归。
- 移动端基础布局通过 E2E。

## 阶段 4：优先专用化高价值工具

目标：减少 GenericTool，提高工具真实可用性和搜索转化。

优先级 1：SEO 工具

- `utm-builder`：支持 URL、source、medium、campaign、term、content，处理已有 query 和编码。
- `canonical-tag-generator`：输出 canonical link 标签，提示无效 URL。
- `hreflang-tag-generator`：输出多语言 alternate link，支持 `x-default`。
- `robots-txt-generator`：支持 allow、disallow、sitemap。
- `faq-schema-generator`：输出 FAQPage JSON-LD。
- `breadcrumb-schema-generator`：输出 BreadcrumbList JSON-LD。

优先级 2：计算器工具

- `percentage-calculator`
- `percentage-change-calculator`
- `discount-calculator`
- `loan-payment-calculator`
- `compound-interest-calculator`

优先级 3：开发工具

- `regex-tester`：支持 pattern、flags、测试文本、匹配数、捕获组。
- `cron-expression-explainer`：支持表达式解释和未来运行样例。
- `number-base-converter`：支持二进制、八进制、十进制、十六进制互转。

验收标准：

- 至少 15 个高价值工具从 GenericTool 升级为专用 UI。
- 每个专用工具都有纯函数测试。
- E2E 覆盖至少 5 个代表性专用工具。

## 阶段 5：继续升级图片工具

目标：把图片工具做成站点差异化亮点，并持续保持本地处理和隐私优势。

任务：

- 上传后显示文件名、MIME 类型、原始尺寸和文件大小。
- 处理后显示输出尺寸、输出格式和预计文件大小。
- 支持 PNG、JPEG、WebP 输出。
- 支持 JPEG 和 WebP quality 控制。
- 增强 resize，支持宽高输入、保持比例和 fit 模式。
- 增强 crop，支持自定义比例和手动区域。
- 增强 watermark，支持位置、字体大小、颜色、透明度。
- 增加 `tests/fixtures/sample.png` 和 `tests/fixtures/sample.jpg`。
- 增加真实上传 fixture 的 E2E。

验收标准：

- 图片工具可处理真实 fixture。
- 参数变化后 canvas 结果会刷新。
- 下载按钮状态正确。
- 页面明确说明图片不会上传。

## 阶段 6：搜索体验升级

目标：让用户更快找到工具。

任务：

- 增加分类过滤。
- 增加 tag chips。
- 增加热门工具区。
- 增加最近新增工具区。
- 增加无结果推荐。
- 支持 `/` 快捷键聚焦搜索框。
- 优化搜索索引字段，包含 category、tags、keywords、localized title、localized description。
- 增加英文、中文、tag、分类、无结果状态测试。

验收标准：

- 搜索 `json`、`image`、`seo`、`心理` 都能返回合理结果。
- 移动端搜索可用。
- 搜索索引仍按 locale 独立加载。

## 阶段 7：SEO 内容增强

目标：提高可索引质量，减少薄页面和模板化页面。

任务：

- 为核心工具页补充更具体的使用场景、输入说明、输出说明、隐私说明、常见错误和 FAQ。
- 为分类页补充分类介绍和内部链接。
- 优化相关工具推荐。
- 审查 title 唯一性和长度。
- 审查 meta description 唯一性和用途表达。
- 审查 WebApplication、BreadcrumbList、FAQPage、Organization 等结构化数据。

验收标准：

- 核心工具页不再明显依赖通用模板文案。
- sitemap 全部 URL 使用正式域。
- canonical 和 hreflang 均指向正确语言路径。
- `/en/*` 不出现在 sitemap。

## 阶段 8：多语言质量提升

目标：将重点语言从 fallback 文案提升到更自然的本地化内容。

语言优先级：

- `en`
- `zh-CN`
- `zh-TW`
- `ja`
- `ko`
- `es`
- `fr`
- `de`
- `pt`
- `ru`
- `ar`

任务：

- 优先优化首页、分类页、20 个核心工具页、搜索页、隐私页和心理测试免责声明。
- `zh-CN` 和 `zh-TW` 独立维护，不做简单字符转换。
- 检查 `/ar/` RTL 布局。
- 心理相关内容保持非临床、自我反思定位。
- MMPI 和 SCL-90 继续只做介绍页，不提供正式测试、原题、评分和解释体系。

验收标准：

- 核心页面不再明显是英文 fallback。
- `ar` 页面方向正确。
- 心理相关页面没有诊断、治疗或临床承诺。

## 阶段 9：隐私、安全和合规

目标：保证工具站可信，尤其是本地处理工具、文件工具和心理测试。

任务：

- 完善隐私页，说明工具输入默认本地处理。
- 明确如果未来启用 analytics，不采集工具输入内容。
- 统一心理测试免责声明。
- 在图片、文本、JSON、编码、哈希、心理工具中统一显示隐私提示。
- 审查 `npm audit` 的 moderate vulnerabilities，逐项判断，不盲目 `--force`。
- 检查安全 headers，必要时评估 CSP。

验收标准：

- 隐私声明和实际行为一致。
- 用户输入不会被发送到远端。
- 依赖风险有记录和处理策略。

## 阶段 10：性能优化

目标：保持 1000+ 静态页的快速访问，避免 React islands 过度加载。

任务：

- 分析 JS bundle 大小。
- 确认普通内容页不加载工具相关大逻辑。
- 图片工具相关逻辑只在图片工具页加载。
- 优化搜索索引大小，保持每个 locale 独立 JSON。
- Lighthouse 抽查首页、搜索页、JSON formatter、图片工具页和心理测试页。
- 优化 LCP、CLS、TBT。

验收标准：

- 首页 JS 体积小。
- 搜索和工具页交互延迟可接受。
- 移动端 Lighthouse 无明显红项。

## 阶段 11：UI 组件抽象

目标：减少重复 JSX，让新增工具更快更稳。

候选抽象：

- `ToolPanel`
- `Field`
- `OutputBox`
- `CopyButton`
- `ButtonRow`
- `SegmentedControl`
- `FileDropzone`
- `ResultCard`
- `ErrorMessage`
- `PrivacyNote`

执行原则：

- 不一次性大重构。
- 每专用化 3 到 5 个工具后再抽取真实重复部分。
- 不为了抽象而抽象。

验收标准：

- 新增简单专用工具不需要复制大量 JSX。
- 现有工具行为不变。
- 组件命名清晰，测试维护成本不增加。

## 阶段 12：内容和工具扩张

目标：继续扩充工具数量，但优先保证质量。

候选新增工具：

- URL parser
- YAML to JSON
- JSON to YAML
- XML formatter
- HTML formatter
- CSS formatter
- Diff checker
- Lorem ipsum generator
- QR code generator
- QR code reader
- EXIF viewer
- Image compressor
- PDF page counter
- PDF metadata viewer
- CSV delimiter converter
- Markdown previewer

新增流程：

- 先写纯函数。
- 再写单元测试。
- 再接入 React 工具组件。
- 再补 `src/data/content.ts` 的 SEO 内容。
- 再跑 `npm run verify`。
- 最后部署。

验收标准：

- 新工具不是空壳。
- 每个工具至少有基础测试。
- 搜索、分类、sitemap 自动包含新工具。

## 阶段 13：观察和数据

目标：了解页面级使用情况，但不侵犯用户输入隐私。

任务：

- 评估 Cloudflare Web Analytics。
- 如果启用，只采集页面级指标。
- 不采集文本框内容、图片、JSON、心理问卷答案。
- 不接入会话录屏类工具。
- 同步更新隐私页。

验收标准：

- analytics 配置有文档。
- 隐私页和实际采集行为一致。
- 用户工具输入不会被采集。

## 阶段 14：未来 Worker 能力

目标：在确实需要服务端能力时再引入 Workers，不提前增加复杂度。

适合 Worker 的工具：

- HTTP header checker
- DNS lookup
- WHOIS lookup
- Website status checker
- Open Graph remote preview
- URL screenshot preview
- Robots.txt remote fetch
- Sitemap validator

引入条件：

- 静态前端无法完成。
- 有明确用户价值。
- 有速率限制和错误处理。
- 不影响当前纯静态工具稳定性。

验收标准：

- Worker 和静态站职责分离。
- API 有限流。
- 错误提示清楚。
- 不把敏感输入写日志。

## 推荐执行顺序

1. 提交并推送当前 3 个文件修复。
2. 新增 GitHub Actions CI。
3. 新增 `docs/deployment.md`。
4. 补 SEO、routing、sitemap、redirect 单元测试。
5. 专用化第一批 SEO 工具：UTM、canonical、hreflang、robots。
6. 专用化第一批计算器：percentage、discount、loan、compound interest。
7. 升级图片工具：输出格式、quality、文件信息。
8. 升级搜索：分类过滤、tag chips、热门工具。
9. 提升核心 20 个工具页的英文、简中、繁中内容质量。
10. 做 Lighthouse 和 `npm audit` 审查。

## 每轮交付标准

每一轮开发都应按以下流程收尾：

1. `npm run test`
2. `npm run check`
3. `npm run build`
4. `npm run test:e2e`
5. `npm run deploy`
6. 抽查正式域核心页面
7. 确认 `git status`
8. 提交并推送

如果改动只涉及文档，可以不执行完整部署，但仍应至少检查文档 diff 并确认没有误改源码。

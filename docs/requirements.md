# TovolBox 静态 Web 工具大全需求文档

## 1. 项目定位

TovolBox 是一个面向全球用户的多语言静态 Web 工具大全站点，覆盖开发者工具、SEO 工具、文本工具、图像编辑、格式转换、计算器、生成器、心理学测试与自我了解工具等场景。

核心目标：

- 提供尽可能丰富、可直接在浏览器中使用的免费工具。
- 以静态页面为主，适配 Cloudflare Pages 部署。
- 对每个语言、每个分类、每个工具页面做独立 SEO 优化。
- 工具尽量本地运行，减少数据上传，突出隐私与速度。
- 用统一的数据模型和工具模板支持长期扩展。

## 2. 技术选型

### 2.1 框架

- Astro
- TypeScript
- React islands，用于工具交互区域
- Tailwind CSS
- shadcn/ui 风格组件
- Radix UI primitives
- lucide-react 图标

### 2.2 部署

- Cloudflare Pages
- 第一版使用纯静态输出
- 构建输出目录：`dist`
- 构建命令：`npm run build`
- Node.js 版本建议：22

后续如果需要服务端能力，再考虑 Cloudflare Workers，例如：

- DNS 查询
- WHOIS 查询
- 网页 SEO 实时分析
- HTTP Header 检查
- 远程网页抓取
- AI 或图像模型能力

### 2.3 控件库

使用 shadcn/ui 风格组件，第一版优先引入：

- Button
- Input
- Textarea
- Select
- Tabs
- Card
- Badge
- Accordion
- Dialog
- Dropdown Menu
- Command
- Tooltip
- Switch
- Slider
- Separator
- Toast 或 Sonner

原则：

- 不一次性引入所有组件。
- 工具页优先复用同一套输入、输出、复制、下载、错误提示组件。
- 大多数页面保持静态 HTML，只有工具交互区域加载 React。

## 3. 多语言策略

### 3.1 支持语言

第一版支持 11 种语言：

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

### 3.2 默认语言

默认语言为英文 `en`，英文页面使用无前缀 URL。

示例：

```text
/
/tools/json-formatter/
/categories/developer-tools/
/search/
```

其他语言使用 locale 前缀。

示例：

```text
/zh-CN/
/zh-CN/tools/json-formatter/
/zh-TW/tools/json-formatter/
/ja/tools/json-formatter/
```

### 3.3 中文策略

简体中文和繁体中文必须分别维护：

- `zh-CN`：简体中文，使用大陆常见表达。
- `zh-TW`：繁体中文，使用台湾/繁中常见表达。

用词区别示例：

| zh-CN | zh-TW |
| --- | --- |
| 在线 | 線上 |
| 软件 | 軟體 |
| 信息 | 資訊 |
| 数据 | 資料 |
| 默认 | 預設 |
| 生成 | 產生 |
| 搜索 | 搜尋 |
| 视频 | 影片 |
| 字符 | 字元 |
| 复制 | 複製 |

### 3.4 RTL 支持

阿拉伯语页面：

- `html lang="ar"`
- `dir="rtl"`
- 需要单独测试布局方向、表单、导航和工具输出区域。

## 4. SEO 需求

### 4.1 基础 SEO

每个页面都必须生成：

- 唯一 `title`
- 唯一 `meta description`
- 唯一 H1
- `canonical`
- `hreflang`
- `x-default`
- Open Graph tags
- Twitter Card tags
- JSON-LD 结构化数据
- 面包屑
- 内部链接

### 4.2 Canonical 规则

英文默认页面不使用 `/en` 前缀。

示例：

```text
/
canonical: https://domain.com/

/tools/json-formatter/
canonical: https://domain.com/tools/json-formatter/

/zh-CN/tools/json-formatter/
canonical: https://domain.com/zh-CN/tools/json-formatter/
```

如果存在 `/en/*` 路径，必须重定向到无前缀英文路径，避免重复页面。

### 4.3 Hreflang 规则

每个多语言页面都需要输出所有语言版本。

示例：

```html
<link rel="alternate" hreflang="x-default" href="https://domain.com/tools/json-formatter/" />
<link rel="alternate" hreflang="en" href="https://domain.com/tools/json-formatter/" />
<link rel="alternate" hreflang="zh-CN" href="https://domain.com/zh-CN/tools/json-formatter/" />
<link rel="alternate" hreflang="zh-TW" href="https://domain.com/zh-TW/tools/json-formatter/" />
<link rel="alternate" hreflang="ja" href="https://domain.com/ja/tools/json-formatter/" />
```

### 4.4 结构化数据

页面类型与 JSON-LD：

- 首页：`WebSite`
- 分类页：`CollectionPage`
- 工具页：`SoftwareApplication` 或 `WebApplication`
- FAQ：`FAQPage`
- 面包屑：`BreadcrumbList`
- 心理学介绍页：优先使用 `Article`，避免暗示医疗诊断工具

### 4.5 Sitemap

需要生成：

```text
/sitemap.xml
/sitemaps/sitemap-en.xml
/sitemaps/sitemap-zh-CN.xml
/sitemaps/sitemap-zh-TW.xml
/sitemaps/sitemap-ja.xml
...
```

`/sitemap.xml` 作为 sitemap index。

每个语言 sitemap 应包含当前语言 URL，并尽量包含 alternate 信息。

### 4.6 Robots

需要提供 `robots.txt`，至少包含：

```text
User-agent: *
Allow: /

Sitemap: https://domain.com/sitemap.xml
```

### 4.7 内容 SEO

每个工具页至少包含：

- 工具名称
- 简短介绍
- 工具交互区
- 使用方法
- 示例输入
- 示例输出
- 常见使用场景
- FAQ
- 相关工具
- 所属分类
- 隐私说明，尤其是文件、图片、心理测试类工具

重点工具页需要更长内容：

- 技术说明
- 常见错误
- 最佳实践
- 相关格式说明
- 多语言本地化关键词

### 4.8 质量要求

- 不做空页面。
- 不做只有标题和按钮的薄内容页面。
- 不批量生成低质量机器翻译页面。
- 每种语言页面都需要独立 title、description、H1 和正文表达。
- 工具页与分类页必须有内部链接网络。

## 5. 信息架构

### 5.1 主要页面

```text
/
/search/
/categories/
/categories/[slug]/
/tools/[slug]/
/about/
/privacy/
/terms/
/contact/
```

其他语言：

```text
/zh-CN/
/zh-CN/search/
/zh-CN/categories/
/zh-CN/categories/[slug]/
/zh-CN/tools/[slug]/
```

### 5.2 首页模块

- Header
- Hero
- 全站搜索
- 热门工具
- 工具分类
- 最新工具
- 图像工具专区
- SEO 工具专区
- 心理学测试专区
- 所有工具入口
- FAQ
- Footer

### 5.3 工具页模块

- Breadcrumb
- H1
- SEO 描述
- 工具交互区
- 隐私提示
- 使用方法
- 示例
- 结果解释
- FAQ
- 相关工具
- 相关分类

### 5.4 分类页模块

- 分类 H1
- 分类介绍
- 子分类
- 工具列表
- 热门工具
- 相关分类
- FAQ
- 长尾 SEO 内容

## 6. 分类规划

第一版建议支持以下一级分类：

- Developer Tools
- JSON / Data Tools
- Encoding & Decoding Tools
- Text Tools
- SEO Tools
- Web & Browser Tools
- HTML / CSS / JS Tools
- Markdown Tools
- Regex Tools
- Color Tools
- Image Tools
- SVG Tools
- Converter Tools
- Calculator Tools
- Date & Time Tools
- Crypto & Hash Tools
- Generator Tools
- Network Tools
- Security Tools
- File Tools
- Productivity Tools
- Personality Tests
- Psychology Quizzes
- Clinical Assessment Guides
- Career Tools
- Education Tools
- Health & Lifestyle Tools
- Social Media Tools
- Email Tools
- QR & Barcode Tools
- PDF & Document Tools
- Math Tools
- Finance Tools
- Geo Tools
- Accessibility Tools
- AI Prompt Tools

## 7. 工具范围

### 7.1 第一版目标

建议第一版目标：

- 11 种语言
- 35 个左右分类页
- 200 个以上工具或内容页
- 100 到 120 个真实可用工具
- 50 个重点 SEO 长内容页面
- 其余页面至少包含基础说明、FAQ、相关工具和明确状态

### 7.2 第一版优先真实实现工具

开发与数据：

- JSON Formatter
- JSON Minifier
- JSON Validator
- JSON Sorter
- JSON Escape
- JSON Unescape
- JSON to YAML
- YAML to JSON
- JSON to CSV
- CSV to JSON
- XML Formatter
- XML Minifier
- XML to JSON
- Query String Parser
- Query String Builder
- URL Parser
- UUID Generator
- ULID Generator
- Timestamp Converter
- Cron Expression Explainer

编码与解码：

- Base64 Encode
- Base64 Decode
- Base64 URL Encode
- Base64 URL Decode
- URL Encode
- URL Decode
- HTML Entity Encode
- HTML Entity Decode
- Unicode Escape
- Unicode Unescape
- Hex Encode
- Hex Decode
- Binary Encode
- Binary Decode
- ROT13
- Morse Encode
- Morse Decode
- JWT Decode

文本：

- Word Counter
- Character Counter
- Reading Time
- Case Converter
- Slug Generator
- Text Sorter
- Text Deduplicator
- Remove Empty Lines
- Trim Whitespace
- Find and Replace
- Text Reverser
- Extract Emails
- Extract URLs
- Extract Numbers
- Lorem Ipsum Generator

SEO：

- Meta Title Checker
- Meta Description Checker
- SERP Preview
- Open Graph Preview
- Twitter Card Preview
- Canonical Tag Generator
- Hreflang Tag Generator
- Robots.txt Generator
- Sitemap XML Generator
- FAQ Schema Generator
- Breadcrumb Schema Generator
- UTM Builder

颜色与 CSS：

- HEX to RGB
- RGB to HEX
- HEX to HSL
- HSL to HEX
- Color Contrast Checker
- Palette Generator
- Gradient Generator
- CSS Clamp Generator
- Box Shadow Generator
- Border Radius Generator

转换与计算：

- Length Converter
- Weight Converter
- Temperature Converter
- Area Converter
- Volume Converter
- Speed Converter
- Data Size Converter
- Number Base Converter
- Percentage Calculator
- Date Difference Calculator

哈希与生成：

- MD5 Generator
- SHA-1 Generator
- SHA-256 Generator
- SHA-512 Generator
- HMAC Generator
- Password Generator
- Random String Generator
- Random Number Generator
- QR Code Generator
- File Hash Generator

图像与 SVG：

- Image to Base64
- Base64 to Image
- Image Size Checker
- Image Compressor
- Image Resizer
- Image Cropper
- Image Rotate
- Image Flip
- Image Color Picker
- Image Color Extractor
- Image Grayscale Converter
- Image Brightness Adjuster
- Image Contrast Adjuster
- Image Saturation Adjuster
- Add Text Watermark
- Add Image Watermark
- PNG to WebP
- JPG to WebP
- WebP to PNG
- WebP to JPG
- SVG Viewer
- SVG Formatter
- SVG Minifier
- SVG to Data URI
- SVG to JSX

心理与自我了解：

- Big Five Personality Test
- MBTI Style Personality Quiz
- DISC Style Quiz
- Enneagram Style Quiz
- Introvert or Extrovert Test
- Communication Style Test
- Conflict Style Test
- Work Style Test
- Career Interest Test
- Learning Style Quiz
- Productivity Style Test
- Decision Making Style Test
- Emotional Intelligence Quiz
- Stress Level Check-in
- Burnout Risk Check-in
- Sleep Habit Quiz
- Digital Wellbeing Quiz
- Procrastination Reflection
- Emotional Wellbeing Check-in
- Resilience Reflection

## 8. 图像编辑需求

### 8.1 定位

图像编辑是第一版重点分类之一，强调：

- 浏览器本地处理
- 不上传图片
- 快速导出
- 适合 SEO、社交媒体、开发、设计和日常使用

### 8.2 P0 图像工具

- 图片压缩
- 图片尺寸调整
- 图片裁剪
- 图片旋转
- 图片翻转
- 图片转 Base64
- Base64 转图片
- 图片转 Data URI
- Data URI 转图片
- 图片格式检测
- 图片尺寸检测
- 图片文件大小检测
- 图片元信息查看
- 图片颜色提取
- 图片取色器
- 图片转灰度
- 图片模糊
- 图片锐化
- 图片亮度调整
- 图片对比度调整
- 图片饱和度调整
- 图片透明度调整
- 图片圆角生成
- 图片加边框
- 图片添加文字水印
- 图片添加图片水印
- 图片背景颜色替换
- 图片转 WebP
- PNG 转 WebP
- JPG 转 WebP
- WebP 转 PNG
- WebP 转 JPG
- 图片占位图生成器
- Open Graph 图片预览
- 社交媒体图片尺寸检查

### 8.3 P1 图像工具

- 批量图片压缩
- 批量图片尺寸调整
- 图片拼接
- 图片九宫格切图
- 图片圆形裁剪
- 图片马赛克
- 图片局部打码
- 图片滤镜
- 图片黑白滤镜
- 图片复古滤镜
- 图片像素化
- 图片转 ICO
- Favicon 生成器
- App Icon 生成器
- 图片 EXIF 查看
- 图片 EXIF 移除
- 图片主色调提取
- 图片调色板生成
- 图片平均颜色计算
- 图片长宽比计算
- 图片裁剪比例生成器
- 响应式图片 `srcset` 生成器
- HTML `picture` 标签生成器
- 图片 Alt 文本辅助生成页
- 图片转 CSS background

### 8.4 P2 图像工具

- AI 背景移除
- 图片 OCR 文字识别
- 图片超分辨率
- 图片去噪
- 图片修复
- 图片物体移除
- HEIC 转 JPG
- AVIF 转 PNG/JPG
- PDF 转图片
- 图片转 PDF
- 批量图片格式转换
- PSD/AI 文件预览
- 图片相似度检测
- 图片 Diff 对比
- 人像证件照处理
- 抠图
- 老照片修复

### 8.5 技术实现

优先使用：

- Canvas
- FileReader
- Blob
- createImageBitmap
- Web Worker
- OffscreenCanvas，浏览器支持时使用

图像组件建议：

- ImageUploadPanel
- ImagePreview
- ImageExportPanel
- ImageQualitySlider
- ImageDimensionInputs
- CanvasProcessor
- FileDropzone
- DownloadButton
- BatchQueue

## 9. 心理学测试需求

### 9.1 定位

心理学相关内容分为三类：

- Personality Tests：性格与自我了解测试
- Psychology Quizzes：趣味心理与生活方式测试
- Clinical Assessment Guides：专业心理测评介绍页

### 9.2 合规原则

心理学测试页面必须遵守：

- 不提供医学诊断。
- 不提供临床心理诊断。
- 不声称替代专业心理评估。
- 不复制受版权保护的正式量表题目、翻译、评分和解释体系。
- 结果只用于自我了解、反思或娱乐参考。
- 不上传用户答案，默认在浏览器本地计算。
- 涉及心理健康词汇时，必须放明显免责声明。

### 9.3 通用免责声明

英文：

```text
This test is for self-reflection and educational purposes only. It is not a medical diagnosis, clinical psychological assessment, or substitute for care from a qualified mental health professional.
```

简体中文：

```text
本测试仅用于自我了解和知识参考，不构成医学诊断、心理诊断或专业心理评估，也不能替代合格心理健康专业人士的帮助。
```

繁体中文：

```text
本測驗僅供自我了解與知識參考，不構成醫學診斷、心理診斷或專業心理評估，也不能取代合格心理健康專業人士的協助。
```

### 9.4 P0 低风险测试

- Big Five Personality Test
- MBTI Style Personality Quiz
- DISC Style Quiz
- Enneagram Style Quiz
- Introvert or Extrovert Test
- Love Language Style Quiz
- Learning Style Quiz
- Career Interest Test
- Work Style Test
- Leadership Style Test
- Communication Style Test
- Conflict Style Test
- Productivity Style Test
- Decision Making Style Test
- Creativity Type Test
- Emotional Intelligence Quiz
- Stress Level Check-in
- Burnout Risk Check-in
- Sleep Habit Quiz
- Digital Wellbeing Quiz
- Procrastination Reflection
- Focus Style Test
- Motivation Style Test
- Money Personality Quiz
- Attachment Style Reflection
- Relationship Communication Quiz
- Team Role Test
- Remote Work Style Test
- Study Habit Quiz

### 9.5 P1 测试

- Values Assessment
- Personal Strengths Test
- Confidence Self-Reflection Quiz
- Resilience Quiz
- Anger Style Quiz
- Social Battery Test
- Empathy Style Quiz
- Boundary Style Quiz
- Perfectionism Quiz
- Imposter Syndrome Check-in
- Mood Pattern Reflection
- Habit Personality Test
- Time Management Style Test
- Goal Setting Style Test
- Risk Tolerance Quiz
- Negotiation Style Test
- Listening Style Test
- Collaboration Style Test
- Feedback Style Test
- Workplace Motivation Test
- Career Values Test
- Job Fit Reflection Tool

### 9.6 不建议实现为测试的内容

第一版不做以下正式诊断或医疗化测试：

- 抑郁症诊断
- 焦虑症诊断
- ADHD 诊断
- 自闭症诊断
- 双相障碍诊断
- 创伤/PTSD 诊断
- 强迫症诊断
- 人格障碍诊断
- 任何“你是否患有某疾病”的测试
- 任何给出治疗建议的工具

如果后续涉及此类内容，只能作为科普介绍页，不能作为诊断工具。

## 10. MMPI 与 SCL-90 需求边界

### 10.1 总体原则

MMPI 和 SCL-90 属于专业心理测评相关内容，第一版只作为专业测评介绍和 SEO 内容页，不实现为正式在线测试。

严禁：

- 复制 MMPI、MMPI-2、MMPI-2-RF 原题。
- 复制 SCL-90 或 SCL-90-R 原题。
- 复制受版权保护的正式翻译版本。
- 复制正式评分和解释体系。
- 声称本站提供官方 MMPI 或 SCL-90 测试。
- 输出临床诊断结论。
- 使用“诊断报告”“临床报告”“你患有某某障碍”等表述。

### 10.2 MMPI 页面

MMPI 相关页面作为 `Clinical Assessment Guides`，页面类型为文章或指南。

建议页面：

- What Is the MMPI?
- MMPI-2 Overview
- MMPI-2-RF Overview
- MMPI Clinical Scales Explained
- MMPI Validity Scales Explained
- MMPI Score Interpretation Guide
- Can You Take the MMPI Online?
- MMPI for Employment Screening
- MMPI vs Big Five
- MMPI vs SCL-90

中文页面示例：

- MMPI 是什么？明尼苏达多项人格测验介绍
- MMPI、MMPI-2 和 MMPI-2-RF 有什么区别？
- MMPI 临床量表和效度量表说明
- 网上可以做 MMPI 测试吗？
- MMPI 结果应该如何理解？

繁体页面示例：

- MMPI 是什麼？明尼蘇達多項人格測驗介紹
- MMPI、MMPI-2 與 MMPI-2-RF 有什麼差異？
- MMPI 臨床量表與效度量表說明
- 線上可以做 MMPI 測驗嗎？
- MMPI 結果應該如何理解？

### 10.3 SCL-90 页面

SCL-90 相关页面同样作为专业测评介绍页。

建议页面：

- SCL-90 Overview
- SCL-90 Symptom Dimensions Explained
- SCL-90 Scoring Guide
- SCL-90 Result Interpretation
- SCL-90 vs SCL-90-R
- SCL-90 vs PHQ-9
- SCL-90 vs GAD-7
- SCL-90 Self-Reflection Guide
- SCL-90 Limitations
- SCL-90 FAQ

中文页面示例：

- SCL-90 症状自评量表介绍
- SCL-90 维度、评分方式与局限性
- SCL-90 与 PHQ-9、GAD-7 有什么区别？
- SCL-90 结果应该如何理解？

繁体页面示例：

- SCL-90 症狀自評量表介紹
- SCL-90 向度、計分方式與限制
- SCL-90 與 PHQ-9、GAD-7 有什麼差異？
- SCL-90 結果應該如何理解？

### 10.4 替代交互工具

为了满足用户“测一下”的需求，可以提供自研非临床工具：

- Emotional Wellbeing Check-in
- Stress Level Check-in
- Burnout Risk Check-in
- Anxiety and Stress Reflection
- Mood Pattern Reflection
- Sleep and Mood Check-in
- Work Stress Self-Check
- Relationship Stress Check-in
- Social Anxiety Reflection
- Self-Esteem Reflection

这些工具可以参考常见心理健康维度，但不能复制正式量表题目和评分体系，也不能命名为 MMPI 或 SCL-90 测试。

结果表达必须温和，例如：

```text
Your responses suggest that anxiety-related stress has been more noticeable recently. This is not a diagnosis. If these experiences are persistent or distressing, consider talking to a qualified mental health professional.
```

## 11. 工具实现模型

为了支持大量工具，使用模板化工具模型。

### 11.1 工具模板

- TextTransformTool：文本输入，文本输出
- TextAnalyzeTool：文本输入，统计输出
- EncodeDecodeTool：编码/解码双向操作
- ConvertTool：单位或格式转换
- GeneratorTool：随机值、代码片段、配置生成
- ValidatorTool：输入内容，输出错误或警告
- PreviewTool：输入配置，展示预览
- FileTool：上传文件，本地处理
- ImageTool：图片上传，Canvas 本地处理
- SchemaGeneratorTool：表单生成 JSON-LD
- CalculatorTool：数字输入，计算输出
- QuizTool：题目、选项、评分和结果解释

### 11.2 通用工具能力

大多数工具应支持：

- 输入
- 输出
- 复制结果
- 清空输入
- 下载结果
- 示例填充
- 错误提示
- 本地隐私提示
- 移动端可用
- 键盘可访问

### 11.3 数据结构方向

工具页面应由数据驱动。

示例：

```ts
type Locale =
  | 'en'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja'
  | 'ko'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'ru'
  | 'ar'

type LocalizedSeo = {
  title: string
  description: string
  h1: string
  intro: string
  howToUse: string[]
  useCases: string[]
  faq: Array<{
    question: string
    answer: string
  }>
  keywords: string[]
}

type Tool = {
  slug: string
  category: string
  tags: string[]
  component: string
  seo: Record<Locale, LocalizedSeo>
}
```

心理测试数据示例：

```ts
type Quiz = {
  slug: string
  category: string
  seo: Record<Locale, LocalizedSeo>
  disclaimer: Record<Locale, string>
  questions: Array<{
    id: string
    text: Record<Locale, string>
    dimension: string
    reverse?: boolean
  }>
  results: Array<{
    id: string
    title: Record<Locale, string>
    description: Record<Locale, string>
    min?: number
    max?: number
  }>
}
```

## 12. 搜索需求

第一版实现静态搜索。

要求：

- 构建时生成每个语言的搜索索引。
- 支持搜索工具名、描述、分类、标签、关键词。
- 支持全站搜索弹窗。
- 支持搜索页。
- 搜索结果按相关性和热门程度排序。

候选实现：

- 第一版：Fuse.js
- 后续：Pagefind

索引路径示例：

```text
/search-index/en.json
/search-index/zh-CN.json
/search-index/zh-TW.json
```

## 13. 隐私需求

### 13.1 默认原则

- 工具优先在浏览器本地运行。
- 不要求登录。
- 不上传用户输入，除非页面明确说明。
- 文件、图片、心理测试结果默认不离开本地浏览器。
- 不收集敏感心理测试答案。

### 13.2 页面提示

文件、图片、加密、心理测试相关工具必须显示隐私说明。

示例：

```text
Your file is processed locally in your browser and is not uploaded to our servers.
```

简体：

```text
你的文件会在浏览器本地处理，不会上传到服务器。
```

繁体：

```text
你的檔案會在瀏覽器本機處理，不會上傳到伺服器。
```

## 14. 性能需求

目标：

- Lighthouse Performance 90+
- Lighthouse SEO 95+
- Lighthouse Accessibility 90+
- Lighthouse Best Practices 90+

原则：

- 页面默认输出静态 HTML。
- 只有工具交互区加载 React。
- 图片处理类工具按需加载。
- 图像批处理使用 Web Worker。
- 不引入重型全局状态管理。
- 不引入 Moment.js。
- 图标按需导入。
- 工具组件分包，避免首页加载所有工具逻辑。

## 15. 可访问性需求

- 所有表单控件必须有 label。
- 按钮必须有可理解文本或 aria-label。
- 键盘可操作。
- 颜色对比度符合 WCAG AA。
- 心理测试题目可键盘选择。
- 图像工具上传区支持按钮选择文件，不只依赖拖拽。
- 阿拉伯语 RTL 布局可用。

## 16. 测试需求

### 16.1 单元测试

需要覆盖：

- 工具纯函数
- SEO metadata 生成
- canonical 生成
- hreflang 生成
- JSON-LD 生成
- sitemap 数据生成
- 搜索索引生成
- 多语言 fallback
- 心理测试评分逻辑
- 图像处理核心参数计算

### 16.2 E2E 测试

需要覆盖：

- 首页可访问
- 语言页面可访问
- 分类页可访问
- 工具页可访问
- 搜索弹窗可用
- 搜索页可用
- JSON 工具可用
- Base64 工具可用
- 图片上传工具可用
- 心理测试可完成并显示结果
- 主题切换可用
- 移动端导航可用
- RTL 页面基本可用

### 16.3 交付前命令

每次交付前至少运行：

```text
npm run check
npm run test
npm run build
```

如果已配置 E2E：

```text
npm run test:e2e
```

## 17. Cloudflare Pages 配置需求

### 17.1 `_headers`

建议配置：

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 17.2 `_redirects`

英文 `/en` 路径重定向到无前缀路径。

示例：

```text
/en/ /
/en/tools/:slug /tools/:slug
/en/categories/:slug /categories/:slug
/en/search/ /search/
```

## 18. 实施阶段

### 18.1 第一阶段：基础架构

- 初始化 Astro + TypeScript + React
- 配置 Tailwind CSS
- 接入 shadcn/ui 风格组件
- 建立 layout
- 建立 locale 配置
- 建立英文无前缀、多语言前缀路由

### 18.2 第二阶段：SEO 基建

- SeoHead
- canonical
- hreflang
- Open Graph
- Twitter Card
- JSON-LD
- sitemap
- robots.txt
- `_headers`
- `_redirects`

### 18.3 第三阶段：页面系统

- 首页
- 分类页
- 工具页
- 搜索页
- 关于页
- 隐私页
- 条款页
- 404 页面

### 18.4 第四阶段：核心工具

- 实现 30 个高优先级开发、文本、编码、SEO 工具
- 抽象工具模板
- 添加单元测试

### 18.5 第五阶段：规模扩展

- 扩展到 100 到 120 个真实可用工具
- 完成图像工具 P0
- 完成心理测试 P0
- 完成 MMPI/SCL-90 介绍页

### 18.6 第六阶段：内容和 SEO 加强

- 完成重点 50 个页面长内容
- 补齐所有语言基础 SEO
- 优化内链
- 增加 FAQ
- 检查薄内容页面

### 18.7 第七阶段：验证与部署

- 类型检查
- 单元测试
- 构建测试
- E2E 冒烟测试
- Lighthouse 检查
- Cloudflare Pages 预览部署

## 19. 风险与限制

### 19.1 SEO 风险

- 页面数量多但内容薄，可能影响收录质量。
- 机器翻译质量低会影响多语言 SEO。
- `/` 和 `/en/` 重复会造成 canonical 问题。

应对：

- 英文无前缀作为 canonical。
- 每个语言页面维护独立 metadata。
- 重点工具页优先写长内容。
- 工具页之间建立相关链接。

### 19.2 心理健康合规风险

- MMPI/SCL-90 可能涉及版权和专业测评授权。
- 心理健康内容属于 YMYL。
- 错误结论可能误导用户。

应对：

- 不复制正式量表。
- 不提供官方测试。
- 不输出诊断。
- 明确免责声明。
- 只做自研非临床自我反思工具。

### 19.3 静态站能力限制

以下能力第一版不做或只做页面说明：

- 实时 DNS 查询
- WHOIS 查询
- Ping / Traceroute
- 远程网页 SEO 抓取
- AI 背景移除
- OCR
- PDF 高级处理
- 货币实时汇率

后续可通过 Cloudflare Workers 或第三方 API 实现。

## 20. 第一版验收标准

第一版完成时应满足：

- 项目可在 Cloudflare Pages 静态部署。
- 支持 11 种语言。
- 英文使用无前缀 URL。
- 其他语言使用 locale 前缀 URL。
- 首页、分类页、工具页、搜索页、隐私页、关于页完整可用。
- 至少 100 个工具或内容页。
- 至少 50 个真实可用工具。
- 至少 20 个图像相关页面，其中 10 个以上真实可用。
- 至少 20 个心理相关页面，其中 10 个以上为低风险可交互测试。
- MMPI 和 SCL-90 只作为介绍页，不作为正式在线测试。
- 所有页面有基础 SEO metadata。
- 多语言页面有 canonical 和 hreflang。
- sitemap 和 robots.txt 可用。
- 搜索可用。
- `npm run check` 通过。
- `npm run test` 通过。
- `npm run build` 通过。

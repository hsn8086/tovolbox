import type { Locale } from './locales';
import { getPageCopy } from './pageCopy';
import type { Tool } from './types';

export type ToolSeoSection = {
  heading: string;
  body: string;
  items: string[];
};

type ToolSeoContent = {
  sections: ToolSeoSection[];
};

const toolSeoContent: Partial<Record<string, Partial<Record<Locale, ToolSeoContent>>>> = {
  'json-formatter': {
    en: {
      sections: [
        {
          heading: 'When to use this formatter',
          body: 'Use JSON Formatter when you need to inspect API responses, config files, webhook payloads, or pasted snippets before sharing them with another tool.',
          items: ['Validates JSON before formatting', 'Keeps object keys and values unchanged', 'Makes nested arrays and objects easier to scan'],
        },
        {
          heading: 'Input and output notes',
          body: 'Paste raw JSON text into the tool. The output is indented JSON designed for reading, debugging, and copying back into documentation or issue reports.',
          items: ['Invalid JSON shows feedback instead of guessing', 'Whitespace changes only affect presentation', 'Processing happens in the browser'],
        },
      ],
    },
    'zh-CN': {
      sections: [
        { heading: '适用场景', body: '当你需要检查 API 响应、配置文件、Webhook 载荷或粘贴片段时，可以用 JSON 格式化工具先整理结构。', items: ['格式化前先校验 JSON', '不改变对象键和值', '让嵌套数组和对象更容易阅读'] },
        { heading: '输入与输出说明', body: '粘贴原始 JSON 文本后，输出会变成带缩进的 JSON，适合调试、复制到文档或问题反馈中。', items: ['无效 JSON 会显示反馈', '空白变化只影响展示', '处理过程在浏览器中完成'] },
      ],
    },
    'zh-TW': {
      sections: [
        { heading: '適用場景', body: '當你需要檢查 API 回應、設定檔、Webhook 載荷或貼上的片段時，可以先用 JSON 格式化工具整理結構。', items: ['格式化前先驗證 JSON', '不改變物件鍵和值', '讓巢狀陣列和物件更容易閱讀'] },
        { heading: '輸入與輸出說明', body: '貼上原始 JSON 文字後，輸出會變成帶縮排的 JSON，適合除錯、複製到文件或問題回報中。', items: ['無效 JSON 會顯示回饋', '空白變化只影響呈現', '處理過程在瀏覽器中完成'] },
      ],
    },
  },
  'utm-builder': {
    en: {
      sections: [
        {
          heading: 'Campaign tracking use cases',
          body: 'UTM Builder helps create consistent campaign URLs for newsletters, paid ads, social posts, partner links, and launch announcements.',
          items: ['Preserves existing query parameters', 'Encodes campaign names safely', 'Keeps source, medium, and campaign fields visible'],
        },
        {
          heading: 'Common mistakes to avoid',
          body: 'Use stable naming conventions before publishing links. Changing UTM names after a campaign starts can split analytics reports into separate rows.',
          items: ['Avoid mixing cases such as Email and email', 'Do not put private user data in UTM parameters', 'Test the final URL before sending traffic'],
        },
      ],
    },
    'zh-CN': {
      sections: [
        { heading: '活动链接场景', body: 'UTM 构建器适合为邮件、广告、社交发布、合作伙伴链接和产品发布创建一致的追踪 URL。', items: ['保留已有 query 参数', '安全编码活动名称', '清楚展示 source、medium 和 campaign'] },
        { heading: '常见错误', body: '发布链接前先确定命名规范。活动开始后再改 UTM 名称，可能会把统计数据拆成多行。', items: ['避免 Email 和 email 混用', '不要把用户隐私数据放入 UTM', '投放前测试最终 URL'] },
      ],
    },
    'zh-TW': {
      sections: [
        { heading: '活動連結場景', body: 'UTM 建立器適合為電子報、廣告、社群貼文、合作夥伴連結和產品發布建立一致的追蹤 URL。', items: ['保留既有 query 參數', '安全編碼活動名稱', '清楚呈現 source、medium 和 campaign'] },
        { heading: '常見錯誤', body: '發布連結前先確認命名規範。活動開始後再修改 UTM 名稱，可能會把統計資料拆成多列。', items: ['避免 Email 和 email 混用', '不要把使用者隱私資料放入 UTM', '投放前測試最終 URL'] },
      ],
    },
  },
  'image-resize-calculator': {
    en: {
      sections: [
        {
          heading: 'Private image resizing',
          body: 'Resize images locally before uploading them to a CMS, marketplace, support ticket, or social profile. The file is decoded and drawn in your browser.',
          items: ['No image upload is required', 'Choose PNG, JPEG, or WebP output', 'Use fit modes for thumbnails and fixed-size slots'],
        },
        {
          heading: 'Quality and dimension tips',
          body: 'Start with the smallest dimensions that still look sharp where the image will appear. For photos, JPEG or WebP quality around 80 to 90 percent is usually a good first pass.',
          items: ['Keep aspect ratio for natural photos', 'Use cover for fixed cards and avatars', 'Check output size before downloading'],
        },
      ],
    },
    'zh-CN': {
      sections: [
        { heading: '本地图像缩放', body: '在上传到 CMS、电商平台、工单或社交资料前，先在浏览器本地调整图片尺寸。文件会在你的浏览器中解码和绘制。', items: ['无需上传图片', '可选择 PNG、JPEG 或 WebP 输出', '固定尺寸槽位可使用 fit 模式'] },
        { heading: '质量和尺寸建议', body: '优先选择目标场景中仍然清晰的最小尺寸。照片通常可以从 80% 到 90% 的 JPEG 或 WebP 质量开始。', items: ['自然照片保持宽高比', '固定卡片和头像可使用 cover', '下载前检查输出大小'] },
      ],
    },
    'zh-TW': {
      sections: [
        { heading: '本機圖片縮放', body: '在上傳到 CMS、電商平台、客服單或社群資料前，先在瀏覽器本機調整圖片尺寸。檔案會在你的瀏覽器中解碼和繪製。', items: ['不需要上傳圖片', '可選擇 PNG、JPEG 或 WebP 輸出', '固定尺寸欄位可使用 fit 模式'] },
        { heading: '品質和尺寸建議', body: '優先選擇目標場景中仍然清楚的最小尺寸。照片通常可以從 80% 到 90% 的 JPEG 或 WebP 品質開始。', items: ['自然照片保持長寬比', '固定卡片和頭像可使用 cover', '下載前檢查輸出大小'] },
      ],
    },
  },
  'sha256-generator': {
    en: {
      sections: [
        {
          heading: 'Checksum and comparison workflows',
          body: 'SHA-256 Generator is useful for comparing text, checking release notes, documenting known hashes, or creating deterministic identifiers for non-secret content.',
          items: ['Hashes are generated locally', 'Input text is not uploaded', 'Output is a hexadecimal SHA-256 digest'],
        },
        {
          heading: 'Security boundaries',
          body: 'A hash is not encryption. Do not use a plain SHA-256 digest as password storage or as a replacement for authenticated signing.',
          items: ['Use password hashing algorithms for passwords', 'Use HMAC when you need a keyed digest', 'Never publish sensitive source input'],
        },
      ],
    },
    'zh-CN': {
      sections: [
        { heading: '校验和对比流程', body: 'SHA-256 生成器适合对比文本、检查发布说明、记录已知哈希，或为非敏感内容生成确定性标识。', items: ['哈希在本地生成', '输入文本不会上传', '输出为十六进制 SHA-256 摘要'] },
        { heading: '安全边界', body: '哈希不是加密。不要把普通 SHA-256 摘要当作密码存储方案，也不要替代带认证的签名机制。', items: ['密码应使用专门的密码哈希算法', '需要密钥摘要时使用 HMAC', '不要公开敏感原文'] },
      ],
    },
    'zh-TW': {
      sections: [
        { heading: '校驗和比對流程', body: 'SHA-256 產生器適合比對文字、檢查發布說明、記錄已知雜湊，或為非敏感內容產生確定性識別。', items: ['雜湊在本機產生', '輸入文字不會上傳', '輸出為十六進位 SHA-256 摘要'] },
        { heading: '安全邊界', body: '雜湊不是加密。不要把普通 SHA-256 摘要當作密碼儲存方案，也不要取代帶認證的簽章機制。', items: ['密碼應使用專門的密碼雜湊演算法', '需要金鑰摘要時使用 HMAC', '不要公開敏感原文'] },
      ],
    },
  },
};

export function getToolSeoSections(tool: Tool, locale: Locale): ToolSeoSection[] {
  return toolSeoContent[tool.slug]?.[locale]?.sections ?? buildFallbackSections(tool, locale);
}

function buildFallbackSections(tool: Tool, locale: Locale): ToolSeoSection[] {
  const seo = tool.seo[locale];
  const copy = getPageCopy(locale);
  return [
    {
      heading: copy.toolHelpHeading,
      body: seo.intro,
      items: seo.useCases,
    },
    {
      heading: tool.isLocalOnly ? copy.privacyProcessingHeading : copy.readingNotesHeading,
      body: tool.isLocalOnly ? copy.localProcessingBody : copy.guideInterpretationBody,
      items: tool.isLocalOnly ? copy.localProcessingItems : copy.guideInterpretationItems,
    },
  ];
}

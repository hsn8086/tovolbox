import { locales, type Locale } from './locales';
import type { Category, LocalizedContent, Tool, ToolKind } from './types';

type Seed = {
  title: string;
  description: string;
  h1?: string;
  intro?: string;
  keywords?: string[];
};

type ContentSeed = {
  en: Seed;
  'zh-CN': Seed;
  'zh-TW': Seed;
} & Partial<Record<Locale, Seed>>;

const suffix: Record<Locale, { title: string; intro: string; how: string[]; useCases: string[]; faq: string[] }> = {
  en: {
    title: 'Free Online Tool',
    intro: 'Use this browser-based tool for everyday work. It is designed for speed, privacy, and clear results.',
    how: ['Paste or enter your input.', 'Adjust options when available.', 'Review, copy, or download the result.'],
    useCases: ['Daily developer workflows', 'Content and SEO checks', 'Private browser-side processing'],
    faq: ['Is this tool free?', 'Does my input leave the browser?'],
  },
  'zh-CN': {
    title: '免费在线工具',
    intro: '使用这个基于浏览器的工具完成日常任务，重点关注速度、隐私和清晰结果。',
    how: ['粘贴或输入内容。', '按需调整选项。', '查看、复制或下载结果。'],
    useCases: ['开发者日常工作', '内容与 SEO 检查', '浏览器本地隐私处理'],
    faq: ['这个工具免费吗？', '我的输入会离开浏览器吗？'],
  },
  'zh-TW': {
    title: '免費線上工具',
    intro: '使用這個基於瀏覽器的工具完成日常任務，重點在速度、隱私和清楚結果。',
    how: ['貼上或輸入內容。', '依需求調整選項。', '查看、複製或下載結果。'],
    useCases: ['開發者日常工作', '內容與 SEO 檢查', '瀏覽器本機隱私處理'],
    faq: ['這個工具免費嗎？', '我的輸入會離開瀏覽器嗎？'],
  },
  ja: {
    title: '無料オンラインツール',
    intro: '日常の作業をすばやく進められるよう、速度、プライバシー、わかりやすい結果を重視しています。',
    how: ['入力欄にテキストや値を入力します。', '必要に応じてオプションを調整します。', '結果を確認し、コピーまたはダウンロードします。'],
    useCases: ['開発やデータ確認の定型作業', 'コンテンツとSEOの見直し', 'ブラウザー内で完結するプライベートな処理'],
    faq: ['このツールは無料ですか？', '入力内容はブラウザーの外へ送信されますか？'],
  },
  ko: {
    title: '무료 온라인 도구',
    intro: '일상 작업을 빠르게 처리할 수 있도록 속도, 개인정보 보호, 이해하기 쉬운 결과에 초점을 맞췄습니다.',
    how: ['입력란에 텍스트나 값을 입력합니다.', '필요한 경우 옵션을 조정합니다.', '결과를 확인한 뒤 복사하거나 다운로드합니다.'],
    useCases: ['개발 및 데이터 확인 작업', '콘텐츠와 SEO 점검', '브라우저 안에서 끝나는 비공개 처리'],
    faq: ['이 도구는 무료인가요?', '입력 내용이 브라우저 밖으로 전송되나요?'],
  },
  es: {
    title: 'Herramienta Online Gratis',
    intro: 'Herramienta en el navegador para tareas diarias con rapidez, privacidad y resultados claros.',
    how: ['Pega o escribe tu entrada.', 'Ajusta las opciones.', 'Copia o descarga el resultado.'],
    useCases: ['Flujos de desarrollo', 'Revisión SEO', 'Procesamiento local'],
    faq: ['¿Es gratis?', '¿Mi entrada sale del navegador?'],
  },
  fr: {
    title: 'Outil En Ligne Gratuit',
    intro: 'Un outil dans le navigateur pour travailler vite, en privé, avec des résultats clairs.',
    how: ['Collez votre entrée.', 'Réglez les options.', 'Copiez le résultat.'],
    useCases: ['Développement', 'Contrôle SEO', 'Traitement local'],
    faq: ['Est-ce gratuit ?', 'Mes données quittent-elles le navigateur ?'],
  },
  de: {
    title: 'Kostenloses Online-Tool',
    intro: 'Ein Browser-Tool für schnelle, private und klare Ergebnisse im Alltag.',
    how: ['Eingabe einfügen.', 'Optionen anpassen.', 'Ergebnis kopieren.'],
    useCases: ['Entwicklung', 'SEO-Prüfung', 'Lokale Verarbeitung'],
    faq: ['Ist es kostenlos?', 'Verlassen meine Daten den Browser?'],
  },
  pt: {
    title: 'Ferramenta Online Gratuita',
    intro: 'Ferramenta no navegador para tarefas diárias com rapidez, privacidade e clareza.',
    how: ['Cole sua entrada.', 'Ajuste as opções.', 'Copie o resultado.'],
    useCases: ['Desenvolvimento', 'SEO', 'Processamento local'],
    faq: ['É grátis?', 'Minha entrada sai do navegador?'],
  },
  ru: {
    title: 'Бесплатный Онлайн Инструмент',
    intro: 'Браузерный инструмент для быстрых, приватных и понятных результатов.',
    how: ['Вставьте ввод.', 'Настройте параметры.', 'Скопируйте результат.'],
    useCases: ['Разработка', 'SEO-проверки', 'Локальная обработка'],
    faq: ['Это бесплатно?', 'Данные покидают браузер?'],
  },
  ar: {
    title: 'أداة مجانية عبر الإنترنت',
    intro: 'أداة تعمل في المتصفح للمهام اليومية بسرعة وخصوصية ونتائج واضحة.',
    how: ['ألصق الإدخال.', 'عدّل الخيارات.', 'انسخ النتيجة.'],
    useCases: ['عمل المطورين', 'فحص SEO', 'معالجة محلية'],
    faq: ['هل الأداة مجانية؟', 'هل تغادر بياناتي المتصفح؟'],
  },
};

function content(seed: ContentSeed, keywords: string[] = []): Record<Locale, LocalizedContent> {
  const result = {} as Record<Locale, LocalizedContent>;

  for (const locale of locales) {
    const base = seed[locale] ?? seed.en;
    const localizedSuffix = suffix[locale];
    const name = base.h1 ?? base.title;
    result[locale] = {
      title: `${base.title} | TovolBox`,
      description: base.description,
      h1: name,
      intro: base.intro ?? `${base.description} ${localizedSuffix.intro}`,
      howToUse: localizedSuffix.how,
      useCases: localizedSuffix.useCases,
      faq: localizedSuffix.faq.map((question) => ({
        question,
        answer: localizedSuffix.intro,
      })),
      keywords: [...(base.keywords ?? []), ...keywords],
    };
  }

  return result;
}

export const categories: Category[] = [
  {
    slug: 'developer-tools',
    icon: 'Code2',
    seo: content({
      en: { title: 'Developer Tools', description: 'Format, validate, encode, decode, and generate data for daily development workflows.' },
      'zh-CN': { title: '开发者工具', description: '用于日常开发的格式化、校验、编码、解码和生成工具。' },
      'zh-TW': { title: '開發者工具', description: '用於日常開發的格式化、驗證、編碼、解碼和產生工具。' },
      ja: { title: '開発者ツール', description: '日々の開発で使う整形、検証、エンコード、デコード、データ生成ツール。' },
      ko: { title: '개발자 도구', description: '일상 개발 작업에 필요한 포맷, 검증, 인코딩, 디코딩, 데이터 생성 도구입니다.' },
    }),
  },
  {
    slug: 'json-data-tools',
    icon: 'Braces',
    seo: content({
      en: { title: 'JSON and Data Tools', description: 'Work with JSON, query strings, CSV, YAML, and structured data directly in the browser.' },
      'zh-CN': { title: 'JSON 与数据工具', description: '在浏览器中处理 JSON、查询字符串、CSV、YAML 和结构化数据。' },
      'zh-TW': { title: 'JSON 與資料工具', description: '在瀏覽器中處理 JSON、查詢字串、CSV、YAML 和結構化資料。' },
      ja: { title: 'JSON・データツール', description: 'JSON、クエリ文字列、CSV、YAML、構造化データをブラウザーで直接処理します。' },
      ko: { title: 'JSON 및 데이터 도구', description: 'JSON, 쿼리 문자열, CSV, YAML, 구조화 데이터를 브라우저에서 바로 처리합니다.' },
    }),
  },
  {
    slug: 'encoding-decoding-tools',
    icon: 'Binary',
    seo: content({
      en: { title: 'Encoding and Decoding Tools', description: 'Encode and decode Base64, URLs, HTML entities, JWT payloads, and more.' },
      'zh-CN': { title: '编码与解码工具', description: '编码和解码 Base64、URL、HTML 实体、JWT 载荷等内容。' },
      'zh-TW': { title: '編碼與解碼工具', description: '編碼和解碼 Base64、URL、HTML 實體、JWT 載荷等內容。' },
      ja: { title: 'エンコード・デコードツール', description: 'Base64、URL、HTMLエンティティ、JWTペイロードなどをエンコードまたはデコードします。' },
      ko: { title: '인코딩 및 디코딩 도구', description: 'Base64, URL, HTML 엔티티, JWT 페이로드 등을 인코딩하고 디코딩합니다.' },
    }),
  },
  {
    slug: 'text-tools',
    icon: 'Text',
    seo: content({
      en: { title: 'Text Tools', description: 'Count, clean, transform, sort, and extract information from text.' },
      'zh-CN': { title: '文本工具', description: '统计、清理、转换、排序并提取文本中的信息。' },
      'zh-TW': { title: '文字工具', description: '統計、清理、轉換、排序並擷取文字中的資訊。' },
      ja: { title: 'テキストツール', description: 'テキストの文字数確認、整形、変換、並べ替え、情報抽出を行います。' },
      ko: { title: '텍스트 도구', description: '텍스트를 계산, 정리, 변환, 정렬하고 필요한 정보를 추출합니다.' },
    }),
  },
  {
    slug: 'seo-tools',
    icon: 'Search',
    seo: content({
      en: { title: 'SEO Tools', description: 'Preview metadata, build UTM links, generate robots.txt, and improve technical SEO.' },
      'zh-CN': { title: 'SEO 工具', description: '预览元信息、生成 UTM 链接和 robots.txt，改进技术 SEO。' },
      'zh-TW': { title: 'SEO 工具', description: '預覽中繼資訊、產生 UTM 連結和 robots.txt，改善技術 SEO。' },
      ja: { title: 'SEOツール', description: 'メタデータのプレビュー、UTMリンク作成、robots.txt生成など技術SEOを支援します。' },
      ko: { title: 'SEO 도구', description: '메타데이터 미리보기, UTM 링크 생성, robots.txt 작성 등 기술 SEO를 개선합니다.' },
    }),
  },
  {
    slug: 'image-tools',
    icon: 'Image',
    seo: content({
      en: { title: 'Image Tools', description: 'Inspect, resize, encode, and transform images locally in your browser.' },
      'zh-CN': { title: '图像工具', description: '在浏览器本地检查、调整、编码和转换图片。' },
      'zh-TW': { title: '圖像工具', description: '在瀏覽器本機檢查、調整、編碼和轉換圖片。' },
      ja: { title: '画像ツール', description: '画像の確認、リサイズ、エンコード、変換をブラウザー内でローカルに行います。' },
      ko: { title: '이미지 도구', description: '이미지를 브라우저 안에서 로컬로 확인, 크기 조정, 인코딩, 변환합니다.' },
    }),
  },
  {
    slug: 'personality-tests',
    icon: 'Brain',
    seo: content({
      en: { title: 'Personality Tests', description: 'Self-reflection quizzes for personality, work style, stress, and wellbeing.' },
      'zh-CN': { title: '人格与自我了解测试', description: '用于性格、工作风格、压力和身心状态的自我反思测试。' },
      'zh-TW': { title: '人格與自我了解測驗', description: '用於性格、工作風格、壓力和身心狀態的自我反思測驗。' },
      ja: { title: '自己理解クイズ', description: '性格、働き方、ストレス、ウェルビーイングを振り返る非臨床の自己理解クイズ。' },
      ko: { title: '성격 및 자기 이해 테스트', description: '성격, 업무 방식, 스트레스, 웰빙을 돌아보는 비임상 자기 성찰 퀴즈입니다.' },
    }),
  },
  {
    slug: 'clinical-assessment-guides',
    icon: 'BookOpen',
    seo: content({
      en: { title: 'Clinical Assessment Guides', description: 'Educational guides about professional psychological assessments without online diagnosis.' },
      'zh-CN': { title: '专业测评介绍', description: '关于专业心理测评的知识介绍，不提供在线诊断。' },
      'zh-TW': { title: '專業測評介紹', description: '關於專業心理測評的知識介紹，不提供線上診斷。' },
      ja: { title: '専門アセスメントガイド', description: '専門的な心理アセスメントを学ぶための教育ガイドです。オンライン診断は提供しません。' },
      ko: { title: '전문 평가 가이드', description: '전문 심리 평가를 이해하기 위한 교육용 안내이며 온라인 진단을 제공하지 않습니다.' },
    }),
  },
];

function tool(slug: string, categorySlug: string, kind: ToolKind, component: string | undefined, seed: ContentSeed, tags: string[]): Tool {
  return {
    slug,
    kind,
    status: component ? 'live' : 'content-only',
    categorySlug,
    tags,
    relatedToolSlugs: [],
    component,
    isLocalOnly: true,
    isYMYL: categorySlug.includes('personality') || categorySlug.includes('clinical'),
    popularity: component ? 100 : 40,
    seo: content(seed, tags),
  };
}

export const tools: Tool[] = [
  tool('json-formatter', 'json-data-tools', 'text-transform', 'json-formatter', {
    en: { title: 'JSON Formatter', description: 'Format messy JSON into readable, indented JSON with validation feedback.' },
    'zh-CN': { title: 'JSON 格式化工具', description: '将混乱的 JSON 格式化为易读缩进结构，并提供校验反馈。' },
    'zh-TW': { title: 'JSON 格式化工具', description: '將混亂的 JSON 格式化為易讀縮排結構，並提供驗證回饋。' },
    ja: { title: 'JSONフォーマッター', description: '読みづらいJSONを検証しながら、インデントされた見やすい形式に整えます。' },
    ko: { title: 'JSON 포매터', description: '복잡한 JSON을 검증 피드백과 함께 읽기 쉬운 들여쓰기 형식으로 정리합니다.' },
  }, ['json', 'formatter', 'validator']),
  tool('json-minifier', 'json-data-tools', 'text-transform', 'json-minifier', {
    en: { title: 'JSON Minifier', description: 'Remove whitespace from JSON while keeping valid data unchanged.' },
    'zh-CN': { title: 'JSON 压缩工具', description: '移除 JSON 中的空白字符，同时保持数据含义不变。' },
    'zh-TW': { title: 'JSON 壓縮工具', description: '移除 JSON 中的空白字元，同時保持資料含義不變。' },
    ja: { title: 'JSON圧縮ツール', description: 'JSONの意味を変えずに不要な空白を取り除きます。' },
    ko: { title: 'JSON 압축 도구', description: '유효한 데이터는 그대로 두고 JSON의 불필요한 공백을 제거합니다.' },
  }, ['json', 'minify']),
  tool('json-to-csv', 'json-data-tools', 'text-transform', 'json-to-csv', {
    en: { title: 'JSON to CSV Converter', description: 'Convert an array of JSON objects into CSV with proper escaping.' },
    'zh-CN': { title: 'JSON 转 CSV', description: '将 JSON 对象数组转换为正确转义的 CSV。' },
    'zh-TW': { title: 'JSON 轉 CSV', description: '將 JSON 物件陣列轉換為正確轉義的 CSV。' },
    ja: { title: 'JSONからCSVへ変換', description: 'JSONオブジェクトの配列を、適切にエスケープされたCSVへ変換します。' },
    ko: { title: 'JSON to CSV 변환기', description: 'JSON 객체 배열을 올바르게 이스케이프된 CSV로 변환합니다.' },
  }, ['json', 'csv', 'converter']),
  tool('csv-to-json', 'json-data-tools', 'text-transform', 'csv-to-json', {
    en: { title: 'CSV to JSON Converter', description: 'Convert CSV rows into a JSON object array while handling quotes and commas.' },
    'zh-CN': { title: 'CSV 转 JSON', description: '将 CSV 行转换为 JSON 对象数组，并处理引号和逗号。' },
    'zh-TW': { title: 'CSV 轉 JSON', description: '將 CSV 列轉換為 JSON 物件陣列，並處理引號和逗號。' },
    ja: { title: 'CSVからJSONへ変換', description: '引用符やカンマを処理しながら、CSV行をJSONオブジェクト配列へ変換します。' },
    ko: { title: 'CSV to JSON 변환기', description: '따옴표와 쉼표를 처리하면서 CSV 행을 JSON 객체 배열로 변환합니다.' },
  }, ['csv', 'json', 'converter']),
  tool('yaml-to-json', 'json-data-tools', 'text-transform', 'yaml-to-json', {
    en: { title: 'YAML to JSON Converter', description: 'Convert YAML documents into formatted JSON for configuration and data workflows.' },
    'zh-CN': { title: 'YAML 转 JSON', description: '将 YAML 文档转换为格式化 JSON，适合配置和数据处理流程。' },
    'zh-TW': { title: 'YAML 轉 JSON', description: '將 YAML 文件轉換為格式化 JSON，適合設定和資料處理流程。' },
  }, ['yaml', 'json', 'converter']),
  tool('json-to-yaml', 'json-data-tools', 'text-transform', 'json-to-yaml', {
    en: { title: 'JSON to YAML Converter', description: 'Convert JSON values into readable YAML without sending data to a server.' },
    'zh-CN': { title: 'JSON 转 YAML', description: '将 JSON 值转换为易读 YAML，数据不会发送到服务器。' },
    'zh-TW': { title: 'JSON 轉 YAML', description: '將 JSON 值轉換為易讀 YAML，資料不會傳送到伺服器。' },
  }, ['json', 'yaml', 'converter']),
  tool('query-string-parser', 'json-data-tools', 'text-analyze', 'query-string-parser', {
    en: { title: 'Query String Parser', description: 'Parse URL query strings into decoded keys, values, and repeated parameters.' },
    'zh-CN': { title: '查询字符串解析器', description: '将 URL 查询字符串解析为解码后的键、值和重复参数。' },
    'zh-TW': { title: '查詢字串解析器', description: '將 URL 查詢字串解析為解碼後的鍵、值和重複參數。' },
    ja: { title: 'クエリ文字列パーサー', description: 'URLクエリ文字列をデコード済みのキー、値、重複パラメータに分解します。' },
    ko: { title: '쿼리 문자열 파서', description: 'URL 쿼리 문자열을 디코딩된 키, 값, 반복 파라미터로 파싱합니다.' },
  }, ['query string', 'url']),
  tool('query-string-builder', 'json-data-tools', 'generator', 'query-string-builder', {
    en: { title: 'Query String Builder', description: 'Build encoded URL query strings from key-value pairs.' },
    'zh-CN': { title: '查询字符串生成器', description: '从键值对生成编码后的 URL 查询字符串。' },
    'zh-TW': { title: '查詢字串產生器', description: '從鍵值對產生編碼後的 URL 查詢字串。' },
    ja: { title: 'クエリ文字列ビルダー', description: 'キーと値のペアから、URL向けにエンコードされたクエリ文字列を作成します。' },
    ko: { title: '쿼리 문자열 빌더', description: '키-값 쌍으로 인코딩된 URL 쿼리 문자열을 만듭니다.' },
  }, ['query string', 'url']),
  tool('url-parser', 'json-data-tools', 'text-analyze', 'url-parser', {
    en: { title: 'URL Parser', description: 'Break a URL into protocol, host, path, query parameters, and hash parts.' },
    'zh-CN': { title: 'URL 解析器', description: '将 URL 拆解为协议、主机、路径、查询参数和 hash 部分。' },
    'zh-TW': { title: 'URL 解析器', description: '將 URL 拆解為協定、主機、路徑、查詢參數和 hash 部分。' },
  }, ['url', 'parser', 'query string']),
  tool('csv-delimiter-converter', 'json-data-tools', 'text-transform', 'csv-delimiter-converter', {
    en: { title: 'CSV Delimiter Converter', description: 'Convert CSV between comma, semicolon, tab, and pipe delimiters while preserving quoted fields.' },
    'zh-CN': { title: 'CSV 分隔符转换器', description: '在逗号、分号、制表符和竖线分隔符之间转换 CSV，并保留引用字段。' },
    'zh-TW': { title: 'CSV 分隔符轉換器', description: '在逗號、分號、定位字元和直線分隔符之間轉換 CSV，並保留引用欄位。' },
  }, ['csv', 'delimiter', 'converter']),
  tool('xml-formatter', 'json-data-tools', 'text-transform', 'xml-formatter', {
    en: { title: 'XML Formatter', description: 'Format XML-style markup into readable indented lines in the browser.' },
    'zh-CN': { title: 'XML 格式化工具', description: '在浏览器中将 XML 标记格式化为可读缩进行。' },
    'zh-TW': { title: 'XML 格式化工具', description: '在瀏覽器中將 XML 標記格式化為可讀縮排行。' },
  }, ['xml', 'formatter']),
  tool('html-formatter', 'json-data-tools', 'text-transform', 'html-formatter', {
    en: { title: 'HTML Formatter', description: 'Format HTML snippets into readable indented markup without uploading content.' },
    'zh-CN': { title: 'HTML 格式化工具', description: '将 HTML 片段格式化为可读缩进标记，内容不会上传。' },
    'zh-TW': { title: 'HTML 格式化工具', description: '將 HTML 片段格式化為可讀縮排標記，內容不會上傳。' },
  }, ['html', 'formatter']),
  tool('css-formatter', 'json-data-tools', 'text-transform', 'css-formatter', {
    en: { title: 'CSS Formatter', description: 'Format CSS rules and declarations into readable indented blocks.' },
    'zh-CN': { title: 'CSS 格式化工具', description: '将 CSS 规则和声明格式化为可读缩进代码块。' },
    'zh-TW': { title: 'CSS 格式化工具', description: '將 CSS 規則和宣告格式化為可讀縮排程式碼區塊。' },
  }, ['css', 'formatter']),
  tool('base64-encode-decode', 'encoding-decoding-tools', 'encode-decode', 'base64', {
    en: { title: 'Base64 Encode and Decode', description: 'Encode plain text to Base64 or decode Base64 back to readable text.' },
    'zh-CN': { title: 'Base64 编码解码', description: '将文本编码为 Base64，或将 Base64 解码为可读文本。' },
    'zh-TW': { title: 'Base64 編碼解碼', description: '將文字編碼為 Base64，或將 Base64 解碼為可讀文字。' },
    ja: { title: 'Base64エンコード・デコード', description: 'プレーンテキストをBase64に変換し、Base64を読みやすいテキストへ戻します。' },
    ko: { title: 'Base64 인코딩 및 디코딩', description: '일반 텍스트를 Base64로 인코딩하거나 Base64를 읽을 수 있는 텍스트로 디코딩합니다.' },
  }, ['base64', 'encode', 'decode']),
  tool('url-encode-decode', 'encoding-decoding-tools', 'encode-decode', 'url-codec', {
    en: { title: 'URL Encode and Decode', description: 'Encode URL components or decode percent-encoded strings safely.' },
    'zh-CN': { title: 'URL 编码解码', description: '安全编码 URL 组件，或解码百分号编码字符串。' },
    'zh-TW': { title: 'URL 編碼解碼', description: '安全編碼 URL 元件，或解碼百分比編碼字串。' },
    ja: { title: 'URLエンコード・デコード', description: 'URLコンポーネントを安全にエンコードし、パーセントエンコード文字列をデコードします。' },
    ko: { title: 'URL 인코딩 및 디코딩', description: 'URL 구성 요소를 안전하게 인코딩하거나 퍼센트 인코딩 문자열을 디코딩합니다.' },
  }, ['url', 'encode', 'decode']),
  tool('html-entity-encode-decode', 'encoding-decoding-tools', 'encode-decode', 'html-entity', {
    en: { title: 'HTML Entity Encode and Decode', description: 'Encode special HTML characters or decode named and numeric HTML entities.' },
    'zh-CN': { title: 'HTML 实体编码解码', description: '编码 HTML 特殊字符，或解码命名和数字实体。' },
    'zh-TW': { title: 'HTML 實體編碼解碼', description: '編碼 HTML 特殊字元，或解碼命名和數字實體。' },
    ja: { title: 'HTMLエンティティ変換', description: 'HTML特殊文字をエンコードし、名前付き・数値エンティティをデコードします。' },
    ko: { title: 'HTML 엔티티 인코딩 및 디코딩', description: 'HTML 특수 문자를 인코딩하거나 이름/숫자 HTML 엔티티를 디코딩합니다.' },
  }, ['html', 'entity', 'encode']),
  tool('word-counter', 'text-tools', 'text-analyze', 'word-counter', {
    en: { title: 'Word Counter', description: 'Count words, characters, sentences, paragraphs, and estimated reading time.' },
    'zh-CN': { title: '字数统计工具', description: '统计词数、字符数、句子、段落和预计阅读时间。' },
    'zh-TW': { title: '字數統計工具', description: '統計詞數、字元數、句子、段落和預估閱讀時間。' },
    ja: { title: '文字数カウンター', description: '単語数、文字数、文、段落、推定読了時間を数えます。' },
    ko: { title: '단어 수 계산기', description: '단어, 문자, 문장, 문단 수와 예상 읽기 시간을 계산합니다.' },
  }, ['text', 'counter']),
  tool('case-converter', 'text-tools', 'text-transform', 'case-converter', {
    en: { title: 'Case Converter', description: 'Convert text between uppercase, lowercase, title case, camelCase, and kebab-case.' },
    'zh-CN': { title: '大小写转换工具', description: '在大写、小写、标题格式、camelCase 和 kebab-case 之间转换文本。' },
    'zh-TW': { title: '大小寫轉換工具', description: '在大寫、小寫、標題格式、camelCase 和 kebab-case 之間轉換文字。' },
    ja: { title: 'ケース変換ツール', description: '大文字、小文字、タイトルケース、camelCase、kebab-caseの間でテキストを変換します。' },
    ko: { title: '대소문자 변환 도구', description: '텍스트를 대문자, 소문자, 제목 형식, camelCase, kebab-case로 변환합니다.' },
  }, ['text', 'case']),
  tool('slug-generator', 'text-tools', 'generator', 'slug-generator', {
    en: { title: 'Slug Generator', description: 'Create clean URL slugs from titles and phrases.' },
    'zh-CN': { title: 'Slug 生成器', description: '从标题和短语生成干净的 URL slug。' },
    'zh-TW': { title: 'Slug 產生器', description: '從標題和片語產生乾淨的 URL slug。' },
    ja: { title: 'Slug生成ツール', description: 'タイトルやフレーズから、URLに使いやすいきれいなslugを作成します。' },
    ko: { title: 'Slug 생성기', description: '제목과 문구에서 깔끔한 URL slug를 만듭니다.' },
  }, ['slug', 'url']),
  tool('jwt-decoder', 'encoding-decoding-tools', 'validator', 'jwt-decoder', {
    en: { title: 'JWT Decoder', description: 'Decode JWT headers and payloads locally without verifying signatures.' },
    'zh-CN': { title: 'JWT 解码器', description: '在本地解码 JWT 头部和载荷，不进行签名验证。' },
    'zh-TW': { title: 'JWT 解碼器', description: '在本機解碼 JWT 標頭和載荷，不進行簽章驗證。' },
    ja: { title: 'JWTデコーダー', description: '署名検証は行わず、JWTのヘッダーとペイロードをローカルでデコードします。' },
    ko: { title: 'JWT 디코더', description: '서명 검증 없이 JWT 헤더와 페이로드를 로컬에서 디코딩합니다.' },
  }, ['jwt', 'decode']),
  tool('uuid-generator', 'developer-tools', 'generator', 'uuid-generator', {
    en: { title: 'UUID v4 Generator', description: 'Generate random RFC 4122 UUID v4 identifiers in the browser.' },
    'zh-CN': { title: 'UUID v4 生成器', description: '在浏览器中生成随机 RFC 4122 UUID v4 标识符。' },
    'zh-TW': { title: 'UUID v4 產生器', description: '在瀏覽器中產生隨機 RFC 4122 UUID v4 識別碼。' },
    ja: { title: 'UUID v4生成ツール', description: 'RFC 4122に準拠したランダムなUUID v4識別子をブラウザーで生成します。' },
    ko: { title: 'UUID v4 생성기', description: '브라우저에서 RFC 4122 UUID v4 무작위 식별자를 생성합니다.' },
  }, ['uuid', 'id']),
  tool('ulid-generator', 'developer-tools', 'generator', 'ulid-generator', {
    en: { title: 'ULID Generator', description: 'Generate sortable ULID identifiers with timestamp prefixes.' },
    'zh-CN': { title: 'ULID 生成器', description: '生成带时间戳前缀、可排序的 ULID 标识符。' },
    'zh-TW': { title: 'ULID 產生器', description: '產生帶時間戳前綴、可排序的 ULID 識別碼。' },
    ja: { title: 'ULID生成ツール', description: 'タイムスタンプ接頭辞を持つ、並べ替え可能なULID識別子を生成します。' },
    ko: { title: 'ULID 생성기', description: '타임스탬프 접두사가 있는 정렬 가능한 ULID 식별자를 생성합니다.' },
  }, ['ulid', 'id']),
  tool('utm-builder', 'seo-tools', 'generator', 'utm-builder', {
    en: { title: 'UTM Builder', description: 'Build campaign URLs with source, medium, campaign, term, and content parameters.' },
    'zh-CN': { title: 'UTM 链接生成器', description: '生成包含 source、medium、campaign、term 和 content 参数的推广链接。' },
    'zh-TW': { title: 'UTM 連結產生器', description: '產生包含 source、medium、campaign、term 和 content 參數的推廣連結。' },
    ja: { title: 'UTMリンク作成ツール', description: 'source、medium、campaign、term、contentを含むキャンペーンURLを作成します。' },
    ko: { title: 'UTM 링크 생성기', description: 'source, medium, campaign, term, content 파라미터가 포함된 캠페인 URL을 만듭니다.' },
  }, ['seo', 'utm']),
  tool('meta-title-checker', 'seo-tools', 'text-analyze', 'meta-title-checker', {
    en: { title: 'Meta Title Checker', description: 'Check title length and preview whether a page title is SEO friendly.' },
    'zh-CN': { title: 'Meta Title 检查器', description: '检查标题长度，并预览页面标题是否适合 SEO。' },
    'zh-TW': { title: 'Meta Title 檢查器', description: '檢查標題長度，並預覽頁面標題是否適合 SEO。' },
    ja: { title: 'メタタイトルチェッカー', description: 'ページタイトルの長さを確認し、SEOに適した表示かをプレビューします。' },
    ko: { title: '메타 제목 검사기', description: '제목 길이를 확인하고 페이지 제목이 SEO에 적합한지 미리 봅니다.' },
  }, ['seo', 'title']),
  tool('hex-to-rgb', 'developer-tools', 'text-transform', 'hex-to-rgb', {
    en: { title: 'HEX to RGB Converter', description: 'Convert HEX color values into RGB channel values.' },
    'zh-CN': { title: 'HEX 转 RGB', description: '将 HEX 颜色值转换为 RGB 通道值。' },
    'zh-TW': { title: 'HEX 轉 RGB', description: '將 HEX 顏色值轉換為 RGB 通道值。' },
    ja: { title: 'HEXからRGBへ変換', description: 'HEXカラー値をRGBチャンネル値へ変換します。' },
    ko: { title: 'HEX to RGB 변환기', description: 'HEX 색상 값을 RGB 채널 값으로 변환합니다.' },
  }, ['color', 'hex', 'rgb']),
  tool('rgb-to-hex', 'developer-tools', 'text-transform', 'rgb-to-hex', {
    en: { title: 'RGB to HEX Converter', description: 'Convert RGB channel values into a HEX color.' },
    'zh-CN': { title: 'RGB 转 HEX', description: '将 RGB 通道值转换为 HEX 颜色。' },
    'zh-TW': { title: 'RGB 轉 HEX', description: '將 RGB 通道值轉換為 HEX 顏色。' },
    ja: { title: 'RGBからHEXへ変換', description: 'RGBチャンネル値をHEXカラーへ変換します。' },
    ko: { title: 'RGB to HEX 변환기', description: 'RGB 채널 값을 HEX 색상으로 변환합니다.' },
  }, ['color', 'rgb', 'hex']),
  tool('color-contrast-checker', 'developer-tools', 'validator', 'contrast-ratio', {
    en: { title: 'Color Contrast Checker', description: 'Calculate WCAG contrast ratio between two colors.' },
    'zh-CN': { title: '颜色对比度检查器', description: '计算两种颜色之间的 WCAG 对比度。' },
    'zh-TW': { title: '顏色對比度檢查器', description: '計算兩種顏色之間的 WCAG 對比度。' },
    ja: { title: 'カラーコントラストチェッカー', description: '2色のWCAGコントラスト比を計算します。' },
    ko: { title: '색상 대비 검사기', description: '두 색상 사이의 WCAG 대비 비율을 계산합니다.' },
  }, ['color', 'contrast', 'accessibility']),
  tool('timestamp-converter', 'developer-tools', 'text-transform', 'timestamp-converter', {
    en: { title: 'Timestamp Converter', description: 'Convert Unix timestamps to ISO dates and ISO dates back to Unix seconds.' },
    'zh-CN': { title: '时间戳转换器', description: '在 Unix 时间戳和 ISO 日期之间转换。' },
    'zh-TW': { title: '時間戳轉換器', description: '在 Unix 時間戳和 ISO 日期之間轉換。' },
    ja: { title: 'タイムスタンプ変換ツール', description: 'UnixタイムスタンプとISO日時を相互に変換します。' },
    ko: { title: '타임스탬프 변환기', description: 'Unix 타임스탬프와 ISO 날짜를 서로 변환합니다.' },
  }, ['timestamp', 'date']),
  tool('length-converter', 'developer-tools', 'text-transform', 'length-converter', {
    en: { title: 'Length Converter', description: 'Convert common metric and imperial length units.' },
    'zh-CN': { title: '长度单位转换器', description: '转换常见公制和英制长度单位。' },
    'zh-TW': { title: '長度單位轉換器', description: '轉換常見公制和英制長度單位。' },
    ja: { title: '長さ単位変換ツール', description: '一般的なメートル法とヤード・ポンド法の長さ単位を変換します。' },
    ko: { title: '길이 단위 변환기', description: '일반적인 미터법 및 야드파운드 길이 단위를 변환합니다.' },
  }, ['unit', 'length']),
  tool('weight-converter', 'developer-tools', 'text-transform', 'weight-converter', {
    en: { title: 'Weight Converter', description: 'Convert grams, kilograms, pounds, ounces, stones, and tons.' },
    'zh-CN': { title: '重量单位转换器', description: '转换克、千克、磅、盎司、英石和吨。' },
    'zh-TW': { title: '重量單位轉換器', description: '轉換克、公斤、磅、盎司、英石和噸。' },
    ja: { title: '重さ単位変換ツール', description: 'グラム、キログラム、ポンド、オンス、ストーン、トンを変換します。' },
    ko: { title: '무게 단위 변환기', description: '그램, 킬로그램, 파운드, 온스, 스톤, 톤을 변환합니다.' },
  }, ['unit', 'weight']),
  tool('temperature-converter', 'developer-tools', 'text-transform', 'temperature-converter', {
    en: { title: 'Temperature Converter', description: 'Convert Celsius, Fahrenheit, and Kelvin values.' },
    'zh-CN': { title: '温度单位转换器', description: '转换摄氏度、华氏度和开尔文。' },
    'zh-TW': { title: '溫度單位轉換器', description: '轉換攝氏、華氏和克氏溫標。' },
    ja: { title: '温度変換ツール', description: '摂氏、華氏、ケルビンの温度値を変換します。' },
    ko: { title: '온도 변환기', description: '섭씨, 화씨, 켈빈 값을 변환합니다.' },
  }, ['unit', 'temperature']),
  tool('data-size-converter', 'developer-tools', 'text-transform', 'data-size-converter', {
    en: { title: 'Data Size Converter', description: 'Convert bits, bytes, decimal units, and binary data units.' },
    'zh-CN': { title: '数据大小转换器', description: '转换 bit、byte、十进制单位和二进制数据单位。' },
    'zh-TW': { title: '資料大小轉換器', description: '轉換 bit、byte、十進位單位和二進位資料單位。' },
    ja: { title: 'データサイズ変換ツール', description: 'ビット、バイト、10進単位、2進データ単位を変換します。' },
    ko: { title: '데이터 크기 변환기', description: '비트, 바이트, 십진 단위, 이진 데이터 단위를 변환합니다.' },
  }, ['unit', 'data size']),
  tool('regex-tester', 'developer-tools', 'validator', 'regex-tester', {
    en: { title: 'Regex Tester', description: 'Test regular expressions and inspect matches, groups, and named groups.' },
    'zh-CN': { title: '正则表达式测试器', description: '测试正则表达式并查看匹配、分组和命名分组。' },
    'zh-TW': { title: '正規表示式測試器', description: '測試正規表示式並查看匹配、群組和命名群組。' },
    ja: { title: '正規表現テスター', description: '正規表現を試し、マッチ、グループ、名前付きグループを確認します。' },
    ko: { title: '정규식 테스터', description: '정규식을 테스트하고 매치, 그룹, 이름 있는 그룹을 확인합니다.' },
  }, ['regex', 'tester']),
  tool('markdown-toc-generator', 'text-tools', 'generator', 'markdown-toc', {
    en: { title: 'Markdown TOC Generator', description: 'Extract headings and generate a clean Markdown table of contents.' },
    'zh-CN': { title: 'Markdown 目录生成器', description: '提取标题并生成干净的 Markdown 目录。' },
    'zh-TW': { title: 'Markdown 目錄產生器', description: '擷取標題並產生乾淨的 Markdown 目錄。' },
    ja: { title: 'Markdown目次生成ツール', description: '見出しを抽出し、整ったMarkdownの目次を生成します。' },
    ko: { title: 'Markdown 목차 생성기', description: '제목을 추출해 깔끔한 Markdown 목차를 생성합니다.' },
  }, ['markdown', 'toc']),
  tool('markdown-previewer', 'text-tools', 'text-transform', 'markdown-previewer', {
    en: { title: 'Markdown Previewer', description: 'Preview common Markdown headings, lists, links, code, and emphasis locally.' },
    'zh-CN': { title: 'Markdown 预览器', description: '在本地预览常见 Markdown 标题、列表、链接、代码和强调格式。' },
    'zh-TW': { title: 'Markdown 預覽器', description: '在本機預覽常見 Markdown 標題、清單、連結、程式碼和強調格式。' },
  }, ['markdown', 'preview', 'html']),
  tool('diff-checker', 'text-tools', 'text-analyze', 'diff-checker', {
    en: { title: 'Diff Checker', description: 'Compare two text blocks line by line and mark additions and removals.' },
    'zh-CN': { title: '文本差异对比工具', description: '逐行比较两段文本，并标记新增和删除内容。' },
    'zh-TW': { title: '文字差異比對工具', description: '逐行比較兩段文字，並標記新增和刪除內容。' },
  }, ['diff', 'text', 'compare']),
  tool('lorem-ipsum-generator', 'text-tools', 'generator', 'lorem-ipsum-generator', {
    en: { title: 'Lorem Ipsum Generator', description: 'Generate placeholder paragraphs for layouts, mockups, and content drafts.' },
    'zh-CN': { title: 'Lorem Ipsum 生成器', description: '为布局、原型和内容草稿生成占位段落。' },
    'zh-TW': { title: 'Lorem Ipsum 產生器', description: '為版面、原型和內容草稿產生佔位段落。' },
  }, ['lorem ipsum', 'placeholder', 'generator']),
  tool('password-generator', 'developer-tools', 'generator', 'password-generator', {
    en: { title: 'Password Generator', description: 'Generate strong random passwords locally with selected character sets.' },
    'zh-CN': { title: '密码生成器', description: '在本地生成包含所选字符集的强随机密码。' },
    'zh-TW': { title: '密碼產生器', description: '在本機產生包含所選字元集的強隨機密碼。' },
    ja: { title: 'パスワード生成ツール', description: '選択した文字セットで強力なランダムパスワードをローカル生成します。' },
    ko: { title: '비밀번호 생성기', description: '선택한 문자 집합으로 강력한 무작위 비밀번호를 로컬에서 생성합니다.' },
  }, ['password', 'random']),
  tool('random-string-generator', 'developer-tools', 'generator', 'random-string-generator', {
    en: { title: 'Random String Generator', description: 'Generate random strings for IDs, test data, and temporary tokens.' },
    'zh-CN': { title: '随机字符串生成器', description: '生成用于 ID、测试数据和临时令牌的随机字符串。' },
    'zh-TW': { title: '隨機字串產生器', description: '產生用於 ID、測試資料和暫時權杖的隨機字串。' },
    ja: { title: 'ランダム文字列生成ツール', description: 'ID、テストデータ、一時トークン向けのランダム文字列を生成します。' },
    ko: { title: '무작위 문자열 생성기', description: 'ID, 테스트 데이터, 임시 토큰에 사용할 무작위 문자열을 생성합니다.' },
  }, ['random', 'string']),
  tool('image-size-checker', 'image-tools', 'image', 'image-size-checker', {
    en: { title: 'Image Size Checker', description: 'Inspect image dimensions, file size, type, and aspect ratio locally.' },
    'zh-CN': { title: '图片尺寸检查器', description: '在本地检查图片尺寸、文件大小、类型和宽高比。' },
    'zh-TW': { title: '圖片尺寸檢查器', description: '在本機檢查圖片尺寸、檔案大小、類型和長寬比。' },
    ja: { title: '画像サイズチェッカー', description: '画像の寸法、ファイルサイズ、種類、アスペクト比をローカルで確認します。' },
    ko: { title: '이미지 크기 검사기', description: '이미지 크기, 파일 크기, 형식, 가로세로 비율을 로컬에서 확인합니다.' },
  }, ['image', 'size']),
  tool('image-to-base64', 'image-tools', 'image', 'image-to-base64', {
    en: { title: 'Image to Base64', description: 'Convert an image file to a Base64 data URI locally in your browser.' },
    'zh-CN': { title: '图片转 Base64', description: '在浏览器本地将图片文件转换为 Base64 Data URI。' },
    'zh-TW': { title: '圖片轉 Base64', description: '在瀏覽器本機將圖片檔案轉換為 Base64 Data URI。' },
    ja: { title: '画像をBase64へ変換', description: '画像ファイルをブラウザー内でBase64データURIへ変換します。' },
    ko: { title: '이미지 to Base64', description: '이미지 파일을 브라우저에서 로컬로 Base64 데이터 URI로 변환합니다.' },
  }, ['image', 'base64']),
  tool('introvert-extrovert-test', 'personality-tests', 'quiz', 'quiz-introvert-extrovert', {
    en: { title: 'Introvert or Extrovert Test', description: 'A non-clinical self-reflection quiz about social energy and communication style.' },
    'zh-CN': { title: '内向还是外向测试', description: '关于社交能量和沟通风格的非临床自我反思测试。' },
    'zh-TW': { title: '內向還是外向測驗', description: '關於社交能量和溝通風格的非臨床自我反思測驗。' },
    ja: { title: '内向型・外向型セルフチェック', description: '社交エネルギーとコミュニケーション傾向を振り返る非臨床の自己理解クイズ。' },
    ko: { title: '내향형 또는 외향형 테스트', description: '사회적 에너지와 의사소통 방식을 돌아보는 비임상 자기 성찰 퀴즈입니다.' },
  }, ['personality', 'quiz']),
  tool('stress-level-check-in', 'personality-tests', 'quiz', 'quiz-stress', {
    en: { title: 'Stress Level Check-in', description: 'A gentle self-reflection check-in for recent stress patterns, not a diagnosis.' },
    'zh-CN': { title: '压力水平自查', description: '用于近期压力模式的温和自我反思，不构成诊断。' },
    'zh-TW': { title: '壓力程度自查', description: '用於近期壓力模式的溫和自我反思，不構成診斷。' },
    ja: { title: 'ストレス状態チェックイン', description: '最近のストレス傾向をやさしく振り返る非診断のセルフチェック。' },
    ko: { title: '스트레스 수준 체크인', description: '최근 스트레스 패턴을 부드럽게 돌아보는 자기 성찰이며 진단이 아닙니다.' },
  }, ['stress', 'wellbeing']),
  tool('big-five-lite-reflection', 'personality-tests', 'quiz', 'quiz-big-five-lite', {
    en: { title: 'Big Five Lite Reflection', description: 'A short non-clinical reflection across five everyday personality-style themes.' },
    'zh-CN': { title: '大五人格轻量反思', description: '围绕五个日常性格风格主题的非临床简短自我反思。' },
    'zh-TW': { title: '大五人格輕量反思', description: '圍繞五個日常性格風格主題的非臨床簡短自我反思。' },
    ja: { title: 'ビッグファイブ簡易リフレクション', description: '日常的な5つの性格傾向テーマを短く振り返る非臨床の自己理解クイズ。' },
    ko: { title: '빅파이브 라이트 성찰', description: '다섯 가지 일상 성격 경향을 짧게 돌아보는 비임상 자기 성찰입니다.' },
  }, ['personality', 'big five']),
  tool('work-style-reflection', 'personality-tests', 'quiz', 'quiz-work-style', {
    en: { title: 'Work Style Reflection', description: 'Reflect on focus, collaboration, decision style, and follow-through at work.' },
    'zh-CN': { title: '工作风格反思', description: '反思工作中的专注、协作、决策风格和执行习惯。' },
    'zh-TW': { title: '工作風格反思', description: '反思工作中的專注、協作、決策風格和執行習慣。' },
    ja: { title: '働き方リフレクション', description: '仕事での集中、協働、意思決定、やり切り方を振り返ります。' },
    ko: { title: '업무 스타일 성찰', description: '일할 때의 집중, 협업, 의사결정 방식, 실행 습관을 돌아봅니다.' },
  }, ['work style', 'quiz']),
  tool('digital-wellbeing-reflection', 'personality-tests', 'quiz', 'quiz-digital-wellbeing', {
    en: { title: 'Digital Wellbeing Reflection', description: 'A non-clinical check-in on attention, boundaries, and recovery in technology use.' },
    'zh-CN': { title: '数字健康反思', description: '关于技术使用中的注意力、边界和恢复状态的非临床自查。' },
    'zh-TW': { title: '數位健康反思', description: '關於科技使用中的注意力、界線和恢復狀態的非臨床自查。' },
    ja: { title: 'デジタルウェルビーイング振り返り', description: 'テクノロジー利用における注意、境界線、回復を確認する非臨床のセルフチェック。' },
    ko: { title: '디지털 웰빙 성찰', description: '기술 사용에서의 주의력, 경계, 회복 상태를 살펴보는 비임상 체크인입니다.' },
  }, ['digital wellbeing', 'quiz']),
  tool('what-is-mmpi', 'clinical-assessment-guides', 'guide', undefined, {
    en: { title: 'What Is the MMPI?', description: 'An educational overview of the MMPI and why official interpretation requires qualified professionals.' },
    'zh-CN': { title: 'MMPI 是什么？', description: '介绍 MMPI 的用途、边界，以及为什么正式解释需要合格专业人士。' },
    'zh-TW': { title: 'MMPI 是什麼？', description: '介紹 MMPI 的用途、邊界，以及為什麼正式解釋需要合格專業人士。' },
    ja: { title: 'MMPIとは？', description: 'MMPIの概要と、正式な解釈に資格を持つ専門家が必要な理由を学ぶ教育ガイド。' },
    ko: { title: 'MMPI란 무엇인가요?', description: 'MMPI의 개요와 공식 해석에 자격을 갖춘 전문가가 필요한 이유를 설명하는 교육용 안내입니다.' },
  }, ['mmpi', 'guide']),
  tool('scl-90-overview', 'clinical-assessment-guides', 'guide', undefined, {
    en: { title: 'SCL-90 Overview', description: 'An educational guide to SCL-90 concepts, limitations, and responsible interpretation.' },
    'zh-CN': { title: 'SCL-90 症状自评量表介绍', description: '介绍 SCL-90 的概念、局限和负责任的理解方式。' },
    'zh-TW': { title: 'SCL-90 症狀自評量表介紹', description: '介紹 SCL-90 的概念、限制和負責任的理解方式。' },
    ja: { title: 'SCL-90概要', description: 'SCL-90の概念、限界、責任ある読み取り方を説明する教育ガイド。' },
    ko: { title: 'SCL-90 개요', description: 'SCL-90의 개념, 한계, 책임 있는 해석 방법을 설명하는 교육용 안내입니다.' },
  }, ['scl-90', 'guide']),
];

tools.push(
  tool('extract-emails', 'text-tools', 'text-analyze', 'extract-emails', {
    en: { title: 'Extract Emails', description: 'Extract email addresses from text and list each result on a separate line.' },
    'zh-CN': { title: '邮箱提取工具', description: '从文本中提取邮箱地址，并按行列出结果。' },
    'zh-TW': { title: 'Email 擷取工具', description: '從文字中擷取 Email 位址，並按行列出結果。' },
  }, ['email', 'extract']),
  tool('extract-urls', 'text-tools', 'text-analyze', 'extract-urls', {
    en: { title: 'Extract URLs', description: 'Find HTTP and HTTPS links in text and remove common trailing punctuation.' },
    'zh-CN': { title: 'URL 提取工具', description: '从文本中查找 HTTP 和 HTTPS 链接，并去除常见尾部标点。' },
    'zh-TW': { title: 'URL 擷取工具', description: '從文字中尋找 HTTP 和 HTTPS 連結，並去除常見尾端標點。' },
  }, ['url', 'extract']),
  tool('extract-numbers', 'text-tools', 'text-analyze', 'extract-numbers', {
    en: { title: 'Extract Numbers', description: 'Extract integers, decimals, and signed numbers from text.' },
    'zh-CN': { title: '数字提取工具', description: '从文本中提取整数、小数和带符号数字。' },
    'zh-TW': { title: '數字擷取工具', description: '從文字中擷取整數、小數和帶符號數字。' },
  }, ['number', 'extract']),
  tool('remove-empty-lines', 'text-tools', 'text-transform', 'remove-empty-lines', {
    en: { title: 'Remove Empty Lines', description: 'Remove blank and whitespace-only lines from text.' },
    'zh-CN': { title: '删除空行工具', description: '删除文本中的空白行和仅包含空格的行。' },
    'zh-TW': { title: '刪除空行工具', description: '刪除文字中的空白行和僅包含空格的行。' },
  }, ['text', 'cleanup']),
  tool('deduplicate-lines', 'text-tools', 'text-transform', 'deduplicate-lines', {
    en: { title: 'Deduplicate Lines', description: 'Remove duplicate lines while keeping the first occurrence.' },
    'zh-CN': { title: '文本去重工具', description: '删除重复行，同时保留首次出现的内容。' },
    'zh-TW': { title: '文字去重工具', description: '刪除重複行，同時保留首次出現的內容。' },
  }, ['text', 'deduplicate']),
  tool('sort-lines', 'text-tools', 'text-transform', 'sort-lines', {
    en: { title: 'Sort Lines', description: 'Sort text lines alphabetically with case-insensitive ordering.' },
    'zh-CN': { title: '文本排序工具', description: '按字母顺序对文本行进行大小写不敏感排序。' },
    'zh-TW': { title: '文字排序工具', description: '按字母順序對文字行進行大小寫不敏感排序。' },
  }, ['text', 'sort']),
  tool('trim-lines', 'text-tools', 'text-transform', 'trim-lines', {
    en: { title: 'Trim Lines', description: 'Trim leading and trailing whitespace from every line.' },
    'zh-CN': { title: '逐行去空格工具', description: '删除每一行开头和结尾的空白字符。' },
    'zh-TW': { title: '逐行去空白工具', description: '刪除每一行開頭和結尾的空白字元。' },
  }, ['text', 'trim']),
  tool('find-and-replace', 'text-tools', 'text-transform', 'find-replace', {
    en: { title: 'Find and Replace', description: 'Replace matching text with safe literal search behavior.' },
    'zh-CN': { title: '查找替换工具', description: '使用安全的字面量查找方式替换匹配文本。' },
    'zh-TW': { title: '尋找取代工具', description: '使用安全的字面量搜尋方式取代匹配文字。' },
  }, ['text', 'replace']),
  tool('sha1-generator', 'developer-tools', 'generator', 'hash-sha1', {
    en: { title: 'SHA-1 Generator', description: 'Generate SHA-1 hashes locally for checksums and legacy comparisons.' },
    'zh-CN': { title: 'SHA-1 生成器', description: '在本地生成用于校验和旧系统比较的 SHA-1 哈希。' },
    'zh-TW': { title: 'SHA-1 產生器', description: '在本機產生用於校驗和舊系統比較的 SHA-1 雜湊。' },
  }, ['hash', 'sha1']),
  tool('sha256-generator', 'developer-tools', 'generator', 'hash-sha256', {
    en: { title: 'SHA-256 Generator', description: 'Generate SHA-256 hashes locally in your browser.' },
    'zh-CN': { title: 'SHA-256 生成器', description: '在浏览器本地生成 SHA-256 哈希。' },
    'zh-TW': { title: 'SHA-256 產生器', description: '在瀏覽器本機產生 SHA-256 雜湊。' },
    ja: { title: 'SHA-256生成ツール', description: 'ブラウザー内でSHA-256ハッシュをローカル生成します。' },
    ko: { title: 'SHA-256 생성기', description: '브라우저에서 SHA-256 해시를 로컬로 생성합니다.' },
  }, ['hash', 'sha256']),
  tool('sha512-generator', 'developer-tools', 'generator', 'hash-sha512', {
    en: { title: 'SHA-512 Generator', description: 'Generate SHA-512 hashes locally in your browser.' },
    'zh-CN': { title: 'SHA-512 生成器', description: '在浏览器本地生成 SHA-512 哈希。' },
    'zh-TW': { title: 'SHA-512 產生器', description: '在瀏覽器本機產生 SHA-512 雜湊。' },
  }, ['hash', 'sha512']),
  tool('percentage-calculator', 'developer-tools', 'text-transform', 'percentage-calculator', {
    en: { title: 'Percentage Calculator', description: 'Calculate what percentage one value is of another.' },
    'zh-CN': { title: '百分比计算器', description: '计算一个数值占另一个数值的百分比。' },
    'zh-TW': { title: '百分比計算器', description: '計算一個數值佔另一個數值的百分比。' },
    ja: { title: 'パーセンテージ計算機', description: 'ある値が別の値の何パーセントにあたるかを計算します。' },
    ko: { title: '백분율 계산기', description: '한 값이 다른 값의 몇 퍼센트인지 계산합니다.' },
  }, ['percentage', 'calculator']),
  tool('percentage-change-calculator', 'developer-tools', 'text-transform', 'percentage-change', {
    en: { title: 'Percentage Change Calculator', description: 'Calculate percentage increase or decrease between two values.' },
    'zh-CN': { title: '百分比变化计算器', description: '计算两个数值之间的百分比增加或减少。' },
    'zh-TW': { title: '百分比變化計算器', description: '計算兩個數值之間的百分比增加或減少。' },
  }, ['percentage', 'calculator']),
  tool('discount-calculator', 'developer-tools', 'text-transform', 'discount-calculator', {
    en: { title: 'Discount Calculator', description: 'Calculate discounted price from price and discount percentage.' },
    'zh-CN': { title: '折扣计算器', description: '根据价格和折扣百分比计算折后价。' },
    'zh-TW': { title: '折扣計算器', description: '根據價格和折扣百分比計算折後價。' },
  }, ['finance', 'discount']),
  tool('loan-payment-calculator', 'developer-tools', 'text-transform', 'loan-calculator', {
    en: { title: 'Loan Payment Calculator', description: 'Estimate monthly loan payments from principal, rate, and term.' },
    'zh-CN': { title: '贷款月供计算器', description: '根据本金、利率和期限估算贷款月供。' },
    'zh-TW': { title: '貸款月付金計算器', description: '根據本金、利率和期限估算貸款月付金。' },
    ja: { title: 'ローン返済額計算機', description: '元本、利率、期間から毎月のローン返済額を見積もります。' },
    ko: { title: '대출 상환 계산기', description: '원금, 이율, 기간을 바탕으로 월별 대출 상환액을 추정합니다.' },
  }, ['finance', 'loan']),
  tool('compound-interest-calculator', 'developer-tools', 'text-transform', 'compound-interest', {
    en: { title: 'Compound Interest Calculator', description: 'Estimate compound growth over time with repeated compounding.' },
    'zh-CN': { title: '复利计算器', description: '估算按周期复利增长后的金额。' },
    'zh-TW': { title: '複利計算器', description: '估算按週期複利成長後的金額。' },
  }, ['finance', 'compound interest']),
  tool('number-base-converter', 'developer-tools', 'text-transform', 'number-base-converter', {
    en: { title: 'Number Base Converter', description: 'Convert integers between bases from binary to base 36.' },
    'zh-CN': { title: '进制转换器', description: '在二进制到 36 进制之间转换整数。' },
    'zh-TW': { title: '進位轉換器', description: '在二進位到 36 進位之間轉換整數。' },
    ja: { title: '進数変換ツール', description: '整数を2進数から36進数までの任意の基数間で変換します。' },
    ko: { title: '진법 변환기', description: '정수를 2진수부터 36진수까지 서로 변환합니다.' },
  }, ['number', 'base']),
  tool('cron-expression-explainer', 'developer-tools', 'text-analyze', 'cron-explainer', {
    en: { title: 'Cron Expression Explainer', description: 'Explain basic five-field cron expressions in readable language.' },
    'zh-CN': { title: 'Cron 表达式解释器', description: '用可读语言解释基础五字段 Cron 表达式。' },
    'zh-TW': { title: 'Cron 表達式解釋器', description: '用可讀語言解釋基礎五欄位 Cron 表達式。' },
    ja: { title: 'Cron式解説ツール', description: '基本的な5フィールドのCron式を読みやすい言葉で説明します。' },
    ko: { title: 'Cron 표현식 설명기', description: '기본 5필드 Cron 표현식을 읽기 쉬운 문장으로 설명합니다.' },
  }, ['cron', 'developer']),
  tool('css-clamp-generator', 'developer-tools', 'generator', 'css-clamp', {
    en: { title: 'CSS Clamp Generator', description: 'Generate responsive CSS clamp() values from pixel ranges.' },
    'zh-CN': { title: 'CSS Clamp 生成器', description: '根据像素范围生成响应式 CSS clamp() 值。' },
    'zh-TW': { title: 'CSS Clamp 產生器', description: '根據像素範圍產生響應式 CSS clamp() 值。' },
  }, ['css', 'clamp']),
  tool('box-shadow-generator', 'developer-tools', 'generator', 'box-shadow', {
    en: { title: 'Box Shadow Generator', description: 'Generate CSS box-shadow declarations with offsets, blur, spread, and color.' },
    'zh-CN': { title: 'Box Shadow 生成器', description: '生成包含偏移、模糊、扩散和颜色的 CSS 阴影。' },
    'zh-TW': { title: 'Box Shadow 產生器', description: '產生包含位移、模糊、擴散和顏色的 CSS 陰影。' },
  }, ['css', 'shadow']),
  tool('border-radius-generator', 'developer-tools', 'generator', 'border-radius', {
    en: { title: 'Border Radius Generator', description: 'Generate CSS border-radius shorthand values.' },
    'zh-CN': { title: '圆角生成器', description: '生成 CSS border-radius 简写值。' },
    'zh-TW': { title: '圓角產生器', description: '產生 CSS border-radius 簡寫值。' },
  }, ['css', 'border radius']),
  tool('gradient-generator', 'developer-tools', 'generator', 'gradient-generator', {
    en: { title: 'CSS Gradient Generator', description: 'Generate linear-gradient CSS strings from color stops.' },
    'zh-CN': { title: 'CSS 渐变生成器', description: '根据颜色节点生成 linear-gradient CSS 字符串。' },
    'zh-TW': { title: 'CSS 漸層產生器', description: '根據顏色節點產生 linear-gradient CSS 字串。' },
  }, ['css', 'gradient']),
  tool('meta-description-checker', 'seo-tools', 'text-analyze', 'meta-description-checker', {
    en: { title: 'Meta Description Checker', description: 'Check meta description length and snippet usefulness.' },
    'zh-CN': { title: 'Meta Description 检查器', description: '检查 meta description 长度和摘要可用性。' },
    'zh-TW': { title: 'Meta Description 檢查器', description: '檢查 meta description 長度和摘要可用性。' },
  }, ['seo', 'description']),
  tool('serp-preview', 'seo-tools', 'preview', 'serp-preview', {
    en: { title: 'SERP Preview', description: 'Preview how a title, URL, and description may appear in search results.' },
    'zh-CN': { title: '搜索结果预览', description: '预览标题、URL 和描述在搜索结果中的显示效果。' },
    'zh-TW': { title: '搜尋結果預覽', description: '預覽標題、URL 和描述在搜尋結果中的顯示效果。' },
  }, ['seo', 'serp']),
  tool('open-graph-preview', 'seo-tools', 'preview', 'open-graph-preview', {
    en: { title: 'Open Graph Preview', description: 'Generate Open Graph meta tags for social sharing previews.' },
    'zh-CN': { title: 'Open Graph 预览', description: '生成用于社交分享预览的 Open Graph meta 标签。' },
    'zh-TW': { title: 'Open Graph 預覽', description: '產生用於社群分享預覽的 Open Graph meta 標籤。' },
  }, ['seo', 'open graph']),
  tool('twitter-card-preview', 'seo-tools', 'preview', 'twitter-card-preview', {
    en: { title: 'Twitter Card Preview', description: 'Generate Twitter Card meta tags for link previews.' },
    'zh-CN': { title: 'Twitter Card 预览', description: '生成用于链接预览的 Twitter Card meta 标签。' },
    'zh-TW': { title: 'Twitter Card 預覽', description: '產生用於連結預覽的 Twitter Card meta 標籤。' },
  }, ['seo', 'twitter card']),
  tool('canonical-tag-generator', 'seo-tools', 'generator', 'canonical-tag-generator', {
    en: { title: 'Canonical Tag Generator', description: 'Generate a safe canonical link tag for a page URL.' },
    'zh-CN': { title: 'Canonical 标签生成器', description: '为页面 URL 生成安全的 canonical 链接标签。' },
    'zh-TW': { title: 'Canonical 標籤產生器', description: '為頁面 URL 產生安全的 canonical 連結標籤。' },
    ja: { title: 'Canonicalタグ生成ツール', description: 'ページURLに使う安全なcanonicalリンクタグを生成します。' },
    ko: { title: 'Canonical 태그 생성기', description: '페이지 URL에 사용할 안전한 canonical 링크 태그를 생성합니다.' },
  }, ['seo', 'canonical']),
  tool('hreflang-tag-generator', 'seo-tools', 'generator', 'hreflang-tag-generator', {
    en: { title: 'Hreflang Tag Generator', description: 'Generate alternate hreflang link tags for multilingual pages.' },
    'zh-CN': { title: 'Hreflang 标签生成器', description: '为多语言页面生成 alternate hreflang 链接标签。' },
    'zh-TW': { title: 'Hreflang 標籤產生器', description: '為多語言頁面產生 alternate hreflang 連結標籤。' },
    ja: { title: 'Hreflangタグ生成ツール', description: '多言語ページ向けのalternate hreflangリンクタグを生成します。' },
    ko: { title: 'Hreflang 태그 생성기', description: '다국어 페이지용 alternate hreflang 링크 태그를 생성합니다.' },
  }, ['seo', 'hreflang']),
  tool('robots-txt-generator', 'seo-tools', 'generator', 'robots-txt-generator', {
    en: { title: 'Robots.txt Generator', description: 'Generate a simple robots.txt file with allow, disallow, and sitemap lines.' },
    'zh-CN': { title: 'Robots.txt 生成器', description: '生成包含 allow、disallow 和 sitemap 行的 robots.txt。' },
    'zh-TW': { title: 'Robots.txt 產生器', description: '產生包含 allow、disallow 和 sitemap 行的 robots.txt。' },
    ja: { title: 'Robots.txt生成ツール', description: 'allow、disallow、sitemap行を含むシンプルなrobots.txtを生成します。' },
    ko: { title: 'Robots.txt 생성기', description: 'allow, disallow, sitemap 줄이 포함된 간단한 robots.txt 파일을 생성합니다.' },
  }, ['seo', 'robots']),
  tool('faq-schema-generator', 'seo-tools', 'generator', 'faq-schema-generator', {
    en: { title: 'FAQ Schema Generator', description: 'Generate FAQPage JSON-LD structured data.' },
    'zh-CN': { title: 'FAQ Schema 生成器', description: '生成 FAQPage JSON-LD 结构化数据。' },
    'zh-TW': { title: 'FAQ Schema 產生器', description: '產生 FAQPage JSON-LD 結構化資料。' },
  }, ['seo', 'schema']),
  tool('breadcrumb-schema-generator', 'seo-tools', 'generator', 'breadcrumb-schema-generator', {
    en: { title: 'Breadcrumb Schema Generator', description: 'Generate BreadcrumbList JSON-LD structured data.' },
    'zh-CN': { title: '面包屑 Schema 生成器', description: '生成 BreadcrumbList JSON-LD 结构化数据。' },
    'zh-TW': { title: '麵包屑 Schema 產生器', description: '產生 BreadcrumbList JSON-LD 結構化資料。' },
  }, ['seo', 'schema']),
  tool('svg-formatter', 'image-tools', 'text-transform', 'svg-formatter', {
    en: { title: 'SVG Formatter', description: 'Format SVG markup after removing unsafe preview content.' },
    'zh-CN': { title: 'SVG 格式化工具', description: '移除不安全预览内容后格式化 SVG 标记。' },
    'zh-TW': { title: 'SVG 格式化工具', description: '移除不安全預覽內容後格式化 SVG 標記。' },
  }, ['svg', 'formatter']),
  tool('svg-minifier', 'image-tools', 'text-transform', 'svg-minifier', {
    en: { title: 'SVG Minifier', description: 'Minify SVG markup after sanitizing scripts and event handlers.' },
    'zh-CN': { title: 'SVG 压缩工具', description: '清理脚本和事件属性后压缩 SVG 标记。' },
    'zh-TW': { title: 'SVG 壓縮工具', description: '清理腳本和事件屬性後壓縮 SVG 標記。' },
  }, ['svg', 'minify']),
  tool('svg-to-data-uri', 'image-tools', 'text-transform', 'svg-data-uri', {
    en: { title: 'SVG to Data URI', description: 'Convert sanitized SVG markup into a compact data URI.' },
    'zh-CN': { title: 'SVG 转 Data URI', description: '将清理后的 SVG 标记转换为紧凑 Data URI。' },
    'zh-TW': { title: 'SVG 轉 Data URI', description: '將清理後的 SVG 標記轉換為緊湊 Data URI。' },
  }, ['svg', 'data uri']),
  tool('svg-to-jsx', 'image-tools', 'text-transform', 'svg-to-jsx', {
    en: { title: 'SVG to JSX', description: 'Convert sanitized SVG attributes into JSX-friendly names.' },
    'zh-CN': { title: 'SVG 转 JSX', description: '将清理后的 SVG 属性转换为 JSX 友好名称。' },
    'zh-TW': { title: 'SVG 轉 JSX', description: '將清理後的 SVG 屬性轉換為 JSX 友好名稱。' },
  }, ['svg', 'jsx']),
  tool('svg-sanitizer', 'image-tools', 'validator', 'svg-sanitizer', {
    en: { title: 'SVG Sanitizer', description: 'Remove script tags, event handlers, and javascript links from SVG markup.' },
    'zh-CN': { title: 'SVG 安全清理工具', description: '移除 SVG 中的脚本、事件属性和 javascript 链接。' },
    'zh-TW': { title: 'SVG 安全清理工具', description: '移除 SVG 中的腳本、事件屬性和 javascript 連結。' },
  }, ['svg', 'security']),
  tool('image-resize-calculator', 'image-tools', 'image', 'image-resize-calculator', {
    en: { title: 'Image Resize Calculator', description: 'Calculate resized image dimensions while preserving aspect ratio.' },
    'zh-CN': { title: '图片尺寸缩放计算器', description: '在保持宽高比的情况下计算图片缩放尺寸。' },
    'zh-TW': { title: '圖片尺寸縮放計算器', description: '在保持長寬比的情況下計算圖片縮放尺寸。' },
    ja: { title: '画像リサイズ計算ツール', description: 'アスペクト比を保ちながら、リサイズ後の画像寸法を計算します。' },
    ko: { title: '이미지 크기 조정 계산기', description: '가로세로 비율을 유지하면서 조정된 이미지 크기를 계산합니다.' },
  }, ['image', 'resize']),
  tool('image-rotation-normalizer', 'image-tools', 'image', 'image-rotation-normalizer', {
    en: { title: 'Image Rotation Normalizer', description: 'Normalize arbitrary rotation degrees into a 0-359 degree range.' },
    'zh-CN': { title: '图片旋转角度规范化', description: '将任意旋转角度规范化到 0-359 度范围。' },
    'zh-TW': { title: '圖片旋轉角度正規化', description: '將任意旋轉角度正規化到 0-359 度範圍。' },
  }, ['image', 'rotate']),
  tool('social-image-size-checker', 'image-tools', 'image', 'social-image-checker', {
    en: { title: 'Social Image Size Checker', description: 'Check image dimensions against Open Graph, Twitter, Instagram, and YouTube recommendations.' },
    'zh-CN': { title: '社交图片尺寸检查器', description: '检查图片尺寸是否符合 Open Graph、Twitter、Instagram 和 YouTube 推荐。' },
    'zh-TW': { title: '社群圖片尺寸檢查器', description: '檢查圖片尺寸是否符合 Open Graph、Twitter、Instagram 和 YouTube 建議。' },
  }, ['image', 'social']),
  tool('image-grayscale-converter', 'image-tools', 'image', 'image-grayscale', {
    en: { title: 'Image Grayscale Converter', description: 'Convert an uploaded image to grayscale locally using Canvas.' },
    'zh-CN': { title: '图片转灰度工具', description: '使用 Canvas 在本地将上传图片转换为灰度。' },
    'zh-TW': { title: '圖片轉灰階工具', description: '使用 Canvas 在本機將上傳圖片轉換為灰階。' },
  }, ['image', 'grayscale']),
  tool('image-rotate', 'image-tools', 'image', 'image-rotate', {
    en: { title: 'Image Rotate', description: 'Rotate an uploaded image locally and download the PNG result.' },
    'zh-CN': { title: '图片旋转工具', description: '在本地旋转上传图片并下载 PNG 结果。' },
    'zh-TW': { title: '圖片旋轉工具', description: '在本機旋轉上傳圖片並下載 PNG 結果。' },
  }, ['image', 'rotate']),
  tool('image-flip', 'image-tools', 'image', 'image-flip', {
    en: { title: 'Image Flip', description: 'Flip an uploaded image horizontally in your browser.' },
    'zh-CN': { title: '图片翻转工具', description: '在浏览器中水平翻转上传图片。' },
    'zh-TW': { title: '圖片翻轉工具', description: '在瀏覽器中水平翻轉上傳圖片。' },
  }, ['image', 'flip']),
  tool('image-crop', 'image-tools', 'image', 'image-crop', {
    en: { title: 'Image Crop', description: 'Crop an uploaded image to a centered square locally in your browser.' },
    'zh-CN': { title: '图片裁剪工具', description: '在浏览器本地将上传图片裁剪为居中正方形。' },
    'zh-TW': { title: '圖片裁剪工具', description: '在瀏覽器本機將上傳圖片裁剪為置中正方形。' },
  }, ['image', 'crop']),
  tool('image-brightness-adjuster', 'image-tools', 'image', 'image-brightness', {
    en: { title: 'Image Brightness Adjuster', description: 'Increase image brightness locally with Canvas and download the result.' },
    'zh-CN': { title: '图片亮度调整工具', description: '使用 Canvas 在本地提高图片亮度并下载结果。' },
    'zh-TW': { title: '圖片亮度調整工具', description: '使用 Canvas 在本機提高圖片亮度並下載結果。' },
  }, ['image', 'brightness']),
  tool('image-contrast-adjuster', 'image-tools', 'image', 'image-contrast', {
    en: { title: 'Image Contrast Adjuster', description: 'Increase image contrast locally in your browser.' },
    'zh-CN': { title: '图片对比度调整工具', description: '在浏览器本地提高图片对比度。' },
    'zh-TW': { title: '圖片對比度調整工具', description: '在瀏覽器本機提高圖片對比度。' },
  }, ['image', 'contrast']),
  tool('image-saturation-adjuster', 'image-tools', 'image', 'image-saturation', {
    en: { title: 'Image Saturation Adjuster', description: 'Increase image color saturation locally with Canvas.' },
    'zh-CN': { title: '图片饱和度调整工具', description: '使用 Canvas 在本地提高图片色彩饱和度。' },
    'zh-TW': { title: '圖片飽和度調整工具', description: '使用 Canvas 在本機提高圖片色彩飽和度。' },
  }, ['image', 'saturation']),
  tool('add-text-watermark', 'image-tools', 'image', 'image-watermark', {
    en: { title: 'Add Text Watermark', description: 'Add a simple text watermark to an uploaded image locally.' },
    'zh-CN': { title: '添加文字水印', description: '在本地为上传图片添加简单文字水印。' },
    'zh-TW': { title: '新增文字浮水印', description: '在本機為上傳圖片新增簡單文字浮水印。' },
  }, ['image', 'watermark']),
  tool('wifi-qr-payload-generator', 'developer-tools', 'generator', 'wifi-qr-payload', {
    en: { title: 'WiFi QR Payload Generator', description: 'Generate the text payload used by WiFi QR codes.' },
    'zh-CN': { title: 'WiFi 二维码内容生成器', description: '生成 WiFi 二维码使用的文本载荷。' },
    'zh-TW': { title: 'WiFi QR Code 內容產生器', description: '產生 WiFi QR Code 使用的文字載荷。' },
  }, ['qr', 'wifi']),
  tool('vcard-payload-generator', 'developer-tools', 'generator', 'vcard-payload', {
    en: { title: 'vCard Payload Generator', description: 'Generate vCard text for contact QR codes.' },
    'zh-CN': { title: 'vCard 内容生成器', description: '生成用于联系人二维码的 vCard 文本。' },
    'zh-TW': { title: 'vCard 內容產生器', description: '產生用於聯絡人 QR Code 的 vCard 文字。' },
  }, ['qr', 'vcard']),
  tool('qr-code-generator', 'developer-tools', 'generator', 'qr-code-generator', {
    en: { title: 'QR Code Generator', description: 'Generate a QR code as SVG or PNG locally from URLs, text, WiFi payloads, or contact data.' },
    'zh-CN': { title: '二维码生成器', description: '在本地从 URL、文本、WiFi 载荷或联系人数据生成 SVG 或 PNG 二维码。' },
    'zh-TW': { title: 'QR Code 產生器', description: '在本機從 URL、文字、WiFi 內容或聯絡人資料產生 SVG 或 PNG QR Code。' },
  }, ['qr', 'generator', 'svg', 'png']),
  tool('qr-code-reader', 'developer-tools', 'image', 'qr-code-reader', {
    en: { title: 'QR Code Reader', description: 'Decode QR code images locally in the browser without uploading the file.' },
    'zh-CN': { title: '二维码读取器', description: '在浏览器本地解码二维码图片，文件不会上传。' },
    'zh-TW': { title: 'QR Code 讀取器', description: '在瀏覽器本機解碼 QR Code 圖片，檔案不會上傳。' },
  }, ['qr', 'reader', 'image', 'decode']),
  tool('mailto-link-builder', 'developer-tools', 'generator', 'mailto-builder', {
    en: { title: 'Mailto Link Builder', description: 'Build mailto links with subject, body, cc, and bcc parameters.' },
    'zh-CN': { title: 'Mailto 链接生成器', description: '生成包含主题、正文、抄送和密送参数的 mailto 链接。' },
    'zh-TW': { title: 'Mailto 連結產生器', description: '產生包含主旨、正文、副本和密件副本參數的 mailto 連結。' },
  }, ['email', 'mailto']),
  tool('ean13-validator', 'developer-tools', 'validator', 'ean13-validator', {
    en: { title: 'EAN-13 Validator', description: 'Validate EAN-13 barcode digits and checksum.' },
    'zh-CN': { title: 'EAN-13 校验器', description: '校验 EAN-13 条码数字和校验位。' },
    'zh-TW': { title: 'EAN-13 驗證器', description: '驗證 EAN-13 條碼數字和檢查碼。' },
  }, ['barcode', 'ean13']),
  tool('file-summary', 'developer-tools', 'text-analyze', 'file-summary', {
    en: { title: 'File Summary', description: 'Summarize file names, sizes, MIME types, and detected extensions.' },
    'zh-CN': { title: '文件摘要工具', description: '汇总文件名、大小、MIME 类型和检测到的扩展名。' },
    'zh-TW': { title: '檔案摘要工具', description: '彙整檔名、大小、MIME 類型和偵測到的副檔名。' },
  }, ['file', 'summary']),
  tool('base64-size-estimator', 'developer-tools', 'text-analyze', 'base64-size-estimator', {
    en: { title: 'Base64 Size Estimator', description: 'Estimate the encoded Base64 size for a file or byte count.' },
    'zh-CN': { title: 'Base64 大小估算器', description: '估算文件或字节数转换为 Base64 后的大小。' },
    'zh-TW': { title: 'Base64 大小估算器', description: '估算檔案或位元組數轉換為 Base64 後的大小。' },
  }, ['file', 'base64']),
  ...[
    {
      slug: 'communication-style',
      en: { title: 'Communication Style Reflection', description: 'A non-clinical reflection on how you share ideas, listen, and adapt in conversations.' },
      'zh-CN': { title: '沟通风格自我反思', description: '围绕表达想法、倾听方式和对话适应能力的非临床自我反思。' },
      'zh-TW': { title: '溝通風格自我反思', description: '圍繞表達想法、傾聽方式和對話適應能力的非臨床自我反思。' },
    },
    {
      slug: 'conflict-style',
      en: { title: 'Conflict Style Reflection', description: 'Explore how you tend to respond to disagreement, tension, and repair after conflict.' },
      'zh-CN': { title: '冲突风格自我反思', description: '探索你面对分歧、紧张关系和冲突修复时的常见反应方式。' },
      'zh-TW': { title: '衝突風格自我反思', description: '探索你面對分歧、緊張關係和衝突修復時的常見反應方式。' },
    },
    {
      slug: 'learning-style',
      en: { title: 'Learning Style Reflection', description: 'Reflect on how you absorb new information, practice skills, and stay motivated while learning.' },
      'zh-CN': { title: '学习风格自我反思', description: '反思你吸收新信息、练习技能和保持学习动力的常见方式。' },
      'zh-TW': { title: '學習風格自我反思', description: '反思你吸收新資訊、練習技能和保持學習動力的常見方式。' },
    },
    {
      slug: 'career-interest',
      en: { title: 'Career Interest Reflection', description: 'A lightweight reflection on work themes, energy sources, and environments that may fit you.' },
      'zh-CN': { title: '职业兴趣自我反思', description: '围绕工作主题、能量来源和适合环境的轻量非临床自我反思。' },
      'zh-TW': { title: '職涯興趣自我反思', description: '圍繞工作主題、能量來源和適合環境的輕量非臨床自我反思。' },
    },
    {
      slug: 'productivity-style',
      en: { title: 'Productivity Style Reflection', description: 'Review how you plan, focus, recover, and move tasks forward during everyday work.' },
      'zh-CN': { title: '效率风格自我反思', description: '回顾你在日常工作中计划、专注、恢复和推进任务的方式。' },
      'zh-TW': { title: '效率風格自我反思', description: '回顧你在日常工作中規劃、專注、恢復和推進任務的方式。' },
    },
    {
      slug: 'decision-making-style',
      en: { title: 'Decision Making Style Reflection', description: 'Reflect on how you weigh options, use evidence, involve others, and commit to choices.' },
      'zh-CN': { title: '决策风格自我反思', description: '反思你权衡选项、使用证据、邀请他人参与和做出选择的方式。' },
      'zh-TW': { title: '決策風格自我反思', description: '反思你權衡選項、使用證據、邀請他人參與和做出選擇的方式。' },
    },
    {
      slug: 'sleep-habit',
      en: { title: 'Sleep Habit Reflection', description: 'A gentle reflection on bedtime routines, recovery cues, and habits that shape rest.' },
      'zh-CN': { title: '睡眠习惯自我反思', description: '围绕睡前流程、恢复信号和影响休息习惯的温和自我反思。' },
      'zh-TW': { title: '睡眠習慣自我反思', description: '圍繞睡前流程、恢復訊號和影響休息習慣的溫和自我反思。' },
    },
  ].map((item) => tool(`${item.slug}-reflection`, 'personality-tests', 'quiz', `quiz-${item.slug}`, {
    en: item.en,
    'zh-CN': item['zh-CN'],
    'zh-TW': item['zh-TW'],
  }, ['quiz', 'reflection'])),
);

for (const item of tools) {
  item.relatedToolSlugs = tools
    .filter((candidate) => candidate.slug !== item.slug && candidate.categorySlug === item.categorySlug)
    .slice(0, 4)
    .map((candidate) => candidate.slug);
}

export function getTool(slug: string): Tool | undefined {
  return tools.find((item) => item.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((item) => item.slug === slug);
}

export function getToolsByCategory(slug: string): Tool[] {
  return tools.filter((item) => item.categorySlug === slug);
}

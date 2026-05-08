import type { Locale } from './locales';

export type PageCopy = {
  homeBadge: string;
  homeTitle: string;
  categoriesTitle: string;
  categoriesDescription: string;
  searchTitle: string;
  searchDescription: string;
  privacyTitle: string;
  privacyDescription: string;
  privacyIntro: string;
  privacyLocalHeading: string;
  privacyLocalBody: string;
  privacyToolInputHeading: string;
  privacyToolInputBody: string;
  privacyAnalyticsHeading: string;
  privacyAnalyticsBody: string;
  privacyAccountHeading: string;
  privacyAccountBody: string;
  privacyMentalHeading: string;
  privacyMentalBody: string;
  privacySecurityHeading: string;
  privacySecurityBody: string;
  categoryBadge: string;
  categoryWhatHeading: string;
  categorySummary: (toolCount: number, liveCount: number) => string;
  categoryPopularHeading: (categoryTitle: string) => string;
  liveToolBadge: string;
  guideBadge: string;
  useCases: string;
  ymylDisclaimer: string;
  toolHelpHeading: string;
  privacyProcessingHeading: string;
  readingNotesHeading: string;
  toolPrivacyNote: string;
  localProcessingBody: string;
  guideInterpretationBody: string;
  localProcessingItems: string[];
  guideInterpretationItems: string[];
};

export type SearchCopy = {
  label: string;
  shortcutHint: string;
  placeholder: string;
  categoryLabel: string;
  allCategories: string;
  popularTagsLabel: string;
  clearFilters: string;
  loading: string;
  error: string;
  popularTools: string;
  recentlyAdded: string;
  recommendedTools: string;
  noResults: string;
  categoryFallback: string;
  toolFallback: string;
  resultSummary: (count: number, query: string, activeTag: string, hasCategory: boolean) => string;
};

const pageCopy: Partial<Record<Locale, PageCopy>> = {
  en: {
    homeBadge: 'Private by default',
    homeTitle: 'Useful web tools, without the clutter.',
    categoriesTitle: 'Tool Categories',
    categoriesDescription: 'Browse TovolBox tools by workflow, from JSON and SEO to images and self-reflection.',
    searchTitle: 'Search Tools',
    searchDescription: 'Search TovolBox tools by name, category, tag, or keyword.',
    privacyTitle: 'Privacy Policy',
    privacyDescription: 'How TovolBox handles local browser tools and user privacy.',
    privacyIntro: 'Most TovolBox tools process input locally in your browser. We do not require accounts and do not collect psychological test answers.',
    privacyLocalHeading: 'Local processing',
    privacyLocalBody: 'Text, image, JSON, encoding, hashing, and reflection tools are designed to run in the browser whenever the task can be completed locally.',
    privacyToolInputHeading: 'Tool inputs',
    privacyToolInputBody: 'Local tools do not send your pasted text, JSON, images, generated hashes, or reflection answers to TovolBox servers. Search loads a static index from this site, but search text and tool input are not logged by the app.',
    privacyAnalyticsHeading: 'Analytics policy',
    privacyAnalyticsBody: 'If page-level analytics are enabled in the future, they must not collect textbox contents, files, images, JSON payloads, hash inputs, or reflection quiz answers.',
    privacyAccountHeading: 'No accounts required',
    privacyAccountBody: 'You can use the tools without creating an account. Do not paste secrets, credentials, or private personal data into tools unless you understand the result.',
    privacyMentalHeading: 'Reflection answers',
    privacyMentalBody: 'Self-reflection quiz answers stay in the page state. They are not clinical assessments and are not collected by TovolBox.',
    privacySecurityHeading: 'Security notes',
    privacySecurityBody: 'TovolBox uses static pages, browser-side tools, and defensive security headers. Dependency audit findings are reviewed individually instead of applying forced upgrades blindly.',
    categoryBadge: 'Category',
    categoryWhatHeading: 'What you can do here',
    categorySummary: (toolCount, liveCount) => `Browse ${toolCount} tools in this category, including ${liveCount} interactive tools that run directly in the browser.`,
    categoryPopularHeading: (categoryTitle) => `Popular tools in ${categoryTitle}`,
    liveToolBadge: 'Live tool',
    guideBadge: 'Guide',
    useCases: 'Use cases',
    ymylDisclaimer: 'This tool is for personal insight, self-reflection, and educational purposes only. It is not a medical diagnosis, clinical psychological assessment, or substitute for care from a qualified mental health professional.',
    toolHelpHeading: 'What this tool helps with',
    privacyProcessingHeading: 'Privacy and processing notes',
    readingNotesHeading: 'Reading and interpretation notes',
    toolPrivacyNote: 'Tool input stays in this browser and is processed locally. Files, text, JSON, hashes, and reflection answers are not uploaded by these local tools.',
    localProcessingBody: 'This page is designed for browser-side work whenever the task can be completed locally. Review the output before copying, downloading, or sharing it.',
    guideInterpretationBody: 'Use this page as an educational guide. It summarizes concepts without replacing official documentation, expert review, or professional judgment.',
    localProcessingItems: ['Input stays in the browser for local tools', 'Results can be copied or downloaded when supported', 'Refresh the page to clear temporary state'],
    guideInterpretationItems: ['Read the limitations before acting', 'Use official sources for decisions', 'Avoid treating general guidance as a diagnosis'],
  },
  'zh-CN': {
    homeBadge: '默认保护隐私',
    homeTitle: '实用在线工具，少一点干扰。',
    categoriesTitle: '工具分类',
    categoriesDescription: '按工作流浏览 TovolBox 工具，涵盖 JSON、SEO、图片和自我反思。',
    searchTitle: '搜索工具',
    searchDescription: '按名称、分类、标签或关键词搜索 TovolBox 工具。',
    privacyTitle: '隐私政策',
    privacyDescription: '了解 TovolBox 如何处理本地浏览器工具和用户隐私。',
    privacyIntro: '大多数 TovolBox 工具会在你的浏览器本地处理输入。我们不要求注册账号，也不会收集心理测试答案。',
    privacyLocalHeading: '本地处理',
    privacyLocalBody: '文本、图片、JSON、编码、哈希和自我反思工具会尽可能在浏览器中运行。',
    privacyToolInputHeading: '工具输入',
    privacyToolInputBody: '本地工具不会把你粘贴的文本、JSON、图片、哈希输入或自我反思答案发送到 TovolBox 服务器。搜索会从本站加载静态索引，但应用不会记录搜索词或工具输入。',
    privacyAnalyticsHeading: '分析数据原则',
    privacyAnalyticsBody: '如果未来启用页面级统计，也不得采集文本框内容、文件、图片、JSON、哈希输入或自我反思问卷答案。',
    privacyAccountHeading: '无需账号',
    privacyAccountBody: '你无需创建账号即可使用工具。除非你清楚结果用途，否则不要粘贴密钥、凭据或敏感个人数据。',
    privacyMentalHeading: '自我反思答案',
    privacyMentalBody: '自我反思问卷答案只保留在当前页面状态中。它们不是临床评估，TovolBox 不会收集这些答案。',
    privacySecurityHeading: '安全说明',
    privacySecurityBody: 'TovolBox 使用静态页面、浏览器端工具和防御性安全 headers。依赖审计问题会逐项判断，不会盲目执行强制升级。',
    categoryBadge: '分类',
    categoryWhatHeading: '这里可以做什么',
    categorySummary: (toolCount, liveCount) => `此分类包含 ${toolCount} 个工具，其中 ${liveCount} 个交互工具可直接在浏览器中运行。`,
    categoryPopularHeading: (categoryTitle) => `${categoryTitle}中的热门工具`,
    liveToolBadge: '在线工具',
    guideBadge: '指南',
    useCases: '使用场景',
    ymylDisclaimer: '此工具仅用于自我反思和学习，不构成医学诊断、临床心理评估，也不能替代合格专业人士的支持。',
    toolHelpHeading: '这个工具能帮你做什么',
    privacyProcessingHeading: '隐私和处理说明',
    readingNotesHeading: '阅读和理解说明',
    toolPrivacyNote: '工具输入会留在此浏览器中并在本地处理。文件、文本、JSON、哈希输入和自我反思答案不会被这些本地工具上传。',
    localProcessingBody: '只要任务可以本地完成，此页面就会优先在浏览器中处理。复制、下载或分享结果前，请先自行核对。',
    guideInterpretationBody: '此页面作为知识介绍使用，不能替代官方文档、专家审阅或专业判断。',
    localProcessingItems: ['本地工具的输入保留在浏览器中', '支持时可复制或下载结果', '刷新页面可清除临时状态'],
    guideInterpretationItems: ['行动前先了解限制', '重要决策请参考官方来源', '不要把通用说明当作诊断'],
  },
  'zh-TW': {
    homeBadge: '預設保護隱私',
    homeTitle: '實用線上工具，少一點干擾。',
    categoriesTitle: '工具分類',
    categoriesDescription: '依工作流程瀏覽 TovolBox 工具，涵蓋 JSON、SEO、圖片和自我反思。',
    searchTitle: '搜尋工具',
    searchDescription: '依名稱、分類、標籤或關鍵字搜尋 TovolBox 工具。',
    privacyTitle: '隱私政策',
    privacyDescription: '了解 TovolBox 如何處理本機瀏覽器工具和使用者隱私。',
    privacyIntro: '大多數 TovolBox 工具會在你的瀏覽器本機處理輸入。我們不要求註冊帳號，也不會收集心理測驗答案。',
    privacyLocalHeading: '本機處理',
    privacyLocalBody: '文字、圖片、JSON、編碼、雜湊和自我反思工具會盡可能在瀏覽器中執行。',
    privacyToolInputHeading: '工具輸入',
    privacyToolInputBody: '本機工具不會把你貼上的文字、JSON、圖片、雜湊輸入或自我反思答案傳送到 TovolBox 伺服器。搜尋會從本站載入靜態索引，但應用程式不會記錄搜尋詞或工具輸入。',
    privacyAnalyticsHeading: '分析資料原則',
    privacyAnalyticsBody: '如果未來啟用頁面級統計，也不得蒐集文字框內容、檔案、圖片、JSON、雜湊輸入或自我反思問卷答案。',
    privacyAccountHeading: '不需要帳號',
    privacyAccountBody: '你不需要建立帳號即可使用工具。除非你清楚結果用途，否則不要貼上金鑰、憑證或敏感個人資料。',
    privacyMentalHeading: '自我反思答案',
    privacyMentalBody: '自我反思問卷答案只保留在目前頁面狀態中。它們不是臨床評估，TovolBox 不會收集這些答案。',
    privacySecurityHeading: '安全說明',
    privacySecurityBody: 'TovolBox 使用靜態頁面、瀏覽器端工具和防禦性安全 headers。依賴套件審計問題會逐項判斷，不會盲目執行強制升級。',
    categoryBadge: '分類',
    categoryWhatHeading: '這裡可以做什麼',
    categorySummary: (toolCount, liveCount) => `此分類包含 ${toolCount} 個工具，其中 ${liveCount} 個互動工具可直接在瀏覽器中執行。`,
    categoryPopularHeading: (categoryTitle) => `${categoryTitle}中的熱門工具`,
    liveToolBadge: '線上工具',
    guideBadge: '指南',
    useCases: '使用情境',
    ymylDisclaimer: '此工具僅用於自我反思和學習，不構成醫學診斷、臨床心理評估，也不能取代合格專業人士的支持。',
    toolHelpHeading: '這個工具能幫你做什麼',
    privacyProcessingHeading: '隱私和處理說明',
    readingNotesHeading: '閱讀和理解說明',
    toolPrivacyNote: '工具輸入會留在此瀏覽器中並在本機處理。檔案、文字、JSON、雜湊輸入和自我反思答案不會被這些本機工具上傳。',
    localProcessingBody: '只要任務可以本機完成，此頁面就會優先在瀏覽器中處理。複製、下載或分享結果前，請先自行核對。',
    guideInterpretationBody: '此頁面作為知識介紹使用，不能取代官方文件、專家審閱或專業判斷。',
    localProcessingItems: ['本機工具的輸入保留在瀏覽器中', '支援時可複製或下載結果', '重新整理頁面可清除暫時狀態'],
    guideInterpretationItems: ['行動前先了解限制', '重要決策請參考官方來源', '不要把通用說明當作診斷'],
  },
  ja: {
    homeBadge: 'プライバシーを標準で重視',
    homeTitle: '余計なものを省いた、実用的なWebツール。',
    categoriesTitle: 'ツールカテゴリ',
    categoriesDescription: 'JSON、SEO、画像、自分を振り返るためのツールを用途別に探せます。',
    searchTitle: 'ツール検索',
    searchDescription: '名前、カテゴリ、タグ、キーワードからTovolBoxのツールを検索できます。',
    privacyTitle: 'プライバシーポリシー',
    privacyDescription: 'TovolBoxのブラウザー内処理とプライバシーへの考え方。',
    privacyIntro: 'TovolBoxの多くのツールは、入力をブラウザー内で処理します。アカウント登録は不要で、心理系の回答も収集しません。',
    privacyLocalHeading: 'ローカル処理',
    privacyLocalBody: 'テキスト、画像、JSON、エンコード、ハッシュ、自分を振り返るツールは、可能な限りブラウザー内で動作します。',
    privacyToolInputHeading: 'ツールへの入力',
    privacyToolInputBody: 'ローカルツールは、貼り付けたテキスト、JSON、画像、ハッシュ入力、振り返り回答をTovolBoxサーバーへ送信しません。検索はこのサイトの静的インデックスを読み込みますが、アプリは検索語やツール入力を記録しません。',
    privacyAnalyticsHeading: '分析データの方針',
    privacyAnalyticsBody: '将来ページ単位の分析を有効にする場合でも、テキスト欄の内容、ファイル、画像、JSON、ハッシュ入力、振り返りクイズの回答は収集しません。',
    privacyAccountHeading: 'アカウント不要',
    privacyAccountBody: 'アカウントを作成しなくても利用できます。秘密情報、認証情報、個人情報は、結果の扱いを理解している場合だけ入力してください。',
    privacyMentalHeading: '振り返り回答',
    privacyMentalBody: '自分を振り返るクイズの回答はページ内の状態にとどまります。臨床評価ではなく、TovolBoxが回答を収集することもありません。',
    privacySecurityHeading: 'セキュリティについて',
    privacySecurityBody: 'TovolBoxは静的ページ、ブラウザー内ツール、防御的なセキュリティヘッダーを使用します。依存関係の監査結果は個別に確認し、強制アップグレードを盲目的には適用しません。',
    categoryBadge: 'カテゴリ',
    categoryWhatHeading: 'このカテゴリでできること',
    categorySummary: (toolCount, liveCount) => `このカテゴリには${toolCount}個のツールがあり、そのうち${liveCount}個はブラウザーで直接使えるインタラクティブツールです。`,
    categoryPopularHeading: (categoryTitle) => `${categoryTitle}の人気ツール`,
    liveToolBadge: '利用可能なツール',
    guideBadge: 'ガイド',
    useCases: '用途',
    ymylDisclaimer: 'このツールは自己理解と学習のためのものです。医学的診断、臨床心理評価、資格を持つ専門家の支援の代わりにはなりません。',
    toolHelpHeading: 'このツールでできること',
    privacyProcessingHeading: 'プライバシーと処理について',
    readingNotesHeading: '読み方と解釈について',
    toolPrivacyNote: 'ツールへの入力はこのブラウザー内に残り、ローカルで処理されます。ファイル、テキスト、JSON、ハッシュ入力、振り返り回答は、これらのローカルツールからアップロードされません。',
    localProcessingBody: 'ローカルで完了できる作業は、できるだけブラウザー内で処理する設計です。コピー、ダウンロード、共有の前に結果を確認してください。',
    guideInterpretationBody: 'このページは学習用のガイドです。公式ドキュメント、専門家の確認、専門的判断の代わりにはなりません。',
    localProcessingItems: ['ローカルツールの入力はブラウザー内に残ります', '対応している結果はコピーまたはダウンロードできます', 'ページを再読み込みすると一時状態を消せます'],
    guideInterpretationItems: ['利用前に制限を確認してください', '重要な判断には公式情報を使ってください', '一般的な説明を診断として扱わないでください'],
  },
  ko: {
    homeBadge: '기본값은 개인정보 보호',
    homeTitle: '군더더기 없는 실용적인 웹 도구.',
    categoriesTitle: '도구 카테고리',
    categoriesDescription: 'JSON, SEO, 이미지, 자기 성찰 도구를 작업 흐름별로 찾아보세요.',
    searchTitle: '도구 검색',
    searchDescription: '이름, 카테고리, 태그, 키워드로 TovolBox 도구를 검색하세요.',
    privacyTitle: '개인정보 처리방침',
    privacyDescription: 'TovolBox가 브라우저 내 도구와 사용자 개인정보를 다루는 방식입니다.',
    privacyIntro: '대부분의 TovolBox 도구는 입력을 브라우저 안에서 처리합니다. 계정 가입을 요구하지 않으며 심리 관련 답변을 수집하지 않습니다.',
    privacyLocalHeading: '로컬 처리',
    privacyLocalBody: '텍스트, 이미지, JSON, 인코딩, 해시, 자기 성찰 도구는 가능한 한 브라우저 안에서 실행되도록 설계되었습니다.',
    privacyToolInputHeading: '도구 입력',
    privacyToolInputBody: '로컬 도구는 붙여넣은 텍스트, JSON, 이미지, 해시 입력, 자기 성찰 답변을 TovolBox 서버로 보내지 않습니다. 검색은 이 사이트의 정적 인덱스를 불러오지만 앱은 검색어 또는 도구 입력을 기록하지 않습니다.',
    privacyAnalyticsHeading: '분석 데이터 원칙',
    privacyAnalyticsBody: '앞으로 페이지 수준 분석을 사용하더라도 텍스트 상자 내용, 파일, 이미지, JSON, 해시 입력, 자기 성찰 퀴즈 답변은 수집하지 않아야 합니다.',
    privacyAccountHeading: '계정 불필요',
    privacyAccountBody: '계정을 만들지 않아도 도구를 사용할 수 있습니다. 결과의 용도를 이해하지 못한 상태에서는 비밀 정보, 인증 정보, 민감한 개인정보를 붙여넣지 마세요.',
    privacyMentalHeading: '성찰 답변',
    privacyMentalBody: '자기 성찰 퀴즈 답변은 현재 페이지 상태에만 남습니다. 임상 평가가 아니며 TovolBox가 답변을 수집하지 않습니다.',
    privacySecurityHeading: '보안 안내',
    privacySecurityBody: 'TovolBox는 정적 페이지, 브라우저 내 도구, 방어적 보안 headers를 사용합니다. 의존성 감사 결과는 개별적으로 판단하며 강제 업그레이드를 맹목적으로 적용하지 않습니다.',
    categoryBadge: '카테고리',
    categoryWhatHeading: '이 카테고리에서 할 수 있는 일',
    categorySummary: (toolCount, liveCount) => `이 카테고리에는 ${toolCount}개의 도구가 있으며, 그중 ${liveCount}개는 브라우저에서 바로 실행되는 대화형 도구입니다.`,
    categoryPopularHeading: (categoryTitle) => `${categoryTitle} 인기 도구`,
    liveToolBadge: '실행 도구',
    guideBadge: '가이드',
    useCases: '사용 사례',
    ymylDisclaimer: '이 도구는 자기 성찰과 학습을 위한 것입니다. 의학적 진단, 임상 심리 평가, 자격을 갖춘 전문가의 지원을 대신하지 않습니다.',
    toolHelpHeading: '이 도구로 할 수 있는 일',
    privacyProcessingHeading: '개인정보 및 처리 방식',
    readingNotesHeading: '읽기 및 해석 안내',
    toolPrivacyNote: '도구 입력은 이 브라우저 안에 남고 로컬에서 처리됩니다. 파일, 텍스트, JSON, 해시 입력, 자기 성찰 답변은 이러한 로컬 도구에서 업로드되지 않습니다.',
    localProcessingBody: '로컬로 완료할 수 있는 작업은 가능한 한 브라우저 안에서 처리하도록 설계했습니다. 복사, 다운로드, 공유하기 전에 결과를 확인하세요.',
    guideInterpretationBody: '이 페이지는 학습용 안내입니다. 공식 문서, 전문가 검토, 전문적 판단을 대신하지 않습니다.',
    localProcessingItems: ['로컬 도구의 입력은 브라우저 안에 남습니다', '지원되는 결과는 복사하거나 다운로드할 수 있습니다', '페이지를 새로고침하면 임시 상태를 지울 수 있습니다'],
    guideInterpretationItems: ['사용 전에 한계를 확인하세요', '중요한 결정에는 공식 출처를 사용하세요', '일반 안내를 진단처럼 다루지 마세요'],
  },
};

const searchCopy: Partial<Record<Locale, SearchCopy>> = {
  en: {
    label: 'Search tools',
    shortcutHint: 'press /',
    placeholder: 'Search by title, keyword, tag, or description',
    categoryLabel: 'Category',
    allCategories: 'All categories',
    popularTagsLabel: 'Popular tags',
    clearFilters: 'Clear filters',
    loading: 'Loading search index...',
    error: 'Unable to load search results.',
    popularTools: 'Popular tools',
    recentlyAdded: 'Recently added',
    recommendedTools: 'Recommended tools',
    noResults: 'No matching tools found. Try a broader search or one of these popular tools.',
    categoryFallback: 'Category',
    toolFallback: 'Tool',
    resultSummary: (count, query, activeTag, hasCategory) => `${count} ${count === 1 ? 'result' : 'results'}${query ? ` for "${query}"` : ''}${activeTag ? ` tagged "${activeTag}"` : ''}${hasCategory ? ' in the selected category' : ''}.`,
  },
  'zh-CN': {
    label: '搜索工具',
    shortcutHint: '按 / 聚焦',
    placeholder: '按标题、关键词、标签或描述搜索',
    categoryLabel: '分类',
    allCategories: '全部分类',
    popularTagsLabel: '热门标签',
    clearFilters: '清除筛选',
    loading: '正在加载搜索索引...',
    error: '无法加载搜索结果。',
    popularTools: '热门工具',
    recentlyAdded: '最近新增',
    recommendedTools: '推荐工具',
    noResults: '没有找到匹配工具。可以尝试更宽泛的关键词，或查看这些热门工具。',
    categoryFallback: '分类',
    toolFallback: '工具',
    resultSummary: (count, query, activeTag, hasCategory) => `${count} 个结果${query ? `，关键词“${query}”` : ''}${activeTag ? `，标签“${activeTag}”` : ''}${hasCategory ? '，位于所选分类中' : ''}。`,
  },
  'zh-TW': {
    label: '搜尋工具',
    shortcutHint: '按 / 聚焦',
    placeholder: '依標題、關鍵字、標籤或描述搜尋',
    categoryLabel: '分類',
    allCategories: '全部分類',
    popularTagsLabel: '熱門標籤',
    clearFilters: '清除篩選',
    loading: '正在載入搜尋索引...',
    error: '無法載入搜尋結果。',
    popularTools: '熱門工具',
    recentlyAdded: '最近新增',
    recommendedTools: '推薦工具',
    noResults: '找不到符合的工具。可以嘗試更寬泛的關鍵字，或查看這些熱門工具。',
    categoryFallback: '分類',
    toolFallback: '工具',
    resultSummary: (count, query, activeTag, hasCategory) => `${count} 個結果${query ? `，關鍵字「${query}」` : ''}${activeTag ? `，標籤「${activeTag}」` : ''}${hasCategory ? '，位於所選分類中' : ''}。`,
  },
  ja: {
    label: 'ツール検索',
    shortcutHint: '/ でフォーカス',
    placeholder: 'タイトル、キーワード、タグ、説明で検索',
    categoryLabel: 'カテゴリ',
    allCategories: 'すべてのカテゴリ',
    popularTagsLabel: '人気タグ',
    clearFilters: '絞り込みをクリア',
    loading: '検索インデックスを読み込み中...',
    error: '検索結果を読み込めませんでした。',
    popularTools: '人気ツール',
    recentlyAdded: '最近追加',
    recommendedTools: 'おすすめツール',
    noResults: '一致するツールが見つかりません。より広いキーワードか、以下の人気ツールを試してください。',
    categoryFallback: 'カテゴリ',
    toolFallback: 'ツール',
    resultSummary: (count, query, activeTag, hasCategory) => `${count}件の結果${query ? `（「${query}」）` : ''}${activeTag ? `、タグ「${activeTag}」` : ''}${hasCategory ? '、選択したカテゴリ内' : ''}。`,
  },
  ko: {
    label: '도구 검색',
    shortcutHint: '/ 키로 포커스',
    placeholder: '제목, 키워드, 태그, 설명으로 검색',
    categoryLabel: '카테고리',
    allCategories: '모든 카테고리',
    popularTagsLabel: '인기 태그',
    clearFilters: '필터 지우기',
    loading: '검색 인덱스를 불러오는 중...',
    error: '검색 결과를 불러올 수 없습니다.',
    popularTools: '인기 도구',
    recentlyAdded: '최근 추가',
    recommendedTools: '추천 도구',
    noResults: '일치하는 도구를 찾지 못했습니다. 더 넓은 검색어를 사용하거나 아래 인기 도구를 확인해 보세요.',
    categoryFallback: '카테고리',
    toolFallback: '도구',
    resultSummary: (count, query, activeTag, hasCategory) => `${count}개 결과${query ? `, 검색어 "${query}"` : ''}${activeTag ? `, 태그 "${activeTag}"` : ''}${hasCategory ? ', 선택한 카테고리 내' : ''}.`,
  },
};

export function getPageCopy(locale: Locale): PageCopy {
  return pageCopy[locale] ?? pageCopy.en!;
}

export function getSearchCopy(locale: string): SearchCopy {
  return searchCopy[locale as Locale] ?? searchCopy.en!;
}

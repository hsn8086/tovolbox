import type { Locale } from './locales';

export type LocalizedFaq = {
  question: string;
  answer: string;
};

export type LocalizedContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  howToUse: string[];
  useCases: string[];
  faq: LocalizedFaq[];
  keywords: string[];
};

export type ToolKind =
  | 'text-transform'
  | 'text-analyze'
  | 'encode-decode'
  | 'validator'
  | 'generator'
  | 'preview'
  | 'image'
  | 'quiz'
  | 'guide';

export type ToolStatus = 'live' | 'content-only' | 'planned';

export type Category = {
  slug: string;
  icon: string;
  seo: Record<Locale, LocalizedContent>;
};

export type Tool = {
  slug: string;
  kind: ToolKind;
  status: ToolStatus;
  categorySlug: string;
  tags: string[];
  relatedToolSlugs: string[];
  component?: string;
  isLocalOnly: boolean;
  isYMYL?: boolean;
  popularity: number;
  seo: Record<Locale, LocalizedContent>;
};

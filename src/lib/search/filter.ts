export type SearchItem = {
  slug: string;
  type?: 'category' | 'tool';
  title: string;
  description: string;
  categorySlug?: string;
  categoryTitle?: string;
  keywords?: string[];
  tags?: string[];
  popularity?: number;
  url?: string;
};

export type SearchFilterOptions = {
  categorySlug?: string;
  tag?: string;
};

export type CategoryFacet = {
  slug: string;
  title: string;
  count: number;
};

export type TagFacet = {
  tag: string;
  count: number;
};

type ScoredSearchItem = {
  item: SearchItem;
  score: number;
  index: number;
};

export function filterSearchItems(items: SearchItem[], query: string, options: SearchFilterOptions = {}): SearchItem[] {
  const categorySlug = options.categorySlug?.trim();
  const tag = options.tag?.trim().toLocaleLowerCase();
  const terms = query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const scopedItems = items.filter((item) => {
    if (categorySlug && item.categorySlug !== categorySlug) return false;
    if (tag && !(item.tags ?? []).some((itemTag) => itemTag.toLocaleLowerCase() === tag)) return false;
    return true;
  });

  if (terms.length === 0) return scopedItems;

  return scopedItems
    .map<ScoredSearchItem>((item, index) => ({
      item,
      score: scoreSearchItem(item, terms),
      index,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ item }) => item);
}

export function getCategoryFacets(items: SearchItem[]): CategoryFacet[] {
  const categories = new Map<string, CategoryFacet>();
  for (const item of items) {
    if (item.type === 'category') continue;
    const slug = item.categorySlug;
    if (!slug) continue;
    const title = item.categoryTitle ?? item.title;
    const current = categories.get(slug);
    categories.set(slug, { slug, title: current?.title ?? title, count: (current?.count ?? 0) + 1 });
  }

  return [...categories.values()].sort((left, right) => left.title.localeCompare(right.title));
}

export function getTagFacets(items: SearchItem[], limit = 18): TagFacet[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (item.type === 'category') continue;
    for (const tag of item.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag))
    .slice(0, limit);
}

export function getPopularItems(items: SearchItem[], limit = 6): SearchItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type !== 'category')
    .sort((left, right) => (right.item.popularity ?? 0) - (left.item.popularity ?? 0) || left.index - right.index)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getRecentItems(items: SearchItem[], limit = 6): SearchItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type !== 'category')
    .sort((left, right) => right.index - left.index)
    .slice(0, limit)
    .map(({ item }) => item);
}

function scoreSearchItem(item: SearchItem, terms: string[]): number {
  const slug = normalize(item.slug);
  const title = normalize(item.title);
  const description = normalize(item.description);
  const categoryTitle = normalize(item.categoryTitle ?? '');
  const categorySlug = normalize(item.categorySlug ?? '');
  const keywords = (item.keywords ?? []).map(normalize);
  const tags = (item.tags ?? []).map(normalize);

  return terms.reduce((score, term) => {
    let termScore = 0;

    if (title === term) termScore += 120;
    else if (title.startsWith(term)) termScore += 90;
    else if (title.includes(term)) termScore += 70;

    if (slug.includes(term)) termScore += 35;
    if (categoryTitle.includes(term) || categorySlug.includes(term)) termScore += 28;

    termScore += scoreList(keywords, term, 50, 35);
    termScore += scoreList(tags, term, 45, 30);

    if (description.includes(term)) termScore += 15;

    return score + termScore;
  }, 0);
}

function scoreList(values: string[], term: string, exactScore: number, partialScore: number): number {
  return values.reduce((score, value) => {
    if (value === term) return score + exactScore;
    if (value.includes(term)) return score + partialScore;
    return score;
  }, 0);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase();
}

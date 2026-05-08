export type SearchItem = {
  slug: string;
  title: string;
  description: string;
  keywords?: string[];
  tags?: string[];
  url?: string;
};

type ScoredSearchItem = {
  item: SearchItem;
  score: number;
  index: number;
};

export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
  const terms = query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) return items;

  return items
    .map<ScoredSearchItem>((item, index) => ({
      item,
      score: scoreSearchItem(item, terms),
      index,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ item }) => item);
}

function scoreSearchItem(item: SearchItem, terms: string[]): number {
  const title = normalize(item.title);
  const description = normalize(item.description);
  const keywords = (item.keywords ?? []).map(normalize);
  const tags = (item.tags ?? []).map(normalize);

  return terms.reduce((score, term) => {
    let termScore = 0;

    if (title === term) termScore += 120;
    else if (title.startsWith(term)) termScore += 90;
    else if (title.includes(term)) termScore += 70;

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

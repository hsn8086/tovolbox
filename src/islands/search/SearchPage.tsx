import { useEffect, useMemo, useRef, useState } from 'react';
import { getSearchCopy } from '@/data/pageCopy';
import { filterSearchItems, getCategoryFacets, getPopularItems, getRecentItems, getTagFacets, type SearchItem } from '@/lib/search/filter';

type Props = {
  locale: string;
  initialItems?: SearchItem[];
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function SearchPage({ locale, initialItems = [] }: Props) {
  const copy = getSearchCopy(locale);
  const hasInitialItems = initialItems.length > 0;
  const [items, setItems] = useState<SearchItem[]>(initialItems);
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [loadState, setLoadState] = useState<LoadState>(hasInitialItems ? 'ready' : 'idle');
  const [isHydrated, setIsHydrated] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (!hasInitialItems) setLoadState('loading');

    void fetch(`/search-index/${encodeURIComponent(locale)}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load search index: ${response.status}`);
        return response.json() as Promise<SearchItem[]>;
      })
      .then((searchItems) => {
        setItems(searchItems);
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        if (!hasInitialItems) {
          setItems([]);
          setLoadState('error');
        }
      });

    return () => controller.abort();
  }, [hasInitialItems, locale]);

  useEffect(() => {
    setIsHydrated(true);

    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditable = target?.matches('input, textarea, select, [contenteditable="true"]') ?? false;
      if (event.key !== '/' || isEditable || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const categoryFacets = useMemo(() => getCategoryFacets(items), [items]);
  const tagFacets = useMemo(() => getTagFacets(items), [items]);
  const popularItems = useMemo(() => getPopularItems(items), [items]);
  const recentItems = useMemo(() => getRecentItems(items), [items]);
  const suggestions = useMemo(() => getPopularItems(items, 4), [items]);
  const results = useMemo(() => filterSearchItems(items, query, { categorySlug, tag: activeTag }), [activeTag, categorySlug, items, query]);
  const resultCount = results.length;
  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = Boolean(categorySlug || activeTag);
  const showDiscovery = loadState === 'ready' && !hasQuery && !hasActiveFilters;
  const showResults = loadState === 'ready' && !showDiscovery && resultCount > 0;

  function clearFilters() {
    setQuery('');
    setCategorySlug('');
    setActiveTag('');
  }

  return (
    <section className="card" data-search-ready={isHydrated ? 'true' : 'false'} style={{ minHeight: '24rem', padding: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        {copy.label} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>({copy.shortcutHint})</span>
        <input
          ref={searchInputRef}
          className="input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.placeholder}
          aria-describedby="search-result-summary"
        />
      </label>

      {loadState === 'ready' && (
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <label style={{ display: 'grid', gap: '.45rem', fontWeight: 800 }}>
            {copy.categoryLabel}
            <select className="input" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
              <option value="">{copy.allCategories}</option>
              {categoryFacets.map((category) => <option key={category.slug} value={category.slug}>{category.title} ({category.count})</option>)}
            </select>
          </label>

          <div aria-label={copy.popularTagsLabel} style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {tagFacets.map(({ tag, count }) => (
              <button
                key={tag}
                className="btn btn-secondary"
                type="button"
                aria-pressed={activeTag === tag}
                onClick={() => setActiveTag((current) => (current === tag ? '' : tag))}
                style={{ padding: '.45rem .7rem', borderColor: activeTag === tag ? 'var(--accent)' : undefined }}
              >
                {tag} ({count})
              </button>
            ))}
          </div>

          {hasActiveFilters && <button className="btn btn-secondary" type="button" onClick={clearFilters} style={{ justifySelf: 'start' }}>{copy.clearFilters}</button>}
        </div>
      )}

      <p id="search-result-summary" style={{ color: 'var(--muted)', margin: '0 0 1rem' }}>
        {loadState === 'loading' && copy.loading}
        {loadState === 'error' && copy.error}
        {loadState === 'ready' && (showDiscovery ? copy.resultSummary(popularItems.length + recentItems.length, '', '', false) : copy.resultSummary(resultCount, hasQuery ? query.trim() : '', activeTag, Boolean(categorySlug)))}
      </p>

      {showDiscovery && (
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <DiscoveryList title={copy.popularTools} items={popularItems} />
          <DiscoveryList title={copy.recentlyAdded} items={recentItems} />
        </div>
      )}

      {loadState === 'ready' && !showDiscovery && resultCount === 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <p style={{ color: 'var(--muted)', margin: 0 }}>{copy.noResults}</p>
          <DiscoveryList title={copy.recommendedTools} items={suggestions} />
        </div>
      ) : showResults ? (
        <div className="grid-auto">
          {results.map((item) => (
            <a key={`${item.type ?? 'tool'}-${item.slug}`} className="card" href={item.url ?? `/tools/${item.slug}/`} style={{ display: 'block', padding: '1rem' }}>
              <h2 style={{ fontSize: '1.05rem', margin: '0 0 .35rem' }}>{item.title}</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>{item.description}</p>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem', margin: '.65rem 0 0' }}>{item.categoryTitle ?? (item.type === 'category' ? copy.categoryFallback : copy.toolFallback)}</p>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function DiscoveryList({ title, items }: { title: string; items: SearchItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-label={title}>
      <h2 style={{ fontSize: '1rem', margin: '0 0 .65rem' }}>{title}</h2>
      <div className="grid-auto">
        {items.map((item) => (
          <a key={`${title}-${item.slug}`} className="card" href={item.url ?? `/tools/${item.slug}/`} style={{ display: 'block', padding: '.9rem' }}>
            <strong>{item.title}</strong>
            <p style={{ color: 'var(--muted)', lineHeight: 1.5, margin: '.35rem 0 0' }}>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { filterSearchItems, type SearchItem } from '@/lib/search/filter';

type Props = {
  locale: string;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function SearchPage({ locale }: Props) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState('');
  const [loadState, setLoadState] = useState<LoadState>('idle');

  useEffect(() => {
    const controller = new AbortController();
    setLoadState('loading');

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
        setItems([]);
        setLoadState('error');
      });

    return () => controller.abort();
  }, [locale]);

  const results = useMemo(() => filterSearchItems(items, query), [items, query]);
  const resultCount = results.length;
  const hasQuery = query.trim().length > 0;

  return (
    <section className="card" style={{ padding: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Search tools
        <input
          className="input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, keyword, tag, or description"
          aria-describedby="search-result-summary"
        />
      </label>

      <p id="search-result-summary" style={{ color: 'var(--muted)', margin: '0 0 1rem' }}>
        {loadState === 'loading' && 'Loading search index...'}
        {loadState === 'error' && 'Unable to load search results.'}
        {loadState === 'ready' && `${resultCount} ${resultCount === 1 ? 'result' : 'results'}${hasQuery ? ` for "${query.trim()}"` : ''}.`}
      </p>

      {loadState === 'ready' && resultCount === 0 ? (
        <p style={{ color: 'var(--muted)', margin: 0 }}>No matching tools found.</p>
      ) : (
        <div className="grid-auto">
          {results.map((item) => (
            <a key={item.slug} className="card" href={item.url ?? `/tools/${item.slug}/`} style={{ display: 'block', padding: '1rem' }}>
              <h2 style={{ fontSize: '1.05rem', margin: '0 0 .35rem' }}>{item.title}</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>{item.description}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

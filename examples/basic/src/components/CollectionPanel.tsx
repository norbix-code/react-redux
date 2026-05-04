import { useState } from 'react';

import { useFindCollectionQuery } from '../norbix';
import { ErrorBox } from './ErrorBox';

/**
 * Runtime query against `api.database.find` for an arbitrary collection.
 * The cache key is per-collectionName, so switching collections in the
 * input fires a new request once and caches it; flipping back gives you
 * the cached page instantly. Try it.
 */
export function CollectionPanel() {
  const [collectionName, setCollectionName] = useState('orders');

  const { items, isLoading, error } = useFindCollectionQuery(
    { collectionName, take: 5 },
    {
      // skip the request until the input has at least one character
      skip: !collectionName,
      selectFromResult: ({ data, isLoading: l, error: e }) => ({
        items:
          (data as { list?: { result?: unknown[] } } | undefined)?.list?.result ?? [],
        isLoading: l,
        error: e,
      }),
    },
  );

  return (
    <div className="card">
      <h2>Collection peek</h2>
      <label>
        Collection name
        <input
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="orders"
        />
      </label>

      {isLoading && <p>Loading…</p>}
      <ErrorBox error={error} />

      {!isLoading && items.length > 0 && (
        <pre className="json">{JSON.stringify(items, null, 2)}</pre>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="muted">
          No documents in <code>{collectionName}</code>. Try another name, or
          insert one with <code>useInsertOneMutation</code> in your code.
        </p>
      )}
    </div>
  );
}

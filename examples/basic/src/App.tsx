import { LoginPanel } from './components/LoginPanel';
import { UsersPanel } from './components/UsersPanel';
import { CollectionPanel } from './components/CollectionPanel';

export function App() {
  return (
    <main className="page">
      <header className="page__hero">
        <h1>@norbix/react-redux</h1>
        <p className="page__lede">
          Minimal example. The three panels below cover login, a paginated users
          list with invite/block/delete, and a runtime query against a database
          collection. Open the Redux DevTools to watch RTK Query cache + tag
          invalidation in action.
        </p>
      </header>

      <section className="grid">
        <LoginPanel />
        <UsersPanel />
        <CollectionPanel />
      </section>
    </main>
  );
}

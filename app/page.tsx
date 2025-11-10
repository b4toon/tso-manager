import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          TSO Manager
        </h1>
        <p className="text-xl mb-8 text-center">
          System zarządzania statystykami Explorerów
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link
            href="/login"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Zaloguj się{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Zaloguj się aby zobaczyć swoje statystyki
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Dashboard{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Zobacz dashboard z explorerami
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-gray-100 dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-2">API Endpoint</h3>
          <p className="text-sm opacity-75 mb-2">
            Gra może wysyłać dane na endpoint:
          </p>
          <code className="block p-3 rounded bg-white dark:bg-black text-xs">
            POST /api/game/task
          </code>
        </div>
      </div>
    </main>
  );
}


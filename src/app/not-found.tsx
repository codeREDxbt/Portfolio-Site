import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-red">404 / Lost signal</p>
        <h1 className="mt-5 text-5xl font-medium tracking-[-0.05em]">This page is off the grid.</h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          Return to the index to explore selected work and contact options.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Back to index
        </Link>
      </div>
    </main>
  );
}

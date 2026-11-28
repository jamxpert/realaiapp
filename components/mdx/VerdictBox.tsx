interface Verdict {
  rating: number | null;
  bestFor: string;
  notFor: string;
  summary: string;
}

export function VerdictBox({ verdict, toolName }: { verdict: Verdict; toolName: string }) {
  return (
    <aside aria-label="Our verdict" className="not-prose my-8 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">Our verdict on {toolName}</h2>
        <p className="text-lg font-bold">
          {verdict.rating === null ? (
            <span className="text-base font-medium text-muted">Rating coming soon</span>
          ) : (
            <>
              {verdict.rating}
              <span className="text-base font-normal text-muted">/10</span>
            </>
          )}
        </p>
      </div>
      <p className="mt-3">{verdict.summary}</p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold text-accent">Best for</dt>
          <dd className="mt-1">{verdict.bestFor}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-muted">Not for</dt>
          <dd className="mt-1">{verdict.notFor}</dd>
        </div>
      </dl>
    </aside>
  );
}

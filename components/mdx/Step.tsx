import type { ReactNode } from "react";

export function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${number}`} className="my-8 grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 sm:gap-x-4">
      <span
        aria-hidden="true"
        className="not-prose grid size-10 place-items-center rounded-full bg-button font-display font-bold text-white"
      >
        {number}
      </span>
      <div>
        <h3 id={`step-${number}`} className="mt-1.5! mb-2!">
          <span className="sr-only">Step {number}: </span>
          {title}
        </h3>
        <div className="[&>*:first-child]:mt-0">{children}</div>
      </div>
    </section>
  );
}

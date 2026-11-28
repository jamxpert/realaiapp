export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="not-prose my-6 divide-y divide-line rounded-2xl border border-line">
      {items.map((item) => (
        <details key={item.question} className="group px-4 py-1 sm:px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span aria-hidden="true" className="text-xl text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="pb-4 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

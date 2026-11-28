function List({ title, items, sign }: { title: string; items: string[]; sign: "+" | "−" }) {
  return (
    <div className="rounded-2xl border border-line p-5">
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className={`font-bold ${sign === "+" ? "text-accent" : "text-muted"}`}>
              {sign}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="not-prose my-8 grid gap-4 md:grid-cols-2">
      <List title="Pros" items={pros} sign="+" />
      <List title="Cons" items={cons} sign="−" />
    </div>
  );
}

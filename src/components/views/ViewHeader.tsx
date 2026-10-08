type ViewHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

export function ViewHeader({ eyebrow, title, intro }: ViewHeaderProps) {
  return (
    <header>
      <p className="eyebrow">▸ {eyebrow}</p>
      <h2 className="display-lg mt-4 text-4xl text-ivory phosphor-text sm:text-5xl">{title}</h2>
      <div className="rule rule--gold mt-6 w-24" />
      {intro ? (
        <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-ivory-muted">{intro}</p>
      ) : null}
    </header>
  );
}
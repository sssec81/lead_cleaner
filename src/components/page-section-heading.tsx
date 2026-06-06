type PageSectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
};

export function PageSectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: PageSectionHeadingProps) {
  return (
    <div className={align === "center" ? "section-heading section-heading-center" : "section-heading"}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.85rem]">
        {title}
      </h2>
      {intro ? (
        <p className="section-intro text-base leading-8 text-[color:var(--muted)] sm:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

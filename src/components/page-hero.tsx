import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  aside?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  intro,
  aside,
  className = "",
}: PageHeroProps) {
  return (
    <section className={`page-section ${className}`.trim()}>
      <div className={aside ? "page-hero-grid" : ""}>
        <div>
          <p className="tool-hero-kicker">{eyebrow}</p>
          <h1 className="tool-hero-title mt-4 font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-[3.85rem]">
            {title}
          </h1>
          <p className="tool-hero-intro mt-5 text-base leading-8 sm:text-lg">
            {intro}
          </p>
        </div>
        {aside ? <div className="page-hero-aside">{aside}</div> : null}
      </div>
    </section>
  );
}

import { CatalogLabel } from "@/components/catalog-label";
import { Reveal } from "@/components/reveal";
import { journey } from "@/data/portfolio";

export function JourneySection() {
  return (
    <section
      id="journey"
      className="halftone-light scroll-mt-18 bg-paper px-5 py-20 text-ink sm:px-8 sm:py-24 lg:px-12 lg:py-30"
    >
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[minmax(18rem,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
        <Reveal>
          <CatalogLabel index="05">Journey tracklist</CatalogLabel>
          <h2 className="mt-8 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            The story so far.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/65">
            An undated record of what I’m learning now and where I’m heading.
          </p>
        </Reveal>

        <ol className="border-t border-ink/25">
          {journey.map((chapter, index) => (
            <li key={chapter.title} className="border-b border-ink/25">
              <Reveal delay={index * 0.06}>
                <div className="grid gap-5 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:py-10">
                  <span className="font-catalog text-xs tracking-[0.12em] text-accent">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl leading-tight sm:text-4xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-ink/65 sm:text-lg sm:leading-8">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { CatalogLabel } from "@/components/catalog-label";
import { InterestExplorer } from "@/components/interest-explorer";
import { Reveal } from "@/components/reveal";

export function InterestsSection() {
  return (
    <section
      id="interests"
      className="paper-texture scroll-mt-18 bg-paper px-5 py-20 text-ink sm:px-8 sm:py-24 lg:px-12 lg:py-30"
    >
      <div className="mx-auto max-w-[90rem]">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(20rem,0.65fr)] lg:items-end">
          <div>
            <CatalogLabel index="03">Interest index</CatalogLabel>
            <h2 className="mt-8 max-w-4xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Six signals on the same desk.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-ink/65 lg:justify-self-end">
            Select a track to inspect the object and read why it matters.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 lg:mt-16">
          <InterestExplorer />
        </Reveal>
      </div>
    </section>
  );
}

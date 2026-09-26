import { CatalogLabel } from "@/components/catalog-label";
import { InterestExplorer } from "@/components/interest-explorer";
import { Reveal } from "@/components/reveal";

export function InterestsSection() {
  return (
    <section
      id="interests"
      className="paper-texture flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper px-4 py-4 text-ink sm:px-8 sm:py-6 lg:px-12"
    >
      <div className="w-full max-w-[90rem]">
        <div className="rounded-xl border-2 border-ink/20 bg-paper-deep/30 p-4 shadow-sm sm:p-6 lg:p-7">
          <Reveal className="mb-4 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
            <div>
              <CatalogLabel index="03">Interest index</CatalogLabel>
              <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
                Six signals on the same desk.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-ink/65 lg:text-right">
              Select a track to inspect the object and read why it matters.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <InterestExplorer />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

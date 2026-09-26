import Image from "next/image";
import { CatalogLabel } from "@/components/catalog-label";
import { Reveal } from "@/components/reveal";
import { journey } from "@/data/portfolio";

export function JourneySection() {
  const timeStamps = ["00:00 START", "24:10 RUNNING", "45:00 TARGET"];

  return (
    <section
      id="journey"
      className="halftone-light relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper px-4 py-4 text-ink sm:px-8 sm:py-6 lg:px-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(246, 241, 230, 0.94), rgba(239, 231, 218, 0.96)), url('/assets/retro/vintage-paper.jpg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-[90rem]">
        <div className="grid gap-6 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] lg:gap-12 lg:items-center">
          <Reveal>
            <CatalogLabel index="05">Journey tracklist</CatalogLabel>
            <h2 className="mt-2 font-display text-3xl leading-[0.95] sm:text-4xl lg:text-5xl">
              The story so far.
            </h2>
            <p className="mt-3 max-w-md text-xs leading-5 text-ink/70 sm:text-sm">
              An undated record of what I am learning now and where I am heading.
            </p>

            {/* Vintage Radio Broadcast & Tape Chronicle Card */}
            <div className="mt-4 hidden rounded-lg border border-ink/20 bg-paper-deep/80 p-3.5 font-catalog text-xs text-ink/80 lg:block shadow-xs">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <span className="font-bold text-accent">CHRONICLE // DISPATCH LOG</span>
                <span className="text-ink/60">BAND: SHORTWAVE 7.2 MHz</span>
              </div>
              <p className="mt-2 text-[0.72rem] leading-relaxed">
                Recording progress through foundational software engineering, systems networking, and AI development on magnetic master tape.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded border border-ink/20">
                  <Image
                    src="/assets/retro/vintage-stamps.jpg"
                    alt="Vintage radio transmission stamp"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-[0.65rem] text-ink/60">
                  <p className="font-semibold text-ink">OFFICIAL POSTMARK</p>
                  <p>ARCHIVE STAMP OCT 1974</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Analog Timeline List */}
          <ol className="relative border-t border-ink/25">
            {journey.map((chapter, index) => (
              <li key={chapter.title} className="relative border-b border-ink/25">
                <Reveal delay={index * 0.05}>
                  <div className="grid gap-2 py-3 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:py-4">
                    {/* Tape Spool Counter & Index */}
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-catalog text-xs font-bold tracking-[0.1em] text-accent">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="rounded bg-charcoal/10 px-1 py-0.2 font-catalog text-[0.58rem] text-ink-muted">
                        {timeStamps[index] ?? "00:00"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">
                        {chapter.title}
                      </h3>
                      <p className="mt-0.5 max-w-2xl text-xs leading-5 text-ink/75 sm:text-sm sm:leading-6">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

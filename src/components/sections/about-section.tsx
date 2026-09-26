import { CatalogLabel } from "@/components/catalog-label";
import { Reveal } from "@/components/reveal";
import { profile } from "@/data/portfolio";

export function AboutSection() {
  return (
    <section
      id="about"
      className="paper-texture flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper px-4 py-4 text-ink sm:px-8 sm:py-6 lg:px-12"
    >
      <div className="w-full max-w-[90rem]">
        {/* Cassette J-Card Inlay Envelope Container */}
        <div className="rounded-xl border-2 border-ink/20 bg-paper-deep/40 p-4 shadow-sm sm:p-6 lg:p-8">
          {/* J-Card Spine Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-2 font-catalog text-xs tracking-[0.12em] text-ink/60">
            <div className="flex items-center gap-2">
              <span className="rounded bg-accent px-1.5 py-0.5 font-bold text-cream">
                J-CARD // INLAY
              </span>
              <span>CAT NO. ARIL-1980</span>
            </div>
            <span>MASTER CASSETTE CHRONICLE // INDONESIA</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] lg:gap-10">
            <Reveal>
              <CatalogLabel index="01">Liner notes</CatalogLabel>
              <h2 className="mt-2 max-w-xl font-display text-3xl leading-[0.95] sm:text-4xl lg:text-5xl">
                Learning by building.
              </h2>

              {/* Study & Location Badges */}
              <dl className="mt-4 grid gap-2.5 border-t border-ink/20 pt-3 font-catalog text-xs">
                <div className="rounded border border-ink/15 bg-paper p-2.5">
                  <dt className="tracking-[0.08em] text-ink/50">CURRENT STUDY</dt>
                  <dd className="mt-0.5 font-sans text-xs sm:text-sm font-semibold text-ink">
                    Computer Networking and Telecommunications
                  </dd>
                </div>
                <div className="rounded border border-ink/15 bg-paper p-2.5">
                  <dt className="tracking-[0.08em] text-ink/50">LOCATION & TIMEZONE</dt>
                  <dd className="mt-0.5 font-sans text-xs sm:text-sm font-semibold text-ink">
                    {profile.location} ({profile.timezone.split(",")[0]})
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.06} className="flex flex-col justify-between">
              <div>
                <p className="font-catalog text-[0.68rem] tracking-[0.14em] text-ink/45">
                  SIDE A BIOGRAPHY & PHILOSOPHY
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-base sm:leading-7">
                  {profile.biography}
                </p>
              </div>

              <div className="mt-4 border-l-2 border-accent bg-paper/60 p-3 rounded-r">
                <p className="font-catalog text-[0.65rem] tracking-[0.12em] text-accent font-bold">
                  CAREER DIRECTION
                </p>
                <p className="mt-1 font-display text-lg leading-snug sm:text-xl text-ink">
                  {profile.careerGoal}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-ink/15 pt-2 font-catalog text-[0.62rem] tracking-[0.1em] text-ink/40">
                <span>PRINTED ON ACID-FREE ARCHIVAL PAPER</span>
                <span>AUTHENTIC ANALOG PORTFOLIO</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

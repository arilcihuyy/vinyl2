"use client";

import Image from "next/image";
import { useState } from "react";
import { CatalogLabel } from "@/components/catalog-label";
import { Reveal } from "@/components/reveal";
import { profile } from "@/data/portfolio";

export function AboutSection() {
  const [viewMode, setViewMode] = useState<"notes" | "newspaper">("notes");

  return (
    <section
      id="about"
      className="paper-texture relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper px-4 py-4 text-ink sm:px-8 sm:py-6 lg:px-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(246, 241, 230, 0.92), rgba(239, 231, 218, 0.95)), url('/assets/retro/vintage-paper.jpg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-[90rem]">
        {/* Main Retro Archival Card */}
        <div className="relative rounded-xl border-2 border-ink/20 bg-paper/90 p-4 shadow-xl sm:p-6 lg:p-8 backdrop-blur-xs">
          {/* Decorative Vintage Postage Stamp (Top Right Corner) */}
          <div
            className="absolute -top-3 right-6 z-20 hidden sm:block rotate-3 shadow-md transition-transform hover:rotate-0"
            aria-hidden="true"
          >
            <div className="relative size-16 sm:size-20 overflow-hidden rounded border border-ink/30 bg-[#25221F] p-0.5">
              <Image
                src="/assets/retro/vintage-stamps.jpg"
                alt="Vintage radio broadcast postage stamp"
                fill
                className="object-cover"
              />
              {/* Tape strip over stamp */}
              <div className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 -rotate-6 bg-paper-deep/70 backdrop-blur-xs shadow-xs" />
            </div>
          </div>

          {/* J-Card Spine Header with Tab Mode Switcher */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-2 font-catalog text-xs tracking-[0.12em] text-ink/70">
            <div className="flex items-center gap-2">
              <span className="rounded bg-accent px-1.5 py-0.5 font-bold text-cream">
                ARCHIVE // LINER
              </span>
              <span>CAT NO. ARIL-1974</span>
            </div>

            {/* Document Switcher Toggle */}
            <div className="flex items-center rounded-lg border border-ink/20 bg-paper-deep/80 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("notes")}
                className={`rounded px-2.5 py-1 font-catalog text-[0.68rem] font-bold transition-colors focus-visible:outline-accent ${
                  viewMode === "notes"
                    ? "bg-accent text-cream shadow-xs"
                    : "text-ink/65 hover:text-ink"
                }`}
                aria-pressed={viewMode === "notes"}
              >
                LINER NOTES
              </button>
              <button
                type="button"
                onClick={() => setViewMode("newspaper")}
                className={`rounded px-2.5 py-1 font-catalog text-[0.68rem] font-bold transition-colors focus-visible:outline-accent ${
                  viewMode === "newspaper"
                    ? "bg-accent text-cream shadow-xs"
                    : "text-ink/65 hover:text-ink"
                }`}
                aria-pressed={viewMode === "newspaper"}
              >
                1973 PRESS BROADSHEET
              </button>
            </div>
          </div>

          {viewMode === "notes" ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] lg:gap-10">
              <Reveal>
                <CatalogLabel index="01">Liner notes</CatalogLabel>
                <h2 className="mt-2 max-w-xl font-display text-3xl leading-[0.95] sm:text-4xl lg:text-5xl">
                  Learning by building.
                </h2>

                {/* Study & Location Badges with Typewriter Styling */}
                <dl className="mt-4 grid gap-2.5 border-t border-ink/20 pt-3 font-catalog text-xs">
                  <div className="rounded border border-ink/15 bg-paper-deep/60 p-2.5 shadow-xs">
                    <dt className="tracking-[0.08em] text-ink/60">CURRENT STUDY</dt>
                    <dd className="mt-0.5 font-sans text-xs sm:text-sm font-semibold text-ink">
                      Computer Networking and Telecommunications
                    </dd>
                  </div>
                  <div className="rounded border border-ink/15 bg-paper-deep/60 p-2.5 shadow-xs">
                    <dt className="tracking-[0.08em] text-ink/60">LOCATION & TIMEZONE</dt>
                    <dd className="mt-0.5 font-sans text-xs sm:text-sm font-semibold text-ink">
                      {profile.location} ({profile.timezone.split(",")[0]})
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.06} className="flex flex-col justify-between">
                <div>
                  <p className="font-catalog text-[0.68rem] tracking-[0.14em] text-ink/60 font-semibold">
                    SIDE A BIOGRAPHY & PHILOSOPHY
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/85 sm:text-base sm:leading-7">
                    {profile.biography}
                  </p>
                </div>

                <div className="mt-4 rounded-r border-l-3 border-accent bg-paper-deep/80 p-3 shadow-xs">
                  <p className="font-catalog text-[0.65rem] font-bold tracking-[0.12em] text-accent">
                    CAREER DIRECTION
                  </p>
                  <p className="mt-1 font-display text-lg leading-snug sm:text-xl text-ink">
                    {profile.careerGoal}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-ink/15 pt-2 font-catalog text-[0.62rem] tracking-[0.1em] text-ink/60">
                  <span>PRINTED ON ACID-FREE ARCHIVAL PAPER</span>
                  <span>AUTHENTIC ANALOG PORTFOLIO</span>
                </div>
              </Reveal>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)] md:items-center">
              {/* Authentic Vintage Newspaper Broadsheet Display */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-ink/30 bg-[#2C241E] shadow-2xl">
                <Image
                  src="/assets/retro/vintage-newspaper.jpg"
                  alt="Vintage newspaper clipping The Daily Chronicle 1973"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded bg-charcoal/80 px-3 py-1.5 font-catalog text-[0.65rem] text-cream backdrop-blur-xs">
                  <span>THE DAILY CHRONICLE // NOV 1973</span>
                  <span className="text-amber-300">AUTHENTIC PRESS PRINT</span>
                </div>
              </div>

              <div>
                <span className="font-catalog text-xs font-bold tracking-[0.14em] text-accent">
                  RETRO PRESS ARCHIVE
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl text-ink">
                  Preserved in classic print.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base sm:leading-7">
                  Like vintage newsprint broadsheets that document history in raw ink, this portfolio is built to reflect genuine craftsmanship: no synthetic shortcuts, just solid foundations in computer networks, code, and analog aesthetics.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 font-catalog text-xs">
                  <span className="rounded border border-ink/20 bg-paper-deep px-2.5 py-1">
                    NEWSPAPER BROADSHEET
                  </span>
                  <span className="rounded border border-ink/20 bg-paper-deep px-2.5 py-1">
                    HALFTONE PRESS
                  </span>
                  <span className="rounded border border-ink/20 bg-paper-deep px-2.5 py-1">
                    TYPEWRITER DISPATCH
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

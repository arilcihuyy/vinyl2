import { HeroVisual } from "@/components/hero-visual";
import { CatalogLabel } from "@/components/catalog-label";
import { profile } from "@/data/portfolio";

export function HeroSection() {
  return (
    <section className="halftone-dark relative isolate flex h-full w-full flex-col justify-center overflow-hidden bg-charcoal px-4 py-4 text-cream sm:px-8 sm:py-6 lg:px-12">
      <div className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full border border-cream/10 sm:-right-12 sm:size-[30rem]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 top-24 size-48 rounded-full border border-cream/10 sm:right-10 sm:size-[20rem]" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-[90rem] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-center lg:gap-12">
        <div className="max-w-3xl">
          <CatalogLabel index="00" tone="dark">
            Personal record
          </CatalogLabel>
          <h1 className="mt-3 font-display text-6xl leading-[0.8] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Aril
          </h1>
          <p className="mt-4 max-w-2xl font-display text-2xl leading-tight text-cream sm:text-3xl lg:text-4xl">
            {profile.tagline}
          </p>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-cream/70 sm:text-base">
            {profile.role}
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#music"
              className="flex min-h-11 items-center justify-center rounded-sm bg-accent px-5 text-center text-xs sm:text-sm font-bold text-cream transition-colors duration-200 hover:bg-accent-dark focus-visible:outline-accent-light"
            >
              See the Tracklist
            </a>
            <a
              href="#about"
              className="flex min-h-11 items-center justify-center rounded-sm border border-cream/40 px-5 text-center text-xs sm:text-sm font-bold transition-colors duration-200 hover:bg-cream hover:text-charcoal focus-visible:outline-accent-light"
            >
              Meet Aril
            </a>
          </div>

          <dl className="mt-5 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2 border-t border-cream/15 pt-3 font-catalog text-xs tracking-[0.1em]">
            <div>
              <dt className="text-cream/45">BASED IN</dt>
              <dd className="mt-0.5 text-cream/80">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-cream/45">TIMEZONE</dt>
              <dd className="mt-0.5 text-cream/80">WITA</dd>
            </div>
          </dl>
        </div>

        <div className="mx-auto w-full max-w-[20rem] sm:max-w-[23rem] lg:max-w-[26rem]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

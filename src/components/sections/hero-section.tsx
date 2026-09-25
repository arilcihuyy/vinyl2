import { HeroVisual } from "@/components/hero-visual";
import { CatalogLabel } from "@/components/catalog-label";
import { profile } from "@/data/portfolio";

export function HeroSection() {
  return (
    <section className="halftone-dark relative isolate overflow-hidden bg-charcoal px-5 py-16 text-cream sm:px-8 sm:py-20 lg:min-h-[calc(100svh-4.5rem)] lg:px-12 lg:py-24">
      <div className="pointer-events-none absolute -right-24 top-20 size-80 rounded-full border border-cream/10 sm:-right-12 sm:size-[34rem]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 top-36 size-56 rounded-full border border-cream/10 sm:right-10 sm:size-[24rem]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(26rem,0.96fr)] lg:items-center lg:gap-16">
        <div className="max-w-4xl">
          <CatalogLabel index="00" tone="dark">
            Personal record
          </CatalogLabel>
          <h1 className="mt-8 font-display text-[clamp(5.5rem,20vw,13rem)] leading-[0.72] tracking-[-0.055em]">
            Aril
          </h1>
          <p className="mt-9 max-w-3xl font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
            {profile.tagline}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-cream/65 sm:text-lg">
            {profile.role}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#music"
              className="flex min-h-13 items-center justify-center rounded-sm bg-accent px-6 text-center text-sm font-bold text-cream transition-colors duration-200 hover:bg-accent-dark focus-visible:outline-accent-light"
            >
              See the Tracklist
            </a>
            <a
              href="#about"
              className="flex min-h-13 items-center justify-center rounded-sm border border-cream/40 px-6 text-center text-sm font-bold transition-colors duration-200 hover:bg-cream hover:text-charcoal focus-visible:outline-accent-light"
            >
              Meet Aril
            </a>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-cream/15 pt-6 font-catalog text-xs tracking-[0.1em]">
            <div>
              <dt className="text-cream/45">BASED IN</dt>
              <dd className="mt-2 text-cream/80">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-cream/45">TIMEZONE</dt>
              <dd className="mt-2 text-cream/80">WITA</dd>
            </div>
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

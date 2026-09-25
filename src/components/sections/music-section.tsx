import { CatalogLabel } from "@/components/catalog-label";
import { MusicPlayer } from "@/components/music-player";
import { Reveal } from "@/components/reveal";

export function MusicSection() {
  return (
    <section
      id="music"
      className="halftone-dark scroll-mt-18 bg-charcoal px-5 py-20 text-cream sm:px-8 sm:py-24 lg:px-12 lg:py-30"
    >
      <div className="mx-auto max-w-[90rem]">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.6fr)] lg:items-end">
          <div>
            <CatalogLabel index="02" tone="dark">
              Favorite music
            </CatalogLabel>
            <h2 className="mt-8 font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              A side built around Radiohead.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-cream/65 lg:justify-self-end">
            The tracklist is ready for legally usable audio and artwork. Until then, the player stays visible and clearly unavailable.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 lg:mt-16">
          <MusicPlayer />
        </Reveal>
      </div>
    </section>
  );
}

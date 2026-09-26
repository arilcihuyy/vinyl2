import { CatalogLabel } from "@/components/catalog-label";
import { MusicPlayer } from "@/components/music-player";
import { Reveal } from "@/components/reveal";

export function MusicSection() {
  return (
    <section
      id="music"
      className="halftone-dark flex h-full w-full flex-col items-center justify-center overflow-hidden bg-charcoal px-4 py-6 text-cream sm:px-8 sm:py-8 lg:px-12"
    >
      <div className="w-full max-w-[90rem]">
        <Reveal className="mb-5 flex flex-wrap items-baseline justify-between gap-4 border-b border-cream/15 pb-3 sm:mb-6">
          <div>
            <CatalogLabel index="02" tone="dark">
              Favorite music
            </CatalogLabel>
            <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
              A side built around Radiohead.
            </h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-cream/65 lg:text-right">
            The tracklist is ready for legally usable audio and artwork. Until then, the player stays visible and clearly unavailable.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <MusicPlayer />
        </Reveal>
      </div>
    </section>
  );
}

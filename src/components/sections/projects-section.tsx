import { CatalogLabel } from "@/components/catalog-label";
import { ProjectsGallery } from "@/components/projects-gallery";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="paper-texture relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper-deep px-4 py-4 text-ink sm:px-8 sm:py-6 lg:px-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(239, 231, 218, 0.94), rgba(246, 241, 230, 0.96)), url('/assets/retro/vintage-paper.jpg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-[90rem]">
        <div className="rounded-xl border-2 border-ink/20 bg-paper/80 p-5 shadow-lg sm:p-7 lg:p-9 backdrop-blur-xs">
          <Reveal className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
            <div>
              <CatalogLabel index="04">Project releases</CatalogLabel>
              <h2 className="mt-1 font-display text-3xl leading-none sm:text-4xl lg:text-5xl">
                Work in progress.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-ink/70 lg:text-right">
              Interactive 12-inch vinyl gatefold sleeves with pull-out records and laboratory liner notes.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <ProjectsGallery projects={projects} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

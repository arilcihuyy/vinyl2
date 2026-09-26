import { CatalogLabel } from "@/components/catalog-label";
import { ProjectsGallery } from "@/components/projects-gallery";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="paper-texture flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper-deep px-4 py-4 text-ink sm:px-8 sm:py-6 lg:px-12"
    >
      <div className="w-full max-w-[90rem]">
        <div className="rounded-xl border-2 border-ink/20 bg-paper/60 p-5 shadow-sm sm:p-7 lg:p-9">
          <Reveal className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
            <div>
              <CatalogLabel index="04">Project releases</CatalogLabel>
              <h2 className="mt-1 font-display text-3xl leading-none sm:text-4xl lg:text-5xl">
                Work in progress.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-ink/65 lg:text-right">
              Real projects will appear as album covers, with details that open inside the page.
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

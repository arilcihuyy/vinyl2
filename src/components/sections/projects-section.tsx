import { CatalogLabel } from "@/components/catalog-label";
import { ProjectsGallery } from "@/components/projects-gallery";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="paper-texture scroll-mt-18 bg-paper-deep px-5 py-20 text-ink sm:px-8 sm:py-24 lg:px-12 lg:py-30"
    >
      <div className="mx-auto max-w-[90rem]">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.6fr)] lg:items-end">
          <div>
            <CatalogLabel index="04">Project releases</CatalogLabel>
            <h2 className="mt-8 font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              Work in progress.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-ink/65 lg:justify-self-end">
            Real projects will appear as album covers, with details that open inside the page.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 lg:mt-16">
          <ProjectsGallery projects={projects} />
        </Reveal>
      </div>
    </section>
  );
}

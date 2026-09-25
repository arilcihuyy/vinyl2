"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Disc3 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ProjectsGalleryProps = {
  projects: Project[];
};

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!openSlug) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const slug = openSlug;
        setOpenSlug(null);
        requestAnimationFrame(() => triggerRefs.current[slug]?.focus());
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [openSlug]);

  if (projects.length === 0) {
    return (
      <div className="grid gap-8 border-y border-ink/20 py-8 md:grid-cols-[minmax(18rem,0.65fr)_minmax(0,1.35fr)] md:items-center lg:py-12">
        <div className="relative mx-auto aspect-square w-full max-w-sm" aria-hidden="true">
          <div className="absolute inset-0 rounded-sm border border-ink/25" />
          <div className="absolute inset-[12%] rounded-full border border-ink/20" />
          <div className="absolute inset-[23%] rounded-full bg-charcoal">
            <div className="absolute inset-[12%] rounded-full border border-cream/15" />
            <div className="absolute inset-[26%] rounded-full border border-cream/10" />
            <div className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent">
              <Disc3 aria-hidden="true" className="text-cream" size={17} />
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <p className="font-catalog text-xs tracking-[0.12em] text-ink/55">
            EMPTY RECORD CRATE
          </p>
          <h3 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            No releases yet
          </h3>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">
            Project work will appear here as real builds are ready to share.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const isOpen = openSlug === project.slug;

          return (
            <li key={project.slug}>
              <button
                ref={(element) => {
                  triggerRefs.current[project.slug] = element;
                }}
                type="button"
                className="group block w-full text-left focus-visible:outline-accent"
                aria-expanded={isOpen}
                aria-controls={`project-${project.slug}`}
                onClick={() => setOpenSlug(isOpen ? null : project.slug)}
              >
                <span className="relative block aspect-square overflow-hidden rounded-sm bg-charcoal shadow-[0_18px_35px_rgba(44,34,22,0.16)]">
                  <Image
                    src={project.coverSrc}
                    alt={`Cover art for ${project.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                  <span className="absolute left-4 top-4 font-catalog text-xs tracking-[0.12em] text-cream">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </span>
                <span className="mt-4 block">
                  <span className="block font-display text-2xl leading-tight transition-colors group-hover:text-accent">
                    {project.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink/60">{project.role}</span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.section
                    id={`project-${project.slug}`}
                    role="region"
                    aria-label={`${project.title} details`}
                    className="mt-6 border-y border-ink/20 py-7"
                    initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.24 }}
                  >
                    <p className="text-lg leading-8 text-ink/75">{project.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-x-2 gap-y-2 font-catalog text-[0.68rem] tracking-[0.1em] text-ink/60">
                      {project.technologies.map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>
                    <ul className="mt-5 space-y-3 text-base leading-7 text-ink/70">
                      {project.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    {project.repositoryUrl || project.liveUrl ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {project.repositoryUrl ? (
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-h-11 items-center gap-2 rounded-sm border border-ink/30 px-4 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper focus-visible:outline-accent"
                          >
                            View repository
                            <ArrowUpRight aria-hidden="true" size={17} />
                          </a>
                        ) : null}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-h-11 items-center gap-2 rounded-sm border border-ink/30 px-4 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper focus-visible:outline-accent"
                          >
                            Open live project
                            <ArrowUpRight aria-hidden="true" size={17} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </motion.section>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

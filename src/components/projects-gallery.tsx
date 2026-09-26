"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
      <div className="grid gap-8 md:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] md:items-center lg:gap-14">
        {/* Retro Wooden Cassette Rack / Storage Crate Illustration */}
        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-sm sm:max-w-md overflow-hidden rounded-xl border-2 border-ink/30 bg-[#2C241E] p-4 sm:p-5 shadow-xl"
          aria-hidden="true"
        >
          {/* Crate Header */}
          <div className="flex items-center justify-between border-b border-paper/15 pb-2 font-catalog text-[0.6rem] sm:text-[0.65rem] tracking-wider text-paper/60">
            <span>CASSETTE STORAGE</span>
            <span>MODEL R-80</span>
          </div>

          {/* 3 Empty Cassette Slots with wooden dividers */}
          <div className="mt-2.5 flex flex-col gap-2">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="relative flex h-12 sm:h-14 items-center justify-between overflow-hidden rounded border border-paper/20 bg-[#1D1713] px-2.5 sm:px-4 shadow-inner"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full border border-paper/25 bg-black/40">
                    <div className="size-1.5 sm:size-2 rounded-full border border-paper/40" />
                  </div>
                  <div className="h-0.5 w-6 sm:w-12 bg-paper/15" />
                  <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full border border-paper/25 bg-black/40">
                    <div className="size-1.5 sm:size-2 rounded-full border border-paper/40" />
                  </div>
                </div>
                <span className="font-catalog text-[0.55rem] sm:text-[0.62rem] text-paper/30 truncate">
                  SLOT {(slot + 1).toString().padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>

          {/* Crate Brass Nameplate */}
          <div className="mt-2.5 flex items-center justify-center">
            <div className="rounded border border-amber-600/40 bg-gradient-to-r from-amber-700/30 via-amber-600/20 to-amber-700/30 px-2.5 py-0.5 font-catalog text-[0.55rem] sm:text-[0.6rem] font-bold tracking-widest text-amber-200">
              ARIL ARCHIVE ARCHITECTURE
            </div>
          </div>
        </div>

        <div className="max-w-2xl min-w-0">
          <p className="font-catalog text-xs font-bold tracking-[0.14em] text-accent">
            EMPTY RECORD CRATE // CASSETTE RACK
          </p>
          <h3 className="mt-4 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
            No releases yet
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/75 sm:text-lg sm:leading-8">
            Project work will appear here as real builds are ready to share.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded border border-ink/20 bg-paper px-3 py-1.5 font-catalog text-[0.68rem] text-ink/70">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>Currently engineering upcoming software and AI releases</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                {/* Cassette Case Jewel Box Styling */}
                <span className="relative block aspect-[4/3] overflow-hidden rounded-lg border-2 border-ink/20 bg-charcoal shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                  <Image
                    src={project.coverSrc}
                    alt={`Cover art for ${project.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Spine Header */}
                  <span className="absolute left-3 top-3 rounded bg-charcoal/80 px-2 py-0.5 font-catalog text-[0.65rem] font-bold tracking-widest text-cream backdrop-blur-sm">
                    TAPE {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded bg-accent px-2 py-0.5 font-catalog text-[0.65rem] font-bold text-cream">
                    VIEW CASE
                  </span>
                </span>
                <span className="mt-4 block">
                  <span className="block font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
                    {project.title}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-ink/65">
                    {project.role}
                  </span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.section
                    id={`project-${project.slug}`}
                    role="region"
                    aria-label={`${project.title} details`}
                    className="mt-6 rounded-lg border border-ink/20 bg-paper p-5 sm:p-6 shadow-inner"
                    initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.24 }}
                  >
                    <p className="text-base sm:text-lg leading-7 sm:leading-8 text-ink/80">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2 font-catalog text-xs text-ink/70">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded border border-ink/20 bg-paper-deep px-2 py-0.5"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-5 space-y-2.5 text-base leading-7 text-ink/75">
                      {project.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {project.repositoryUrl || project.liveUrl ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {project.repositoryUrl ? (
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-h-11 items-center gap-2 rounded border border-ink/30 bg-paper px-4 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-accent"
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
                            className="flex min-h-11 items-center gap-2 rounded border border-accent bg-accent px-4 text-sm font-bold text-cream transition-colors hover:bg-accent-dark focus-visible:outline-accent"
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

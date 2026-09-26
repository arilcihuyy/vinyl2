"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Disc3, Radio } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { vinylCrackle } from "@/lib/vinyl-crackle";

type ProjectsGalleryProps = {
  projects: Project[];
};

type UpcomingRecord = {
  id: string;
  catalogNumber: string;
  title: string;
  genre: string;
  rpm: string;
  year: string;
  summary: string;
  highlights: string[];
};

const UPCOMING_RECORDS: UpcomingRecord[] = [
  {
    id: "lp-network",
    catalogNumber: "AR-7401",
    title: "Systems, Telecommunications & Networking",
    genre: "INFRASTRUCTURE / ROUTING",
    rpm: "33⅓ RPM",
    year: "1974 / 2026",
    summary:
      "Core networking laboratory experiments, subnet routing configurations, and telecommunications protocols developed during vocational study.",
    highlights: [
      "TCP/IP and packet transmission topologies",
      "Network service configuration and hardware routing",
      "Bandwidth diagnostics and analog signal analysis",
    ],
  },
  {
    id: "lp-ai",
    catalogNumber: "AR-7402",
    title: "AI & Neural Interface Experiments",
    genre: "INTELLIGENT SYSTEMS",
    rpm: "33⅓ RPM",
    year: "1975 / 2026",
    summary:
      "Explorations into autonomous agent behaviors, LLM workflows, and intelligent software utilities built to augment human productivity.",
    highlights: [
      "Agentic coding workflows and prompting architecture",
      "Local model experimentation and prompt evaluation",
      "Utility tooling for developer pair-programming",
    ],
  },
  {
    id: "lp-creative",
    catalogNumber: "AR-7403",
    title: "Analog Retro Web & Sound Engineering",
    genre: "INTERACTIVE DESIGN",
    rpm: "33⅓ RPM",
    year: "1976 / 2026",
    summary:
      "Web applications crafted with tactile retro aesthetics, WebGL Three.js spatial scenes, procedural Web Audio synthesis, and vinyl analog textures.",
    highlights: [
      "WebGL Three.js 3D turntable and cassette simulation",
      "Web Audio API real-time vinyl crackle sound generator",
      "Strict antislop accessibility and high-contrast typography",
    ],
  },
];

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [selectedRecordId, setSelectedRecordId] = useState<string>("lp-network");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reducedMotion = useReducedMotion();

  const selectedRecord =
    UPCOMING_RECORDS.find((r) => r.id === selectedRecordId) ?? UPCOMING_RECORDS[0];

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
      <div className="grid gap-8 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
        {/* Interactive Wooden Vinyl LP Record Crate */}
        <div className="relative mx-auto w-full max-w-lg rounded-2xl border-2 border-ink/30 bg-[#241A13] p-5 shadow-2xl">
          {/* Crate Brass Header */}
          <div className="flex items-center justify-between border-b border-paper/15 pb-2.5 font-catalog text-xs tracking-wider text-paper/70">
            <div className="flex items-center gap-2">
              <span className="rounded bg-accent px-1.5 py-0.5 font-bold text-cream">
                RECORD CRATE
              </span>
              <span>12-INCH LP ARCHIVE</span>
            </div>
            <span>MODEL VC-74</span>
          </div>

          {/* 3 Physical LP Gatefold Sleeves Inside Crate */}
          <div className="mt-4 flex flex-col gap-3">
            {UPCOMING_RECORDS.map((record, index) => {
              const isSelected = selectedRecordId === record.id;

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => {
                    vinylCrackle.playMechanicalClick();
                    setSelectedRecordId(record.id);
                  }}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-lg border-2 p-3 text-left transition-all focus-visible:outline-accent ${
                    isSelected
                      ? "border-accent bg-[#35271C] shadow-lg translate-x-1"
                      : "border-paper/20 bg-[#1A130D] hover:border-paper/40"
                  }`}
                  aria-pressed={isSelected}
                >
                  {/* Left: Sleeve Spine Label */}
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-paper/30 bg-charcoal font-catalog text-xs font-bold text-amber-300">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <span className="block font-catalog text-[0.62rem] font-bold tracking-widest text-accent-light">
                        {record.catalogNumber} • {record.rpm}
                      </span>
                      <span className="block font-display text-base leading-tight text-paper sm:text-lg">
                        {record.title}
                      </span>
                    </div>
                  </div>

                  {/* Right: Vinyl Disc Peeking Out */}
                  <div className="relative ml-2 flex size-12 shrink-0 items-center justify-center">
                    <motion.div
                      className="flex size-11 items-center justify-center rounded-full border-2 border-paper/40 bg-[#0E0C0A] shadow-md"
                      animate={
                        isSelected && !reducedMotion
                          ? { x: 6, rotate: 360 }
                          : { x: 0, rotate: 0 }
                      }
                      transition={{
                        rotate: { repeat: Infinity, duration: 6, ease: "linear" },
                        x: { duration: 0.3 },
                      }}
                    >
                      {/* Center Record Label */}
                      <div className="size-4 rounded-full border border-[#F7DF94] bg-[#C87D32]" />
                    </motion.div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Crate Stamped Base Plaque */}
          <div className="mt-4 flex items-center justify-between border-t border-paper/15 pt-2.5 font-catalog text-[0.65rem] text-paper/50">
            <span>PRESS TO PULL VINYL FROM CRATE</span>
            <span className="text-amber-200">HEAVYWEIGHT 180G VINYL</span>
          </div>
        </div>

        {/* Selected Record Liner Notes & Roadmap Details */}
        <div className="max-w-xl min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper-deep/70 px-3 py-1 font-catalog text-xs font-bold tracking-wider text-accent">
            <Disc3 size={15} className="animate-spin" />
            <span>CATALOG {selectedRecord.catalogNumber} // {selectedRecord.rpm}</span>
          </div>

          <h3 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {selectedRecord.title}
          </h3>

          <p className="mt-1 font-catalog text-xs tracking-wider text-ink/60">
            GENRE: {selectedRecord.genre} • PRODUCTION: {selectedRecord.year}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink/80 sm:text-base sm:leading-7">
            {selectedRecord.summary}
          </p>

          {/* Album Liner Highlights */}
          <div className="mt-5 rounded-lg border border-ink/20 bg-paper-deep/60 p-4 shadow-inner">
            <span className="font-catalog text-[0.68rem] font-bold tracking-widest text-ink/70">
              SIDE A TRACKLIST // FOCUS AREAS
            </span>
            <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-ink/85">
              {selectedRecord.highlights.map((highlight, idx) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="font-catalog text-xs font-bold text-accent">
                    A{(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded bg-accent/15 px-2.5 py-1 font-catalog text-xs font-bold text-accent">
              STATUS: IN LABORATORY
            </span>
            <span className="rounded border border-ink/20 bg-paper px-2.5 py-1 font-catalog text-xs text-ink/70">
              OFFICIAL RELEASE COMING SOON
            </span>
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
                {/* Gatefold Vinyl LP Sleeve with Peeking Vinyl Record */}
                <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink/20 bg-[#1C1714] p-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                  {/* Vinyl Record sliding out on group hover */}
                  <div
                    className="absolute -right-8 top-1/2 -translate-y-1/2 size-44 rounded-full border-4 border-ink/60 bg-[#0B0907] shadow-xl transition-transform duration-500 group-hover:translate-x-6"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-16 rounded-full border-2 border-[#F7DF94] bg-[#C87D32]" />
                    </div>
                  </div>

                  {/* Cardboard Sleeve Cover */}
                  <div className="relative z-10 h-full w-full overflow-hidden rounded-lg border border-cream/20 bg-charcoal">
                    <Image
                      src={project.coverSrc}
                      alt={`Cover art for ${project.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Ring wear circular effect overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-full border border-white/5 opacity-40" />

                    <span className="absolute left-3 top-3 rounded bg-charcoal/80 px-2 py-0.5 font-catalog text-[0.65rem] font-bold tracking-widest text-cream backdrop-blur-xs">
                      LP {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded bg-accent px-2 py-0.5 font-catalog text-[0.65rem] font-bold text-cream">
                      OPEN SLEEVE
                    </span>
                  </div>
                </div>

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

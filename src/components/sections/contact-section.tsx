"use client";

import { ArrowUpRight, AtSign, ChevronUp, GitFork } from "lucide-react";
import { CatalogLabel } from "@/components/catalog-label";
import { useDeck } from "@/components/deck-context";
import { Reveal } from "@/components/reveal";
import { profile, socials } from "@/data/portfolio";

export function ContactSection() {
  const { switchTab } = useDeck();

  return (
    <section
      id="contact"
      className="halftone-dark flex h-full w-full flex-col justify-center overflow-hidden bg-charcoal px-4 py-3 text-cream sm:px-8 sm:py-5 lg:px-12"
    >
      <div className="mx-auto flex h-full w-full max-w-[90rem] flex-col justify-center">
        <Reveal>
          <CatalogLabel index="06" tone="dark">
            Contact
          </CatalogLabel>
          <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
            <h2 className="max-w-4xl font-display text-3xl leading-[0.92] sm:text-4xl lg:text-5xl">
              Find the work in progress.
            </h2>
            <p className="max-w-xl text-xs leading-5 text-cream/65 lg:justify-self-end">
              Based in {profile.location}. GitHub and X are the only public contact links available right now.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-5 border-t border-cream/20">
          {socials.map((social) => {
            const Icon = social.label === "GitHub" ? GitFork : AtSign;

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group grid min-h-16 gap-2 border-b border-cream/20 py-3 transition-colors focus-visible:outline-accent-light sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <Icon aria-hidden="true" className="text-accent-light" size={20} />
                <span>
                  <span className="block font-display text-xl transition-colors group-hover:text-accent-light sm:text-2xl">
                    {social.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-cream/55">@{social.handle}</span>
                </span>
                <span className="flex min-h-9 items-center gap-1.5 text-xs font-semibold text-cream/70 transition-colors group-hover:text-accent-light">
                  Open profile
                  <ArrowUpRight
                    aria-hidden="true"
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            );
          })}
        </Reveal>

        {/* Back to top Link */}
        <Reveal delay={0.1} className="mt-4 flex items-center justify-between border-t border-cream/15 pt-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              switchTab("top");
            }}
            className="group flex min-h-10 items-center gap-2 rounded px-2 text-xs font-semibold text-cream/70 transition-colors hover:text-cream focus-visible:outline-accent-light"
          >
            <ChevronUp
              size={16}
              className="text-accent-light transition-transform group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            <span>Return to beginning</span>
          </a>

          <span className="font-catalog text-[0.62rem] tracking-wider text-cream/40">
            ARIL CASSETTE CHRONICLE // INDONESIA
          </span>
        </Reveal>
      </div>
    </section>
  );
}

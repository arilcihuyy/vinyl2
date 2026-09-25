import { ArrowUpRight, AtSign, GitFork } from "lucide-react";
import { CatalogLabel } from "@/components/catalog-label";
import { Reveal } from "@/components/reveal";
import { profile, socials } from "@/data/portfolio";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="halftone-dark scroll-mt-18 bg-charcoal px-5 py-20 text-cream sm:px-8 sm:py-24 lg:px-12 lg:py-30"
    >
      <div className="mx-auto max-w-[90rem]">
        <Reveal>
          <CatalogLabel index="06" tone="dark">
            Contact
          </CatalogLabel>
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-end">
            <h2 className="max-w-5xl font-display text-5xl leading-[0.92] sm:text-6xl lg:text-8xl">
              Find the work in progress.
            </h2>
            <p className="max-w-xl text-base leading-7 text-cream/65 lg:justify-self-end">
              Based in {profile.location}. GitHub and X are the only public contact links available right now.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 border-t border-cream/20 lg:mt-16">
          {socials.map((social) => {
            const Icon = social.label === "GitHub" ? GitFork : AtSign;

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group grid min-h-28 gap-4 border-b border-cream/20 py-6 transition-colors focus-visible:outline-accent-light sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <Icon aria-hidden="true" className="text-accent-light" size={25} />
                <span>
                  <span className="block font-display text-3xl transition-colors group-hover:text-accent-light sm:text-4xl">
                    {social.label}
                  </span>
                  <span className="mt-1 block text-sm text-cream/55">@{social.handle}</span>
                </span>
                <span className="flex min-h-11 items-center gap-2 text-sm font-semibold text-cream/70 transition-colors group-hover:text-accent-light">
                  Open profile
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

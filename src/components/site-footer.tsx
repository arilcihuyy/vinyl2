import { ArrowUp, AtSign, GitFork } from "lucide-react";
import { profile, socials } from "@/data/portfolio";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/15 bg-charcoal px-5 pb-28 pt-14 text-cream sm:px-8 sm:pb-24 sm:pt-8 lg:px-12 lg:pb-20 lg:pt-18">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full border border-cream/35 font-display text-3xl text-accent-light">
              A
            </span>
            <p className="font-catalog text-xs tracking-[0.16em] text-cream/60">
              PERSONAL RECORD / INDONESIA
            </p>
          </div>
          <p className="max-w-2xl font-display text-4xl leading-[0.98] sm:text-5xl">
            {profile.name}
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-cream/70">
            {profile.role}. Based in {profile.location}, learning by building.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <div className="flex flex-wrap gap-3">
            {socials.map((social) => {
              const Icon = social.label === "GitHub" ? GitFork : AtSign;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-sm border border-cream/25 px-4 text-sm font-semibold transition-colors duration-200 hover:border-accent-light hover:text-accent-light focus-visible:outline-accent-light"
                >
                  <Icon aria-hidden="true" size={18} />
                  {social.label}
                </a>
              );
            })}
          </div>
          <a
            href="#top"
            className="group flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-cream/75 transition-colors hover:text-accent-light focus-visible:outline-accent-light"
          >
            <ArrowUp
              aria-hidden="true"
              size={18}
              className="transition-transform group-hover:-translate-y-1"
            />
            Back to the top
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[90rem] flex-col gap-2 border-t border-cream/15 pt-5 font-catalog text-[0.68rem] tracking-[0.12em] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 {profile.name}</span>
        <span>{profile.timezone}</span>
      </div>
    </footer>
  );
}

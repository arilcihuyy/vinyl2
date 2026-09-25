"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation, profile } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper text-ink">
      <div className="mx-auto flex h-18 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="group flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-accent"
          aria-label="Aril, back to top"
        >
          <span className="grid size-10 place-items-center rounded-full border border-ink bg-ink font-display text-xl text-paper transition-transform duration-200 group-hover:-rotate-6">
            A
          </span>
          <span className="font-catalog text-sm tracking-[0.16em]">ARIL</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink/75 transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:outline-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-sm border border-ink/25 px-3 text-sm font-semibold transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:outline-accent lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
          <span>{isOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-full border-b border-ink/20 bg-paper px-5 pb-5 pt-2 text-ink shadow-[0_18px_0_rgba(28,26,23,0.08)] lg:hidden"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {navigation.map((item) => (
                <li key={item.href} className="border-b border-ink/15 last:border-b-0">
                  <a
                    href={item.href}
                    className="flex min-h-13 items-center justify-between py-3 font-display text-2xl transition-colors hover:text-accent focus-visible:outline-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                    <span className="font-catalog text-xs text-ink/45">
                      {profile.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

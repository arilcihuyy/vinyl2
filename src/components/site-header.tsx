"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDeck, type TabId } from "@/components/deck-context";
import { navigation, profile } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { activeTab, isTransitioning, switchTab } = useDeck();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const tabId = href.replace("#", "") as TabId;
      switchTab(tabId);
    }
  };

  return (
    <>
      <header
        data-hydrated={mounted ? "true" : undefined}
        className="sticky top-0 z-50 border-b border-ink/15 bg-paper text-ink"
      >
        <div className="mx-auto flex h-18 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#top"
              onClick={() => handleNavClick("#top")}
              className={`group flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-accent active:translate-y-0.5 ${
                activeTab === "top" ? "text-accent" : ""
              }`}
              aria-label="Aril, back to home"
            >
              <span className="grid size-10 place-items-center rounded-full border border-ink bg-ink font-display text-xl text-paper transition-transform duration-200 group-hover:-rotate-6">
                A
              </span>
              <span className="font-catalog text-sm tracking-[0.16em]">ARIL</span>
            </a>

            {/* Tactile Deck Status Indicator Lamp */}
            <div
              className="hidden items-center gap-2 rounded-full border border-ink/20 bg-paper-deep/50 px-2.5 py-1 font-catalog text-[0.62rem] text-ink/75 sm:flex"
              aria-hidden="true"
            >
              <span
                className={`size-2 rounded-full transition-colors duration-200 ${
                  isTransitioning
                    ? "animate-ping bg-accent"
                    : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]"
                }`}
              />
              <span className="tracking-widest">
                {isTransitioning ? "SEEKING TRACK" : "DECK READY"}
              </span>
            </div>
          </div>

          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const tab = item.href.replace("#", "");
                const isActive = activeTab === tab;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex min-h-11 items-center rounded-sm px-3.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-accent active:translate-y-0.5 ${
                        isActive
                          ? "bg-ink text-paper shadow-sm"
                          : "text-ink/80 hover:bg-ink hover:text-paper"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="flex min-h-11 items-center gap-2 rounded-sm border border-ink/25 px-3 text-sm font-semibold transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:outline-accent active:translate-y-0.5 lg:hidden"
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
                {navigation.map((item) => {
                  const tab = item.href.replace("#", "");
                  const isActive = activeTab === tab;

                  return (
                    <li key={item.href} className="border-b border-ink/15 last:border-b-0">
                      <a
                        href={item.href}
                        className={`flex min-h-13 items-center justify-between py-3 font-display text-2xl transition-colors focus-visible:outline-accent active:translate-x-1 ${
                          isActive ? "text-accent font-bold" : "text-ink hover:text-accent"
                        }`}
                        onClick={() => handleNavClick(item.href)}
                      >
                        {item.label}
                        <span className="font-catalog text-xs text-ink/45">
                          {isActive ? "NOW PLAYING" : profile.name}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      {/* Two-Phase Analog Paper & Halftone Sweep Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && !reducedMotion ? (
          <div
            className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="paper-texture halftone-light pointer-events-none absolute inset-0 bg-[#F4E9D4] shadow-2xl"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0], originX: [0, 0, 1, 1] }}
              transition={{
                duration: 0.5,
                times: [0, 0.48, 0.52, 1],
                ease: "easeInOut",
              }}
            >
              {/* Retro Color Edge Stripes on the sweeping boundary */}
              <div className="absolute right-0 top-0 bottom-0 flex w-3">
                <div className="w-1 bg-[#1E3D3D]" />
                <div className="w-1 bg-[#D68D27]" />
                <div className="w-1 bg-[#B54722]" />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

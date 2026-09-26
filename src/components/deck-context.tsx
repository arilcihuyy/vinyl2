"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type TabId =
  | "top"
  | "about"
  | "music"
  | "interests"
  | "projects"
  | "journey"
  | "contact";

export const validTabs: TabId[] = [
  "top",
  "about",
  "music",
  "interests",
  "projects",
  "journey",
  "contact",
];

type DeckContextType = {
  activeTab: TabId;
  isTransitioning: boolean;
  switchTab: (tab: TabId) => void;
};

const DeckContext = createContext<DeckContextType | null>(null);

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
}

export function DeckProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash === "home") return "top";
      if (validTabs.includes(hash as TabId)) return hash as TabId;
    }
    return "top";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useReducedMotion();

  // Listen for hashchange events
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace("#", "");
      if (rawHash === "home") {
        setActiveTab("top");
      } else if (validTabs.includes(rawHash as TabId)) {
        setActiveTab(rawHash as TabId);
      } else if (!rawHash) {
        setActiveTab("top");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Update active tab on scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as TabId;
            if (validTabs.includes(id)) {
              setActiveTab(id);
            }
          }
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );

    validTabs.forEach((tab) => {
      const el = document.getElementById(tab);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const switchTab = useCallback(
    (targetTab: TabId) => {
      setActiveTab(targetTab);
      const newHash = targetTab === "top" ? "#top" : `#${targetTab}`;
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }

      const targetEl = document.getElementById(targetTab);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      } else if (targetTab === "top") {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }

      if (!reducedMotion) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }
    },
    [reducedMotion],
  );

  return (
    <DeckContext.Provider value={{ activeTab, isTransitioning, switchTab }}>
      {children}
    </DeckContext.Provider>
  );
}

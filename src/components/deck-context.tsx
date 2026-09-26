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

  const switchTab = useCallback((targetTab: TabId) => {
    if (targetTab === activeTab && !isTransitioning) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setActiveTab(targetTab);
    const newHash = targetTab === "top" ? "#top" : `#${targetTab}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    window.scrollTo({ top: 0, behavior: "auto" });

    if (!reducedMotion) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [activeTab, isTransitioning, reducedMotion]);

  // Intercept hash anchor clicks to switch tabs seamlessly
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        const rawId = href.replace("#", "");
        if (rawId === "home") {
          event.preventDefault();
          switchTab("top");
        } else if (validTabs.includes(rawId as TabId)) {
          event.preventDefault();
          switchTab(rawId as TabId);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [switchTab]);

  return (
    <DeckContext.Provider value={{ activeTab, isTransitioning, switchTab }}>
      {children}
    </DeckContext.Provider>
  );
}

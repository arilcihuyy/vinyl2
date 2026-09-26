"use client";

import { useDeck } from "@/components/deck-context";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InterestsSection } from "@/components/sections/interests-section";
import { JourneySection } from "@/components/sections/journey-section";
import { MusicSection } from "@/components/sections/music-section";
import { ProjectsSection } from "@/components/sections/projects-section";

export function DeckTabsView() {
  const { activeTab } = useDeck();

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      {activeTab === "top" && <HeroSection />}
      {activeTab === "about" && <AboutSection />}
      {activeTab === "music" && <MusicSection />}
      {activeTab === "interests" && <InterestsSection />}
      {activeTab === "projects" && <ProjectsSection />}
      {activeTab === "journey" && <JourneySection />}
      {activeTab === "contact" && <ContactSection />}
    </div>
  );
}

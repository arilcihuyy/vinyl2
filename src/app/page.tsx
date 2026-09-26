import { DeckProvider } from "@/components/deck-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InterestsSection } from "@/components/sections/interests-section";
import { JourneySection } from "@/components/sections/journey-section";
import { MusicSection } from "@/components/sections/music-section";
import { ProjectsSection } from "@/components/sections/projects-section";

export default function Home() {
  return (
    <DeckProvider>
      <div id="top" className="min-h-screen bg-paper text-ink">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">
          <HeroSection />
          <AboutSection />
          <MusicSection />
          <InterestsSection />
          <ProjectsSection />
          <JourneySection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </DeckProvider>
  );
}

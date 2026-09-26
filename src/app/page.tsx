import { DeckProvider } from "@/components/deck-context";
import { DeckTabsView } from "@/components/deck-tabs-view";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <DeckProvider>
      <div
        id="top"
        className="flex h-screen max-h-screen flex-col overflow-hidden bg-paper"
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <DeckTabsView />
        </main>
      </div>
    </DeckProvider>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  interests as allInterests,
  type InterestId,
} from "@/data/portfolio";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { useWebGLSupport } from "@/hooks/use-webgl-support";

const InterestScene = dynamic(
  () =>
    import("@/components/three/interest-scene").then(
      (module) => module.InterestScene,
    ),
  {
    ssr: false,
    loading: () => <SceneFallback label="Loading the object stage" />,
  },
);

function SceneFallback({ label }: { label: string }) {
  return (
    <div
      className="relative grid aspect-square w-full place-items-center rounded-full border border-ink/20"
      role="status"
    >
      <div className="absolute inset-[12%] rounded-full border border-ink/15" />
      <div className="absolute inset-[25%] rounded-full bg-paper-deep" />
      <span className="relative max-w-40 text-center font-catalog text-xs tracking-[0.12em] text-ink/55">
        {label}
      </span>
    </div>
  );
}

export function InterestExplorer() {
  const [selectedId, setSelectedId] = useState<InterestId>("programming");
  const [sceneRef, shouldRender] = useNearViewport<HTMLDivElement>("320px");
  const webglSupport = useWebGLSupport();
  const selectedInterest =
    allInterests.find((interest) => interest.id === selectedId) ?? allInterests[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-14">
      <div>
        <ol className="border-t border-ink/20">
          {allInterests.map((interest, index) => {
            const isSelected = interest.id === selectedId;

            return (
              <li key={interest.id} className="border-b border-ink/20">
                <button
                  type="button"
                  className={`flex min-h-16 w-full items-center gap-4 px-1 text-left transition-colors duration-200 focus-visible:outline-accent sm:px-2 ${isSelected ? "text-accent" : "text-ink hover:text-accent"}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(interest.id)}
                  onFocus={() => setSelectedId(interest.id)}
                >
                  <span className="w-7 font-catalog text-xs text-ink-muted">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-2xl sm:text-3xl">
                    {interest.label}
                  </span>
                  <span className="font-catalog text-[0.62rem] tracking-[0.1em] text-ink-muted">
                    {isSelected ? "SELECTED" : "OBJECT"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 min-h-40 border-l-2 border-accent pl-5" aria-live="polite">
          <p className="font-catalog text-xs tracking-[0.12em] text-ink/55">
            {selectedInterest.objectName}
          </p>
          <p className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
            {selectedInterest.description}
          </p>
        </div>
      </div>

      <div
        ref={sceneRef}
        className="relative mx-auto aspect-square w-full max-w-[42rem]"
        aria-hidden="true"
      >
        {shouldRender && webglSupport === true ? (
          <InterestScene
            interests={allInterests}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <SceneFallback
            label={
              webglSupport === false
                ? "Object preview simplified for this device"
                : "Select an interest to load its object"
            }
          />
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-catalog text-[0.64rem] tracking-[0.12em] text-ink/45">
          SELECTED / {selectedInterest.label.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

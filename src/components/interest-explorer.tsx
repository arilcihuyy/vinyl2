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
    <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12">
      <div>
        <ol className="border-t border-ink/20 divide-y divide-ink/15">
          {allInterests.map((interest, index) => {
            const isSelected = interest.id === selectedId;

            return (
              <li key={interest.id}>
                <button
                  type="button"
                  className={`flex min-h-12 w-full items-center gap-3.5 px-2 py-2 text-left transition-colors duration-200 focus-visible:outline-accent sm:px-3 ${
                    isSelected ? "text-accent font-bold" : "text-ink hover:text-accent"
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(interest.id)}
                  onFocus={() => setSelectedId(interest.id)}
                >
                  <span className="w-6 font-catalog text-xs text-ink-muted">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-xl sm:text-2xl">
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

        <div className="mt-4 min-h-22 border-l-2 border-accent bg-paper-deep/40 p-3 sm:p-3.5 rounded-r" aria-live="polite">
          <p className="font-catalog text-xs tracking-[0.12em] text-accent font-bold">
            {selectedInterest.objectName}
          </p>
          <p className="mt-1 font-display text-lg leading-snug sm:text-xl text-ink">
            {selectedInterest.description}
          </p>
        </div>
      </div>

      <div
        ref={sceneRef}
        className="relative mx-auto flex aspect-square w-full max-w-[24rem] sm:max-w-[26rem] lg:max-w-[28rem] flex-col overflow-hidden rounded-xl border-2 border-ink/20 bg-paper-deep/40 p-2.5 shadow-md"
        aria-hidden="true"
      >
        {/* Top Equipment Status Bar */}
        <div className="flex items-center justify-between border-b border-ink/15 px-3 py-1 font-catalog text-[0.62rem] tracking-[0.12em] text-ink/60">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
            3D APPARATUS STAGE
          </span>
          <span>CALIBRATED // 44.1 KHZ</span>
        </div>

        <div className="relative flex-1">
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
        </div>

        {/* Bottom Object Tag */}
        <div className="flex items-center justify-between border-t border-ink/15 px-3 py-1 font-catalog text-[0.62rem] tracking-[0.1em] text-ink/60">
          <span className="font-bold text-accent">
            {selectedInterest.objectName.toUpperCase()}
          </span>
          <span>TRACK 03</span>
        </div>
      </div>
    </div>
  );
}

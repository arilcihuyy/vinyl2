"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Disc3, Radio } from "lucide-react";
import { useRef, useState } from "react";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWebGLSupport } from "@/hooks/use-webgl-support";

const HeroTurntable = dynamic(
  () => import("@/components/three/hero-turntable").then((module) => module.HeroTurntable),
  {
    ssr: false,
    loading: () => <TurntableFallback />,
  },
);

const HeroCassette = dynamic(
  () => import("@/components/three/hero-cassette").then((module) => module.HeroCassette),
  {
    ssr: false,
    loading: () => <CassetteFallback />,
  },
);

function TurntableFallback() {
  return (
    <div
      className="relative flex aspect-square w-full max-w-[34rem] items-center justify-center overflow-hidden rounded-2xl border-2 border-cream/20 bg-[#2D1C12] p-5 shadow-2xl"
      aria-hidden="true"
    >
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-cream/20 bg-[#C2B8AC] p-4 text-ink shadow-inner">
        <div className="flex items-center justify-between border-b border-ink/20 pb-2 text-xs">
          <span className="font-catalog font-bold text-[#4F1908]">MODEL TT-74 // VINYL DECK</span>
          <span className="font-catalog font-semibold text-ink">33⅓ RPM STEREO</span>
        </div>

        {/* Vinyl Disc Silhouette */}
        <div className="my-auto flex size-48 sm:size-56 self-center items-center justify-center rounded-full border-4 border-ink/40 bg-[#0B0907] shadow-xl">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-[#F7DF94] bg-[#FFE3B3] text-[0.6rem] font-bold text-ink">
            ARIL
          </div>
        </div>

        <div className="flex items-center justify-between font-catalog text-[0.68rem] text-ink/70">
          <span>HIGH-TORQUE DRIVE</span>
          <span>MANUAL TONEARM</span>
        </div>
      </div>
    </div>
  );
}

function CassetteFallback() {
  return (
    <div
      className="relative flex aspect-[4/3] w-full max-w-[34rem] items-center justify-center overflow-hidden rounded-xl border-2 border-cream/20 bg-charcoal-soft/90 p-3 shadow-2xl sm:rounded-2xl sm:p-6"
      aria-hidden="true"
    >
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border border-cream/15 bg-paper p-3 text-ink shadow-inner sm:rounded-xl sm:p-5">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-[0.65rem] sm:text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="rounded bg-charcoal px-1.5 py-0.5 font-catalog font-bold text-cream">
              SIDE A
            </span>
            <span className="font-catalog font-bold tracking-wider text-accent truncate max-w-[8rem] sm:max-w-none">
              ARIL MIXTAPE
            </span>
          </div>
          <span className="font-catalog font-semibold text-ink-muted shrink-0">
            C-60 STEREO
          </span>
        </div>

        <div className="my-auto flex h-16 sm:h-20 items-center justify-around rounded-md border-2 border-charcoal bg-charcoal-soft px-3 sm:px-8">
          <div className="relative flex size-9 sm:size-12 shrink-0 items-center justify-center rounded-full border-2 sm:border-4 border-cream/40 bg-ink">
            <div className="size-3 sm:size-4 rounded-full border border-dashed border-cream/60" />
          </div>
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 font-catalog text-[0.55rem] sm:text-[0.65rem] text-cream/40">
            <span>100 • 50 • 0</span>
            <div className="h-0.5 w-10 sm:w-16 bg-cream/20" />
          </div>
          <div className="relative flex size-9 sm:size-12 shrink-0 items-center justify-center rounded-full border-2 sm:border-4 border-cream/40 bg-ink">
            <div className="size-3 sm:size-4 rounded-full border border-dashed border-cream/60" />
          </div>
        </div>

        <div className="flex items-center justify-between font-catalog text-[0.58rem] sm:text-[0.68rem] text-ink-muted">
          <span>HIGH POSITION / TYPE II</span>
          <span>CURATED TRACKS</span>
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const [activeGear, setActiveGear] = useState<"turntable" | "cassette">("turntable");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sceneRef, shouldRender] = useNearViewport<HTMLDivElement>("420px");
  const reducedMotion = useReducedMotion();
  const webglSupport = useWebGLSupport();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 50]);

  return (
    <div ref={sectionRef} className="relative w-full overflow-hidden">
      {/* 3D Gear Switcher Toggle */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <div className="inline-flex rounded-full border border-cream/25 bg-charcoal/80 p-1 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => setActiveGear("turntable")}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all focus-visible:outline-accent ${
              activeGear === "turntable"
                ? "bg-accent text-cream shadow-md"
                : "text-cream/70 hover:text-cream"
            }`}
            aria-pressed={activeGear === "turntable"}
          >
            <Disc3 size={15} />
            <span>3D VINYL TURNTABLE</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGear("cassette")}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all focus-visible:outline-accent ${
              activeGear === "cassette"
                ? "bg-accent text-cream shadow-md"
                : "text-cream/70 hover:text-cream"
            }`}
            aria-pressed={activeGear === "cassette"}
          >
            <Radio size={15} />
            <span>3D CASSETTE TAPE</span>
          </button>
        </div>
      </div>

      <motion.div
        ref={sceneRef}
        style={{ y: visualY }}
        className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none"
      >
        {/* Subtle decorative background rings */}
        <div className="pointer-events-none absolute inset-[4%] rounded-full border border-cream/10" />
        <div className="pointer-events-none absolute inset-[14%] rounded-full border border-cream/5" />

        {shouldRender && webglSupport === true ? (
          activeGear === "turntable" ? (
            <HeroTurntable />
          ) : (
            <HeroCassette />
          )
        ) : activeGear === "turntable" ? (
          <TurntableFallback />
        ) : (
          <CassetteFallback />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6%] right-[6%] select-none rounded border border-cream/25 bg-[#121110] px-2.5 py-1 font-catalog text-xs tracking-[0.14em] text-cream shadow-md"
        >
          ANALOG SYSTEM // ARIL
        </div>
      </motion.div>
    </div>
  );
}

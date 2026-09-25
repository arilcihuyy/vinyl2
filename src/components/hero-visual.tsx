"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

function TurntableFallback() {
  return (
    <div className="relative grid aspect-square w-full place-items-center" aria-hidden="true">
      <div className="absolute inset-[4%] rounded-full border border-cream/20" />
      <div className="absolute inset-[13%] rounded-full border border-cream/30" />
      <div className="absolute inset-[23%] rounded-full bg-charcoal-soft shadow-[0_28px_60px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-[8%] rounded-full border border-cream/15" />
        <div className="absolute inset-[18%] rounded-full border border-cream/10" />
        <div className="absolute inset-[35%] grid place-items-center rounded-full bg-accent font-display text-5xl text-cream">
          A
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sceneRef, shouldRender] = useNearViewport<HTMLDivElement>("420px");
  const reducedMotion = useReducedMotion();
  const webglSupport = useWebGLSupport();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 70]);

  return (
    <div ref={sectionRef} className="relative">
      <motion.div
        ref={sceneRef}
        style={{ y: visualY }}
        className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none"
        aria-hidden="true"
      >
        <div className="absolute inset-[2%] rounded-full border border-cream/10" />
        <div className="absolute inset-[9%] rounded-full border border-cream/10" />
        {shouldRender && webglSupport === true ? <HeroTurntable /> : <TurntableFallback />}
        <div className="absolute bottom-[8%] left-[7%] font-catalog text-[0.64rem] tracking-[0.12em] text-cream/40">
          INITIAL / ARIL
        </div>
      </motion.div>
    </div>
  );
}

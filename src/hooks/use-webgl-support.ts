"use client";

import { useSyncExternalStore } from "react";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let cachedSupport: boolean | null | undefined;

function detectWebGLSupport() {
  const navigatorHints = navigator as NavigatorHints;
  const constrained =
    navigatorHints.connection?.saveData === true ||
    (navigatorHints.deviceMemory !== undefined && navigatorHints.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2);

  if (constrained) {
    return false;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", {
    failIfMajorPerformanceCaveat: true,
  });

  if (!context) {
    return false;
  }

  const rendererExtension = context.getExtension("WEBGL_debug_renderer_info");
  const renderer = rendererExtension
    ? context.getParameter(rendererExtension.UNMASKED_RENDERER_WEBGL)
    : "";
  const usesSoftwareRenderer = /swiftshader|llvmpipe|software/i.test(String(renderer));

  context.getExtension("WEBGL_lose_context")?.loseContext();
  return !usesSoftwareRenderer;
}

function subscribe() {
  return () => undefined;
}

function getSnapshot() {
  if (cachedSupport === undefined) {
    cachedSupport = detectWebGLSupport();
  }

  return cachedSupport;
}

function getServerSnapshot() {
  return null;
}

export function useWebGLSupport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

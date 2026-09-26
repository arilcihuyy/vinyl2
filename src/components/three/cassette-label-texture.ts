"use client";

import { CanvasTexture, NearestFilter, SRGBColorSpace } from "three";

/**
 * Creates high-resolution retro cassette label textures using Canvas 2D API.
 * Ensures zero asset load latency, ultra-crisp vector-like rendering, and
 * authentic vintage 70s/80s analog audio cassette styling.
 */
export function createCassetteLabelTexture(side: "A" | "B"): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 580;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  // 1. Vintage Cream Textured Paper Background
  ctx.fillStyle = "#F5ECDC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper grain / noise lines
  ctx.strokeStyle = "rgba(180, 160, 130, 0.12)";
  ctx.lineWidth = 1;
  for (let y = 8; y < canvas.height; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Outer paper label border
  ctx.strokeStyle = "#38312B";
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // 2. Retro Triple Color Stripes (70s/80s vintage audio signature)
  const stripeY = 28;
  const stripeHeight = 15;

  // Stripe 1: Deep Teal / Spruce
  ctx.fillStyle = side === "A" ? "#1B3B3B" : "#2A3645";
  ctx.fillRect(18, stripeY, canvas.width - 36, stripeHeight);

  // Stripe 2: Warm Amber / Mustard Gold
  ctx.fillStyle = "#D68D27";
  ctx.fillRect(18, stripeY + stripeHeight + 2, canvas.width - 36, stripeHeight);

  // Stripe 3: Vintage Vermilion / Retro Orange
  ctx.fillStyle = "#B54722";
  ctx.fillRect(18, stripeY + (stripeHeight + 2) * 2, canvas.width - 36, stripeHeight);

  // 3. Side Badge [ A ] or [ B ]
  const badgeX = 46;
  const badgeY = 92;
  ctx.fillStyle = "#1E1C1A";
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, 72, 72, 10);
  ctx.fill();

  ctx.fillStyle = "#F5ECDC";
  ctx.font = "900 48px 'Courier Prime', Courier, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(side, badgeX + 36, badgeY + 39);

  // 4. Header Titles
  ctx.textAlign = "left";
  ctx.fillStyle = "#1E1C1A";
  ctx.font = "900 36px 'Courier Prime', monospace";
  ctx.fillText("ARIL // CLASSIC MIXTAPE", badgeX + 96, badgeY + 30);

  ctx.font = "700 18px 'Courier Prime', monospace";
  ctx.fillStyle = "#635546";
  ctx.fillText(
    side === "A"
      ? "STEREO CASSETTE TAPE • HIGH BIAS (TYPE II) • 70µs EQ"
      : "MASTER RECORDING • EXTENDED ARCHIVE • CHROME BIAS",
    badgeX + 96,
    badgeY + 58,
  );

  // Top right specifications
  ctx.textAlign = "right";
  ctx.fillStyle = "#B54722";
  ctx.font = "900 34px 'Courier Prime', monospace";
  ctx.fillText("C - 60", canvas.width - 44, badgeY + 32);

  ctx.font = "700 17px 'Courier Prime', monospace";
  ctx.fillStyle = "#38312B";
  ctx.fillText("DOLBY B-C NR", canvas.width - 44, badgeY + 58);

  // 5. Center Transparent Window Frame & Scale Indicator
  const winX = canvas.width / 2 - 270;
  const winY = 195;
  const winW = 540;
  const winH = 210;

  // Window cut boundary (dark border around window hole)
  ctx.strokeStyle = "#241F1A";
  ctx.lineWidth = 6;
  ctx.strokeRect(winX, winY, winW, winH);

  // Scale tick lines above & below the cutout window
  ctx.fillStyle = "#38312B";
  ctx.strokeStyle = "#38312B";
  ctx.lineWidth = 2.5;
  const markers = [
    { label: "100", pos: 0.15 },
    { label: "75", pos: 0.32 },
    { label: "50", pos: 0.5 },
    { label: "25", pos: 0.68 },
    { label: "0", pos: 0.85 },
  ];

  ctx.font = "700 15px 'Courier Prime', monospace";
  ctx.textAlign = "center";
  markers.forEach(({ label, pos }) => {
    const x = winX + winW * pos;
    // Top ticks
    ctx.beginPath();
    ctx.moveTo(x, winY - 14);
    ctx.lineTo(x, winY - 2);
    ctx.stroke();
    ctx.fillText(label, x, winY - 18);

    // Bottom ticks
    ctx.beginPath();
    ctx.moveTo(x, winY + winH + 2);
    ctx.lineTo(x, winY + winH + 14);
    ctx.stroke();
  });

  // Completely clear the window center so the 3D spools and reels shine through clearly
  ctx.clearRect(winX + 4, winY + 4, winW - 8, winH - 8);

  // 6. Bottom Handwritten / Retro Trackline Area
  const trackLineY = winY + winH + 38;

  // Lined track note area
  ctx.strokeStyle = "rgba(181, 71, 34, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(44, trackLineY + 24);
  ctx.lineTo(canvas.width - 44, trackLineY + 24);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = "italic 700 23px 'Courier Prime', monospace";
  ctx.fillStyle = "#201E1B";
  ctx.fillText(
    side === "A"
      ? "TRACKLIST: RADIOHEAD SELECTIONS • VINTAGE ANALOG MASTER"
      : "SIDE B: DEV LOGS • EXPERIMENTS & SYSTEM ARCHITECTURE",
    50,
    trackLineY + 18,
  );

  // Bottom info footer
  const footerY = canvas.height - 24;
  ctx.fillStyle = "#635546";
  ctx.font = "700 14px 'Courier Prime', monospace";
  ctx.fillText("POSITION: NORMAL / BIAS: 120µs", 44, footerY);

  ctx.textAlign = "right";
  ctx.fillText("MANUFACTURED FOR ARIL STUDIO • INDONESIA", canvas.width - 44, footerY);

  // Create Three.js Texture
  const texture = new CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = NearestFilter;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

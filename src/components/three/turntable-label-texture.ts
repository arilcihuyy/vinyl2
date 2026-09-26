"use client";

import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

/**
 * Creates a detailed circular vintage vinyl record center label texture
 */
export function createTurntableLabelTexture(title = "ARIL STEREO ARCHIVE"): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const cx = 512;
  const cy = 512;

  // Background - Warm vintage amber/mustard paper
  ctx.fillStyle = "#C87D32";
  ctx.beginPath();
  ctx.arc(cx, cy, 510, 0, Math.PI * 2);
  ctx.fill();

  // Subtle paper grain & aging ring
  const grad = ctx.createRadialGradient(cx, cy, 80, cx, cy, 512);
  grad.addColorStop(0, "rgba(235, 175, 110, 0.95)");
  grad.addColorStop(0.7, "rgba(200, 115, 45, 0.98)");
  grad.addColorStop(1, "rgba(140, 70, 20, 1)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 510, 0, Math.PI * 2);
  ctx.fill();

  // Outer gold foil ring
  ctx.strokeStyle = "#F7DF94";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, 480, 0, Math.PI * 2);
  ctx.stroke();

  // Inner thin border ring
  ctx.strokeStyle = "#43210C";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 460, 0, Math.PI * 2);
  ctx.stroke();

  // Concentric fine decorative lines
  ctx.strokeStyle = "rgba(67, 33, 12, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 440, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.stroke();

  // Center hole ring (brass grommet ring)
  ctx.strokeStyle = "#EAD7A1";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, 70, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#120B06";
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  // Typography - Curved or Bold Classic Print
  ctx.fillStyle = "#261206";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Top Curved/Bold Arch Header
  ctx.font = "bold 58px serif";
  ctx.fillText("ARIL RECORDINGS", cx, 160);

  ctx.font = "bold 24px monospace";
  ctx.letterSpacing = "6px";
  ctx.fillText("FULL FREQUENCY RANGE RECORDING", cx, 215);

  // Speed & Catalog Box
  ctx.fillStyle = "#261206";
  ctx.font = "bold 34px monospace";
  ctx.fillText("33⅓ RPM", cx - 260, 340);
  ctx.font = "20px monospace";
  ctx.fillText("STEREO", cx - 260, 380);

  ctx.font = "bold 34px monospace";
  ctx.fillText("SIDE A", cx + 260, 340);
  ctx.font = "20px monospace";
  ctx.fillText("CAT. AR-1974", cx + 260, 380);

  // Center Title
  ctx.font = "bold 44px serif";
  ctx.fillText(title.toUpperCase(), cx, 660);

  ctx.font = "22px sans-serif";
  ctx.fillStyle = "#3D2010";
  ctx.fillText("ANALOG AUDIOPHILE PRESSING", cx, 715);
  ctx.fillText("MADE IN INDONESIA • ALL RIGHTS RESERVED", cx, 755);

  // Bottom classic logo crest or emblem
  ctx.fillStyle = "#F7DF94";
  ctx.beginPath();
  ctx.arc(cx, 840, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#261206";
  ctx.font = "bold 26px serif";
  ctx.fillText("✦", cx, 842);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

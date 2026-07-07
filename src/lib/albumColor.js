import { useEffect, useState } from "react";

const cache = new Map();

// Pure: pick the most saturated mid-lightness pixel; fall back to the
// average when the art is effectively grayscale.
export function pickDominant(pixels) {
  if (!pixels || pixels.length < 4) return null;
  let best = null;
  let bestScore = -1;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const pr = pixels[i], pg = pixels[i + 1], pb = pixels[i + 2];
    const max = Math.max(pr, pg, pb), min = Math.min(pr, pg, pb);
    const sat = max - min;
    const light = (max + min) / 2;
    const score = sat * (1 - Math.abs(light - 128) / 128);
    r += pr; g += pg; b += pb; n += 1;
    if (score > bestScore) { bestScore = score; best = [pr, pg, pb]; }
  }
  if (bestScore < 24) return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  return best;
}

export function wash([r, g, b], alpha) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function extract(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 16;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, 16, 16);
        resolve(pickDominant(ctx.getImageData(0, 0, 16, 16).data));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function albumColor(src) {
  if (!cache.has(src)) cache.set(src, extract(src));
  return cache.get(src);
}

export function useAlbumColor(src) {
  const [color, setColor] = useState(null);
  useEffect(() => {
    setColor(null); // clear stale tint immediately when the track changes
    if (!src) return undefined;
    let on = true;
    albumColor(src).then((c) => {
      if (on) setColor(c);
    });
    return () => {
      on = false;
    };
  }, [src]);
  return color;
}

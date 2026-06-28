import { useEffect, useRef, useCallback } from "react";

/**
 * Heart & sparkle trail particles that follow the cursor
 * on the auth page background. Particles are suppressed when
 * the cursor is inside the form card container (right pane only).
 * 
 * When hovering over the brand image (left pane), sunshine burst
 * particles radiate outward from the cursor.
 */

const PARTICLE_POOL_SIZE = 80;
const SPAWN_THROTTLE_MS = 45;

// Trail symbols for background
const HEARTS = ["♥", "♡", "❤", "💕"];
const SPARKLES = ["✦", "✧", "·", "˚"];
const ALL_SYMBOLS = [...HEARTS, ...SPARKLES];

// Sunshine symbols for image hover
const SUNSHINE = ["☀", "✺", "✹", "✸", "✵", "❋", "✿", "❁"];

const HEART_COLORS = [
  "#9D6C76",   // primary rose-gold
  "#C597A0",   // primary-light
  "#B98EA7",   // secondary mauve
  "#E4BDF0",   // accent lavender
  "#F3DCF9",   // accent light
  "#855A63",   // primary dark
];

const SUNSHINE_COLORS = [
  "#E1B057",   // warm gold
  "#F5D08E",   // light gold
  "#C597A0",   // rose
  "#E4BDF0",   // lavender
  "#FFD700",   // bright gold
  "#F0C27F",   // sand gold
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function useHeartTrail(
  containerRef: React.RefObject<HTMLDivElement | null>,
  cardRef: React.RefObject<HTMLDivElement | null>
) {
  const poolRef = useRef<HTMLDivElement[]>([]);
  const poolIndexRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // Build the particle pool once on mount
  const initPool = useCallback(() => {
    const container = containerRef.current;
    if (!container || poolRef.current.length > 0) return;

    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        will-change: transform, opacity;
        font-size: 12px;
        line-height: 1;
        user-select: none;
        transition: none;
      `;
      container.appendChild(el);
      poolRef.current.push(el);
    }
  }, [containerRef]);

  // Spawn a single particle at (x, y) with configurable style
  const spawnParticle = useCallback((
    x: number,
    y: number,
    mode: "heart" | "sunshine" = "heart"
  ) => {
    const pool = poolRef.current;
    if (pool.length === 0) return;

    const idx = poolIndexRef.current % PARTICLE_POOL_SIZE;
    poolIndexRef.current++;

    const el = pool[idx];

    if (mode === "sunshine") {
      // Sunshine: radial burst outward from cursor
      const symbol = SUNSHINE[Math.floor(Math.random() * SUNSHINE.length)];
      const color = SUNSHINE_COLORS[Math.floor(Math.random() * SUNSHINE_COLORS.length)];
      const size = randomBetween(10, 20);
      const angle = randomBetween(0, 360) * (Math.PI / 180);
      const distance = randomBetween(30, 70);
      const driftX = Math.cos(angle) * distance;
      const driftY = Math.sin(angle) * distance;
      const rotation = randomBetween(-60, 60);
      const duration = randomBetween(500, 900);

      el.textContent = symbol;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${size}px`;
      el.style.color = color;
      el.style.opacity = "1";
      el.style.transform = "translate(-50%, -50%) scale(1.2) rotate(0deg)";

      el.getBoundingClientRect();

      const animation = el.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1.2) rotate(0deg)",
            opacity: 0.9,
          },
          {
            transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.2) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.2, 0, 0.5, 1)",
          fill: "forwards",
        }
      );

      animation.onfinish = () => {
        el.style.opacity = "0";
      };
    } else {
      // Heart trail: gentle upward drift
      const symbol = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const size = randomBetween(8, 18);
      const driftX = randomBetween(-30, 30);
      const driftY = randomBetween(-50, -20);
      const rotation = randomBetween(-45, 45);
      const duration = randomBetween(600, 1200);

      el.textContent = symbol;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${size}px`;
      el.style.color = color;
      el.style.opacity = "1";
      el.style.transform = "translate(-50%, -50%) scale(1) rotate(0deg)";

      el.getBoundingClientRect();

      const animation = el.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            opacity: 1,
          },
          {
            transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.3) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.3, 0, 0.7, 1)",
          fill: "forwards",
        }
      );

      animation.onfinish = () => {
        el.style.opacity = "0";
      };
    }
  }, []);

  useEffect(() => {
    initPool();

    const container = containerRef.current;
    const card = cardRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return;

      // Check if cursor is over the brand image (left pane img)
      const target = e.target as HTMLElement;
      const isOverImage = target.tagName === "IMG" || target.closest("img") !== null;

      if (isOverImage) {
        // Sunshine burst mode on image
        lastSpawnRef.current = now;
        spawnParticle(e.clientX, e.clientY, "sunshine");
        // Spawn 2-3 extra sunshine particles in a burst
        for (let i = 0; i < 2; i++) {
          const offsetX = randomBetween(-6, 6);
          const offsetY = randomBetween(-6, 6);
          spawnParticle(e.clientX + offsetX, e.clientY + offsetY, "sunshine");
        }
        return;
      }

      // Don't spawn heart particles when cursor is inside the form card (right pane)
      if (card) {
        const cardRect = card.getBoundingClientRect();
        // Only suppress on the right half of the card (the form side)
        const cardMidX = cardRect.left + cardRect.width / 2;
        if (
          e.clientX >= cardMidX &&
          e.clientX <= cardRect.right &&
          e.clientY >= cardRect.top &&
          e.clientY <= cardRect.bottom
        ) {
          return;
        }
      }

      lastSpawnRef.current = now;

      // Spawn 1–2 heart particles per move event
      spawnParticle(e.clientX, e.clientY, "heart");
      if (Math.random() > 0.5) {
        const offsetX = randomBetween(-8, 8);
        const offsetY = randomBetween(-8, 8);
        spawnParticle(e.clientX + offsetX, e.clientY + offsetY, "heart");
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      // Clean up DOM particles
      poolRef.current.forEach((el) => el.remove());
      poolRef.current = [];
      poolIndexRef.current = 0;
    };
  }, [containerRef, cardRef, initPool, spawnParticle]);
}

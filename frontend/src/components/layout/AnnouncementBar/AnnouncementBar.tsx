import { useState, useEffect } from "react";

const ANNOUNCEMENTS = [
  "BOTANICAL BLISS FOR YOUR DAILY RITUALS <3",
  "MADE WITH LOVE, SUNSHINE & ORGANIC INGREDIENTS",
  "PLASTIC-FREE, PLANT-POWERED & KIND TO THE EARTH"
];

export const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animState, setAnimState] = useState<"enter" | "active" | "exit">("active");

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setAnimState("exit");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setAnimState("enter");
        // On the next frame, transition into the active state
        setTimeout(() => {
          setAnimState("active");
        }, 40);
      }, 700); // matches the exit animation transition duration
    }, 6000); // 6 seconds stable state

    return () => clearTimeout(timer);
  }, [isPaused, index]);

  const animClasses = {
    active: "opacity-100 translate-x-0",
    exit: "opacity-0 translate-x-3",
    enter: "opacity-0 -translate-x-3",
  };

  return (
    <div
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[36px] bg-dark text-white text-[11px] font-body font-semibold tracking-widest uppercase flex items-center justify-center overflow-hidden select-none z-30"
    >
      <div
        className={`whitespace-nowrap transform transition-all duration-700 ease-[cubic-bezier(0.3,0,0,1)] will-change-transform ${animClasses[animState]}`}
      >
        {ANNOUNCEMENTS[index]}
      </div>
      
      {/* Hardware-accelerated Progress bar using CSS keyframes */}
      <div
        key={`${index}-${isPaused}`} // reset animation on index change or hover pause/play state change
        className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/40 origin-left animate-progress-bar"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
          animationDuration: "6000ms"
        }}
      />
    </div>
  );
};

import { FC, useState } from "react";

export const ApothecaryPhilosophy: FC = () => {
  const [isHeartActive, setIsHeartActive] = useState(false);

  const handleHeartClick = () => {
    if (window.innerWidth < 1024) {
      setIsHeartActive(true);
      setTimeout(() => {
        setIsHeartActive(false);
      }, 600);
    }
  };

  return (
    <section className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#FAF6F0] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Editorial Centered Text Container */}
      <div className="max-w-4xl text-center z-10">
        <h2 className="font-body font-light text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-dark leading-[1.35] tracking-tight cursor-heart">
          A mindful sanctuary for your daily self-care. Hand-crafted botanicals that honor your skin's unique nature,{" "}
          
          {/* Hand-drawn Outline Heart SVG Inline Illustration with Instagram-like Burst on Hover */}
          <span 
            onClick={handleHeartClick}
            className="relative inline-block align-middle mx-1 md:mx-2 group/heart text-[#9D6C76] cursor-heart"
          >
            <style>{`
              @keyframes heartBurst1 {
                0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(-50%, -50%) translate(-24px, -24px) scale(0.85); opacity: 0; }
              }
              @keyframes heartBurst2 {
                0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(-50%, -50%) translate(24px, -24px) scale(0.85); opacity: 0; }
              }
              @keyframes heartBurst3 {
                0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(-50%, -50%) translate(-28px, 6px) scale(0.85); opacity: 0; }
              }
              @keyframes heartBurst4 {
                0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(-50%, -50%) translate(28px, 6px) scale(0.85); opacity: 0; }
              }
              @keyframes heartBurst5 {
                0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(-50%, -50%) translate(-14px, 24px) scale(0.85); opacity: 0; }
              }
              @keyframes heartBurst6 {
                0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(-50%, -50%) translate(14px, 24px) scale(0.85); opacity: 0; }
              }
            `}</style>

            {/* Main Heart Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transform transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] group-hover/heart:scale-125 group-hover/heart:fill-current ${
                isHeartActive ? "scale-125 fill-current" : ""
              }`}
              aria-hidden="true"
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>

            {/* Exploding Burst Mini Hearts (Instagram style) */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/heart:animate-[heartBurst1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${
                isHeartActive ? "animate-[heartBurst1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""
              }`}
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#C597A0] opacity-0 pointer-events-none group-hover/heart:animate-[heartBurst2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${
                isHeartActive ? "animate-[heartBurst2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""
              }`}
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#E2C2C8] opacity-0 pointer-events-none group-hover/heart:animate-[heartBurst3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${
                isHeartActive ? "animate-[heartBurst3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""
              }`}
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/heart:animate-[heartBurst4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${
                isHeartActive ? "animate-[heartBurst4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""
              }`}
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#C597A0] opacity-0 pointer-events-none group-hover/heart:animate-[heartBurst5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${
                isHeartActive ? "animate-[heartBurst5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""
              }`}
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#E2C2C8] opacity-0 pointer-events-none group-hover/heart:animate-[heartBurst6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${
                isHeartActive ? "animate-[heartBurst6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""
              }`}
            >
              <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
            </svg>
          </span>
          {" "}delivering pure plant vitamins, velvet hydration, and a calm, sensory ritual.{" "}
          
          {/* IV Drip Bag with Heart SVG Inline Illustration */}
          <span className="inline-block align-middle mx-1 md:mx-2 text-[#C597A0]">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            >
              {/* Drip Bag Top Hanger / Cap */}
              <path d="M35 20 H45 M38 20 V16 A4 4 0 0 1 42 12 A4 4 0 0 1 46 16 V20" />
              
              {/* Drip Bag Body */}
              <path d="M28 20 H52 A3 3 0 0 1 55 23 V53 A3 3 0 0 1 52 56 L46 62 V65 H34 V62 L28 56 A3 3 0 0 1 25 53 V23 A3 3 0 0 1 28 20 Z" />
              
              {/* Drip Bag Fluid Level (Middle division line) */}
              <line x1="25" y1="40" x2="55" y2="40" />
              
              {/* Drip Bag Measurements (Tick marks on left) */}
              <line x1="25" y1="27" x2="30" y2="27" />
              <line x1="25" y1="33" x2="30" y2="33" />
              <line x1="25" y1="47" x2="30" y2="47" />
              <line x1="25" y1="52" x2="30" y2="52" />
              
              {/* Connecting Tube */}
              <path d="M40 65 V72 C40 82 50 82 50 72 C50 62 57 62 57 72" />
              
              {/* Heart at bottom right */}
              <path d="M 75 87 C 75 87 57 80 57 72 C 57 66 61 62 67 62 C 72 62 75 68 75 68 C 75 68 78 62 83 62 C 89 62 93 66 93 72 C 93 80 75 87 75 87 Z" />
            </svg>
          </span>
        </h2>
      </div>

      {/* Ritual Needs Pill Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-12 md:mt-16 z-10 w-full max-w-3xl">
        
        {/* Badge 1: Deep Hydration */}
        <div 
          className="flex items-center gap-3.5 bg-white py-2.5 pl-2.5 pr-6 rounded-[9999px] shadow-[0_8px_30px_rgba(40,39,63,0.04)] border border-primary/5 hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(40,39,63,0.07)] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer select-none"
        >
          <div className="relative w-10 h-10 rounded-full flex-shrink-0 z-20 hover:z-30">
            <img 
              src="/home/philosophy/deep-hydration.jpeg" 
              alt="Deep Hydration"
              className="w-10 h-10 rounded-full object-cover border border-primary/10 shadow-sm hover:scale-[3.5] hover:rounded-xl hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] cursor-heart"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-body font-semibold text-xs sm:text-sm text-dark leading-tight">
              Deep Hydration
            </span>
            <span className="font-body text-[10px] sm:text-[11px] text-text-secondary leading-none mt-0.5">
              Body creams & oils
            </span>
          </div>
        </div>

        {/* Badge 2: Calming Rituals */}
        <div 
          className="flex items-center gap-3.5 bg-white py-2.5 pl-2.5 pr-6 rounded-[9999px] shadow-[0_8px_30px_rgba(40,39,63,0.04)] border border-primary/5 hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(40,39,63,0.07)] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer select-none"
        >
          <div className="relative w-10 h-10 rounded-full flex-shrink-0 z-20 hover:z-30">
            <img 
              src="/home/philosophy/calming-rituals.jpeg" 
              alt="Calming Rituals"
              className="w-10 h-10 rounded-full object-cover border border-primary/10 shadow-sm hover:scale-[3.5] hover:rounded-xl hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] cursor-heart"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-body font-semibold text-xs sm:text-sm text-dark leading-tight">
              Calming Rituals
            </span>
            <span className="font-body text-[10px] sm:text-[11px] text-text-secondary leading-none mt-0.5">
              Bath soaks & mist
            </span>
          </div>
        </div>

        {/* Badge 3: Daily Cleanse */}
        <div 
          className="flex items-center gap-3.5 bg-white py-2.5 pl-2.5 pr-6 rounded-[9999px] shadow-[0_8px_30px_rgba(40,39,63,0.04)] border border-primary/5 hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(40,39,63,0.07)] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer select-none"
        >
          <div className="relative w-10 h-10 rounded-full flex-shrink-0 z-20 hover:z-30">
            <img 
              src="/home/philosophy/daily-cleanse.jpeg" 
              alt="Daily Cleanse"
              className="w-10 h-10 rounded-full object-cover border border-primary/10 shadow-sm hover:scale-[3.5] hover:rounded-xl hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] cursor-heart"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-body font-semibold text-xs sm:text-sm text-dark leading-tight">
              Daily Cleanse
            </span>
            <span className="font-body text-[10px] sm:text-[11px] text-text-secondary leading-none mt-0.5">
              Gentle botanical soaps
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};

import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

interface RitualFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: RitualFeature[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 transition-all duration-300" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5.8 5.8l4.4 4.4M13.8 13.8l4.4 4.4M5.8 18.2l4.4-4.4M13.8 10.2l4.4-4.4" />
      </svg>
    ),
    title: "Pure Botanicals",
    description: "Cold-pressed elixirs and shampoo bars packed with fresh vitamins.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 transition-all duration-300 group-hover/feat:fill-current" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 22 2c-.28 4.9-1.2 8.3-5.1 11.8A7 7 0 0 1 11 20z" />
        <path d="M9 13l3 3" />
      </svg>
    ),
    title: "Earth Loving",
    description: "Plastic-free, plant-powered essentials kind to you and the soil.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 transition-all duration-300 group-hover/feat:fill-current" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
    title: "Calming Rituals",
    description: "Aromatherapy candles and soothing linen mists for absolute peace.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 transition-all duration-300 group-hover/feat:fill-current" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-5.5-5.5-5.5-.47 0-.89.07-1.3.2A6 6 0 0 0 3 12.5C3 16.09 5.91 19 9.5 19z" />
      </svg>
    ),
    title: "Velvet Touches",
    description: "Rich body creams and botanical oils that feel like soft clouds.",
  },
];

export const CloudRitualGlow: FC = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);

  const handleFeatureClick = (index: number) => {
    if (window.innerWidth < 1024) {
      setActiveFeatureIndex(index);
      setTimeout(() => {
        setActiveFeatureIndex((prev: number | null) => (prev === index ? null : prev));
      }, 600);
    }
  };

  return (
    <section className="relative w-full min-h-[750px] lg:min-h-[850px] overflow-hidden bg-[#A9787C] pt-20 pb-28 md:pb-40 flex flex-col justify-between animate-fade-in">
      {/* Self-contained CSS for slow-drifting cloud and fanning love hearts burst animations */}
      <style>{`
        @keyframes floatingCloud {
          0% { transform: translate(-50%, 0) translate(0, 0); }
          50% { transform: translate(-50%, 0) translate(1.5%, -2%); }
          100% { transform: translate(-50%, 0) translate(0, 0); }
        }
        .animate-cloud-float {
          animation: floatingCloud 22s ease-in-out infinite;
        }
        
        @keyframes popLove1 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-20px, -20px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove2 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(20px, -20px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove3 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-24px, 4px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove4 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(24px, 4px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove5 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-12px, 20px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove6 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(12px, 20px) scale(0.85); opacity: 0; }
        }
      `}</style>

      {/* Main Editorial Text & Column Grid Wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full z-10 relative flex flex-col items-start h-full">
        {/* Editorial Heading */}
        <h2 className="font-body font-light text-white text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.1] text-left max-w-3xl">
          Glow like <br />
          never before
        </h2>

        {/* 4-Column Feature Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 mb-10 w-full text-left">
          {features.map((feat, i) => (
            <div 
              key={i} 
              onClick={() => handleFeatureClick(i)}
              className="flex flex-col items-start cursor-heart group/feat"
            >
              {/* Feature Icon Wrapper with relative center and Heart Burst overlay */}
              <div className="text-white/90 mb-3 relative w-8 h-8 flex items-center justify-start">
                <div className={`transform transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] group-hover/feat:scale-125 ${activeFeatureIndex === i ? "scale-125" : ""}`}>
                  {feat.icon}
                </div>
                
                {/* Exploding Burst Mini Hearts (Instagram style) */}
                <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/feat:animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${activeFeatureIndex === i ? "animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#E2C2C8] opacity-0 pointer-events-none group-hover/feat:animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${activeFeatureIndex === i ? "animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/feat:animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${activeFeatureIndex === i ? "animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#E2C2C8] opacity-0 pointer-events-none group-hover/feat:animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${activeFeatureIndex === i ? "animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/feat:animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${activeFeatureIndex === i ? "animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#E2C2C8] opacity-0 pointer-events-none group-hover/feat:animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${activeFeatureIndex === i ? "animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
              </div>
              
              {/* Feature Title */}
              <h3 className="font-body font-semibold text-white text-base md:text-lg">
                {feat.title}
              </h3>
              {/* Feature Description */}
              <p className="font-body text-white/85 text-xs md:text-sm mt-1 leading-relaxed max-w-[240px]">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Cute Pill Buttons (Styled to match the Hero button outline DNA with play arrow) */}
        <div className="flex items-center gap-3 z-20 mt-2">
          <Link 
            to="/collections"
            className="!inline-flex !items-center !gap-2 !px-6 !py-3 !border !border-solid !border-white !bg-transparent !text-white hover:!bg-white hover:!text-[#A9787C] !font-body !text-xs md:!text-sm !font-semibold !uppercase !tracking-wider !rounded-[9999px] active:scale-[0.96] transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(40,39,63,0.08)] cursor-cloud group"
          >
            shop bliss
            <span className="!text-[8px] translate-y-[-0.5px] group-hover:translate-x-0.5 transition-transform duration-300">▶</span>
          </Link>
          <Link 
            to="/collections/home-living"
            className="!inline-flex !items-center !gap-2 !px-6 !py-3 !border !border-solid !border-white !bg-transparent !text-white hover:!bg-white hover:!text-[#A9787C] !font-body !text-xs md:!text-sm !font-semibold !uppercase !tracking-wider !rounded-[9999px] active:scale-[0.96] transition-all duration-300 cursor-pointer cursor-cloud"
          >
            peek inside
          </Link>
        </div>
      </div>

      {/* Volumetric Floating Cloud Asset at the bottom (Zoomed and masked to fade hard edges) */}
      <img
        src="/home/cloud/cute-cloud.png"
        alt="Bohemian sunset cloud"
        className="absolute bottom-[-18%] lg:bottom-[-22%] left-1/2 w-[160%] lg:w-[150%] h-auto object-contain pointer-events-none z-0 animate-cloud-float select-none opacity-95 scale-110"
        style={{
          WebkitMaskImage: "radial-gradient(85% 70% at 50% 100%, black 50%, transparent 100%)",
          maskImage: "radial-gradient(85% 70% at 50% 100%, black 50%, transparent 100%)",
        }}
        loading="lazy"
      />
    </section>
  );
};

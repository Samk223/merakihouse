import { FC, useState } from "react";

interface RitualItem {
  id: number;
  title: string;
  imageUrl: string;
}

const ritualItems: RitualItem[] = [
  {
    id: 0,
    title: "Solid Skincare & Hydration",
    imageUrl: "/home/ritual-grid/skincare-hydration.jpeg",
  },
  {
    id: 1,
    title: "Botanical Hair Care",
    imageUrl: "/home/ritual-grid/hair-care.jpeg",
  },
  {
    id: 2,
    title: "Home Aromatherapy",
    imageUrl: "/home/ritual-grid/home-aromatherapy.jpeg",
  },
  {
    id: 3,
    title: "Earthy Sugar & Salt Scrubs",
    imageUrl: "/home/ritual-grid/earthy-scrubs.jpeg",
  },
];

export const SkincareRitualGrid: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Computes a centered vertical offset to keep the polaroid safe from clipping
  const getVerticalOffset = (index: number): number => {
    // 0 -> -45px, 1 -> -15px, 2 -> 15px, 3 -> 45px
    return -45 + index * 30;
  };

  return (
    <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#FAF6F0] flex items-center justify-center overflow-hidden cursor-heart">
      
      {/* 12-Column Grid Layout with empty gap column tracks */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-center">
        
        {/* Left Column: Heading and Tagline (Spans Columns 1 to 6) */}
        <div className="w-full lg:col-span-6 flex flex-col items-start text-left z-10">
          <span className="font-body font-semibold text-primary/60 text-xs md:text-sm uppercase tracking-widest mb-4">
            The future of slow beauty is here.
          </span>
          <h2 className="font-body font-light text-dark text-2xl sm:text-3xl md:text-4xl lg:text-[2.15rem] lg:leading-[1.45] tracking-tight">
            Discover beauty that cares. <br />Meraki House combines clean active botanicals, plastic-free solid crafting, and sensory aromatherapy to enhance your skin and home's natural radiance.
          </h2>
        </div>

        {/* Middle Column: Interactive Feature List (Spans Columns 8 to 10, leaving Column 7 as a strict gap) */}
        <div className="w-full lg:col-start-8 lg:col-span-3 flex flex-col relative pt-6 lg:pt-0 z-10">
          <div className="flex flex-col w-full">
            {ritualItems.map((item, index) => {
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`group relative flex items-center justify-between py-[1.25rem] border-b border-primary/10 transition-all duration-300 select-none cursor-heart ${
                    index === 0 ? "border-t" : ""
                  }`}
                >
                  {/* Text Details */}
                  <div className="flex flex-col items-start text-left pr-4">
                    <h3 className="font-body font-medium text-dark/95 text-sm sm:text-base md:text-[1rem] tracking-tight group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Morphing Arrow Chevron Icon (Fills and pops on active state) */}
                  <div 
                    className={`w-8 h-8 flex items-center justify-center rounded-[9999px] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] flex-shrink-0 ${
                      isActive 
                        ? "bg-dark text-white scale-110 shadow-[0_4px_12px_rgba(0,0,0,0.12)]" 
                        : "bg-transparent text-dark/45"
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        isActive ? "translate-x-0.5" : "group-hover:translate-x-1"
                      }`} 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Polaroid Track (Spans Columns 11 to 12) */}
        <div className="w-full lg:col-start-11 lg:col-span-2 relative h-72 hidden lg:block z-10 pl-4">
          <div 
            className="absolute left-0 top-1/2 w-[210px] h-[270px] bg-white p-3 pb-7 rounded-sm shadow-[0_20px_45px_rgba(40,39,63,0.12)] border border-neutral-100/50 transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] pointer-events-none"
            style={{
              transform: `translateY(calc(-50% + ${getVerticalOffset(activeIndex)}px)) rotate(${activeIndex % 2 === 0 ? -3.5 : 3.5}deg)`,
            }}
          >
            <div className="w-full h-[200px] overflow-hidden bg-neutral-50 relative rounded-sm">
              {ritualItems.map((item, idx) => (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${
                    idx === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ transitionProperty: "opacity, transform" }}
                />
              ))}
            </div>
            
            {/* Polaroid bottom caption */}
            <div className="text-[8px] uppercase tracking-widest text-primary/40 mt-3.5 font-semibold text-center select-none font-body">
              meraki house lookbook
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

import { FC, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Minakshi Jha",
    role: "Verified Customer",
    quote: "“I’ve never felt my skin look this radiant. This cream feels like it was made just for me!”",
    imageUrl: "/home/testimonials/minakshi.jpeg",
  },
  {
    id: 2,
    name: "Aishwarya Jha",
    role: "Verified Customer",
    quote: "“The Hibiscus shampoo bar completely restored my hair’s shine. And the smell is pure botanical heaven!”",
    imageUrl: "/home/testimonials/aishwarya.jpeg",
  },
  {
    id: 3,
    name: "Sakshi Kumari",
    role: "Verified Customer",
    quote: "“Their rich body butter melts right into my skin, leaving it velvety smooth. A self-care ritual I look forward to daily.”",
    imageUrl: "/home/testimonials/sakshi.jpeg",
  },
];

export const Testimonials: FC = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Start with Aishwarya Jha in center

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full py-20 md:py-24 bg-[#FAF6F0] flex flex-col items-center justify-center overflow-hidden select-none">
      
      {/* CSS Animation injection for hardware accelerated instant fade-in-up */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide {
          animation: fadeSlideIn 0.35s cubic-bezier(0.3, 0, 0, 1) forwards;
        }
      `}</style>

      {/* Left Navigation Arrow */}
      <button 
        type="button"
        onClick={handlePrev}
        className="absolute left-6 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 p-2 text-dark/30 hover:text-primary transition-colors duration-300 border-none outline-none bg-transparent cursor-pointer"
        aria-label="Previous testimonial"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="w-6 h-6 md:w-7 md:h-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </svg>
      </button>

      {/* Center Testimonial Wrapper */}
      <div className="max-w-4xl w-full px-12 flex flex-col items-center text-center">
        
        {/* 1. Avatars Row Stack */}
        <div className="flex items-center justify-center gap-2 md:gap-4 h-28">
          {testimonialsData.map((t, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="relative focus:outline-none bg-transparent border-none p-0 cursor-heart"
                aria-label={`View testimonial from ${t.name}`}
              >
                {/* Static width/height sizes to prevent CPU layout recalculation reflows.
                    Uses transition-transform and transition-opacity only for GPU acceleration. */}
                <div 
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.3,0,0,1)] ${
                    isActive 
                      ? "opacity-100 scale-100 border-2 border-primary/30 shadow-md" 
                      : "opacity-40 scale-75 hover:opacity-60"
                  }`}
                >
                  <img 
                    src={t.imageUrl} 
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. Review Quote Block (Using activeIndex as key to trigger instant remount animation) */}
        <div 
          key={activeIndex} 
          className="w-full max-w-2xl mt-8 md:mt-10 animate-fade-slide"
        >
          <p className="font-body font-light text-dark text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide">
            {testimonialsData[activeIndex].quote}
          </p>
          
          <h4 className="font-body font-medium text-primary text-xs sm:text-sm tracking-wider uppercase mt-6 md:mt-8">
            {testimonialsData[activeIndex].name}
          </h4>
          <span className="font-body font-light text-text-secondary text-[11px] sm:text-xs">
            {testimonialsData[activeIndex].role}
          </span>
        </div>

      </div>

      {/* Right Navigation Arrow */}
      <button 
        type="button"
        onClick={handleNext}
        className="absolute right-6 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 p-2 text-dark/30 hover:text-primary transition-colors duration-300 border-none outline-none bg-transparent cursor-pointer"
        aria-label="Next testimonial"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="w-6 h-6 md:w-7 md:h-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </button>

    </section>
  );
};

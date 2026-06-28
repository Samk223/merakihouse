import { FC, useRef } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

const summerProducts: Product[] = [
  {
    id: 1,
    name: "Clarifying Charcoal Shampoo Bar",
    price: "₹299",
    imageUrl: "/home/summer/shampoo.jpeg",
  },
  {
    id: 2,
    name: "Hibiscus Repair Conditioner Bar",
    price: "₹329",
    imageUrl: "/home/summer/conditioner.jpeg",
  },
  {
    id: 3,
    name: "Anti-Frizz Hair Serum",
    price: "₹449",
    imageUrl: "/home/summer/serum.jpeg",
  },
  {
    id: 4,
    name: "Sugar Body Scrub",
    price: "₹329",
    imageUrl: "/home/summer/scrub.jpeg",
  },
  {
    id: 5,
    name: "Nourishing Body Wash",
    price: "₹299",
    imageUrl: "/home/summer/wash.jpeg",
  },
  {
    id: 6,
    name: "Room & Linen Mist",
    price: "₹279",
    imageUrl: "/home/summer/mist.jpeg",
  },
];

export const SummerMustHaves: FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const cardWidth = 300; // Average card width + gap
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full flex flex-col bg-[#FAF6F0]">
      
      {/* 1. Smeared Sunset Banner Header */}
      <div 
        className="w-full h-32 md:h-40 relative flex items-center justify-center bg-cover bg-center select-none"
        style={{ backgroundImage: "url('/home/summer/banner.png')" }}
      >
        <style>{`
          @keyframes sunBurst1 {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(-28px, -28px) scale(0.9) rotate(45deg); opacity: 0; }
          }
          @keyframes sunBurst2 {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(28px, -28px) scale(0.9) rotate(-45deg); opacity: 0; }
          }
          @keyframes sunBurst3 {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(-32px, 6px) scale(0.9) rotate(90deg); opacity: 0; }
          }
          @keyframes sunBurst4 {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(32px, 6px) scale(0.9) rotate(-90deg); opacity: 0; }
          }
          @keyframes sunBurst5 {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(-14px, 28px) scale(0.9) rotate(120deg); opacity: 0; }
          }
          @keyframes sunBurst6 {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(14px, 28px) scale(0.9) rotate(-120deg); opacity: 0; }
          }
        `}</style>
        <div className="absolute inset-0 bg-[#FAF6F0]/20 z-0" />
        <h2 className="font-body font-light text-[#2C293E] text-2xl md:text-4xl tracking-[0.25em] uppercase z-10 relative cursor-heart group/title px-6 py-2">
          Summer must-have
          
          {/* Exploding Burst Sun & Stars (Sunshine Bomb) */}
          {/* 1. Peach Sun (Top-Left) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#E6A15C] opacity-0 pointer-events-none group-hover/title:animate-[sunBurst1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          {/* 2. Bright Golden Star (Top-Right) */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#F5C767] opacity-0 pointer-events-none group-hover/title:animate-[sunBurst2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {/* 3. Soft Rose Sun (Middle-Left) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#A9787C] opacity-0 pointer-events-none group-hover/title:animate-[sunBurst3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          {/* 4. White Glow Sparkle (Middle-Right) */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/title:animate-[sunBurst4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {/* 5. Golden Sun (Bottom-Left) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#F5C767] opacity-0 pointer-events-none group-hover/title:animate-[sunBurst5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          {/* 6. Soft Clay Sparkle (Bottom-Right) */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#A9787C] opacity-0 pointer-events-none group-hover/title:animate-[sunBurst6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </h2>
      </div>

      {/* 2. Interactive Horizontal Slider Showcase */}
      <div className="w-full py-16 md:py-24 bg-[#FAF6F0] flex items-center justify-center relative overflow-hidden">
        
        {/* Style block to hide standard browser scrollbars */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative flex flex-col">
          
          {/* Top-Right Slider Control Buttons */}
          <div className="flex justify-end gap-3 mb-6 select-none">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-dark/20 hover:border-dark hover:bg-dark hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90"
              aria-label="Scroll left"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2" 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-dark/20 hover:border-dark hover:bg-dark hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90"
              aria-label="Scroll right"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2" 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Horizontal scrollable row */}
          <div 
            ref={sliderRef}
            className="w-full flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
          >
            {summerProducts.map((product) => (
              <div 
                key={product.id}
                className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start cursor-heart group flex flex-col items-start"
              >
                {/* Square Product Image Container */}
                <div className="w-full aspect-square relative">
                  {/* Zooming Image Wrapper */}
                  <div className="w-full h-full bg-[#F5EFE6] rounded-md overflow-hidden border border-neutral-200/10 shadow-sm transition-transform duration-500 group-hover:scale-103">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Sunshine Bomb Bursting Over Product Card on Hover */}
                  {/* 1. Peach Sun */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#E6A15C] opacity-0 pointer-events-none group-hover:animate-[sunBurst1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  {/* 2. Bright Golden Star */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#F5C767] opacity-0 pointer-events-none group-hover:animate-[sunBurst2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {/* 3. Soft Rose Sun */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#A9787C] opacity-0 pointer-events-none group-hover:animate-[sunBurst3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  {/* 4. White Sparkle */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover:animate-[sunBurst4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {/* 5. Golden Sun */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#F5C767] opacity-0 pointer-events-none group-hover:animate-[sunBurst5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  {/* 6. Soft Clay Sparkle */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#A9787C] opacity-0 pointer-events-none group-hover:animate-[sunBurst6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                
                {/* Product Name */}
                <h3 className="font-body font-medium text-dark/95 text-xs sm:text-sm mt-4 leading-snug min-h-[2.5rem] flex items-start">
                  {product.name}
                </h3>
                
                {/* Indian Rupee price in system-sans for baseline alignment */}
                <span 
                  className="font-semibold text-dark/75 text-xs sm:text-sm mt-1 select-none"
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
                >
                  {product.price}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
};

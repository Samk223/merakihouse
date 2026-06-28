import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { Loader2 } from "lucide-react";

interface KitItem {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

const kitProducts: KitItem[] = [
  {
    id: 4,
    name: "Hibiscus Repair Shampoo Bar",
    price: "₹299",
    imageUrl: "/home/bestsellers/hibiscus-shampoo.jpeg",
  },
  {
    id: 12,
    name: "Botanical Body Oil",
    price: "₹489",
    imageUrl: "/home/bestsellers/body-oil.jpeg",
  },
  {
    id: 13,
    name: "Sugar Body Scrub",
    price: "₹329",
    imageUrl: "/home/bestsellers/sugar-scrub.jpeg",
  },
  {
    id: 16,
    name: "Soy Candle",
    price: "₹349",
    imageUrl: "/home/bestsellers/soy-candle.jpeg",
  },
];

export const FeaturedKit: FC = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddAllToCart = async () => {
    setAdding(true);
    try {
      for (const item of kitProducts) {
        await addToCart(item.id, 1);
      }
      setIsCartOpen(true);
    } catch (e) {
      console.error("Failed to add all kit products:", e);
    } finally {
      setAdding(false);
    }
  };
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF6F0] flex items-center justify-center">
      
      {/* Self-contained CSS for Instagram-style love bomb burst effects */}
      <style>{`
        @keyframes popLove1 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-24px, -24px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove2 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(24px, -24px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove3 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-28px, 4px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove4 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(28px, 4px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove5 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(-12px, 24px) scale(0.85); opacity: 0; }
        }
        @keyframes popLove6 {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(12px, 24px) scale(0.85); opacity: 0; }
        }
      `}</style>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 px-6 md:px-12 items-center">
        
        {/* Left Column: Description, Product Shelf, and CTAs */}
        <div className="lg:col-span-7 text-left w-full">
          <span className="block font-body font-medium text-[#7A4B54] text-xs sm:text-sm tracking-[0.2em] uppercase select-none">
            Our best-selling set
          </span>
          <h2 className="block font-body font-light text-2xl sm:text-3xl md:text-[2.25rem] leading-[1.35] text-dark mt-3 w-full md:w-[550px] max-w-full">
            All you need for radiant, healthy skin & hair in one kit.
          </h2>

          {/* Individual Kit Products Shelf */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {kitProducts.map((product) => (
              <div key={product.id} className="flex flex-col items-start w-full cursor-heart group/card">
                {/* Square Product Image Container with overflow-visible to let flowers burst outwards */}
                <div className="w-full aspect-square relative">
                  {/* Zooming Image Wrapper */}
                  <div className="w-full h-full bg-[#F5EFE6] rounded-md overflow-hidden border border-neutral-200/10 shadow-sm transition-transform duration-500 group-hover/card:scale-103">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Roses & Flowers Bomb Bursting on Card Hover */}
                  {/* 1. Terracotta Blossom */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#9D6C76] opacity-0 pointer-events-none group-hover/card:animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 8a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4zm0-9a3 3 0 013 3c0 .82-.33 1.57-.88 2.12-.55.55-1.3.88-2.12.88a3 3 0 01-3-3c0-.82.33-1.57.88-2.12C10.43 2.33 11.18 2 12 2zm0 14c.82 0 1.57.33 2.12.88.55.55.88 1.3.88 2.12a3 3 0 01-3 3 3 3 0 01-3-3c0-.82.33-1.57.88-2.12.55-.55 1.3-.88 2.12-.88zm7-7a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3c0-.82.33-1.57.88-2.12C16.43 9.33 17.18 9 18 9zm-12 0c.82 0 1.57.33 2.12.88C8.67 10.43 9 11.18 9 12a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" />
                  </svg>
                  {/* 2. Soft Pink Rosebud */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#E379B7] opacity-0 pointer-events-none group-hover/card:animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 2c-3.3 0-6 2.7-6 6v3c0 2.2 1.8 4 4 4v3h4v-3c2.2 0 4-1.8 4-4V8c0-3.3-2.7-6-6-6zm2 9h-4V8c0-1.1.9-2 2-2s2 .9 2 2v3z" />
                  </svg>
                  {/* 3. Clay Rose Blossom */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#A9787C] opacity-0 pointer-events-none group-hover/card:animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 8a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4zm0-9a3 3 0 013 3c0 .82-.33 1.57-.88 2.12-.55.55-1.3.88-2.12.88a3 3 0 01-3-3c0-.82.33-1.57.88-2.12C10.43 2.33 11.18 2 12 2zm0 14c.82 0 1.57.33 2.12.88.55.55.88 1.3.88 2.12a3 3 0 01-3 3 3 3 0 01-3-3c0-.82.33-1.57.88-2.12.55-.55 1.3-.88 2.12-.88zm7-7a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3c0-.82.33-1.57.88-2.12C16.43 9.33 17.18 9 18 9zm-12 0c.82 0 1.57.33 2.12.88C8.67 10.43 9 11.18 9 12a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" />
                  </svg>
                  {/* 4. White Cream Rosebud */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/card:animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 2c-3.3 0-6 2.7-6 6v3c0 2.2 1.8 4 4 4v3h4v-3c2.2 0 4-1.8 4-4V8c0-3.3-2.7-6-6-6zm2 9h-4V8c0-1.1.9-2 2-2s2 .9 2 2v3z" />
                  </svg>
                  {/* 5. Terracotta Rosebud */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/card:animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 2c-3.3 0-6 2.7-6 6v3c0 2.2 1.8 4 4 4v3h4v-3c2.2 0 4-1.8 4-4V8c0-3.3-2.7-6-6-6zm2 9h-4V8c0-1.1.9-2 2-2s2 .9 2 2v3z" />
                  </svg>
                  {/* 6. Soft Pink Blossom */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#E379B7] opacity-0 pointer-events-none group-hover/card:animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 8a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4zm0-9a3 3 0 013 3c0 .82-.33 1.57-.88 2.12-.55.55-1.3.88-2.12.88a3 3 0 01-3-3c0-.82.33-1.57.88-2.12C10.43 2.33 11.18 2 12 2zm0 14c.82 0 1.57.33 2.12.88.55.55.88 1.3.88 2.12a3 3 0 01-3 3 3 3 0 01-3-3c0-.82.33-1.57.88-2.12.55-.55 1.3-.88 2.12-.88zm7-7a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3c0-.82.33-1.57.88-2.12C16.43 9.33 17.18 9 18 9zm-12 0c.82 0 1.57.33 2.12.88C8.67 10.43 9 11.18 9 12a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" />
                  </svg>
                </div>
                {/* Text details below */}
                <h3 className="font-body font-medium text-dark/90 text-[11px] sm:text-xs mt-3 leading-tight min-h-[2.5rem] flex items-start">
                  {product.name}
                </h3>
                {/* Rupee price in system-sans for perfect vertical alignment */}
                <span 
                  className="font-semibold text-dark/75 text-[11px] sm:text-xs mt-1 text-left select-none"
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
                >
                  {product.price}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Capsule Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 mt-10 sm:mt-12 w-full">
            
            {/* Primary Filled Cart Button */}
            <button
              type="button"
              onClick={handleAddAllToCart}
              disabled={adding}
              className="!py-3.5 !px-6 !bg-dark !text-white hover:!bg-primary hover:!text-white !font-body !text-xs sm:!text-sm !font-semibold !uppercase !tracking-widest !rounded-[9999px] active:scale-[0.96] transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2 border-none outline-none disabled:opacity-50"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding all...</span>
                </>
              ) : (
                <>
                  <span>Add all to cart</span>
                  <span 
                    className="ml-2 font-medium"
                    style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
                  >
                    ₹1,199 <span className="line-through opacity-50 ml-1.5">₹1,466</span>
                  </span>
                </>
              )}
            </button>

            {/* Secondary Outline kits Route */}
            <Link
              to="/collections/gift-kits"
              className="!py-3.5 !px-6 !bg-transparent !text-dark hover:!bg-dark hover:!text-white !font-body !text-xs sm:!text-sm !font-semibold !uppercase !tracking-widest !rounded-[9999px] active:scale-[0.96] transition-all duration-200 cursor-pointer border border-dark/30 hover:border-dark text-center select-none decoration-none"
            >
              Explore all the kits
            </Link>

          </div>
        </div>

        {/* Right Column: Editorial Portrait framed with abstract colored circles */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px] aspect-square relative select-none cursor-heart">
            
            {/* Decorative Static Brand Color Circles matching reference image coordinates */}
            
            {/* 1. HAIR HOTSPOT (Top-Left on dark hair - solid clay-rose background with white plus SVG) */}
            <div className="absolute left-[24%] top-[14%] z-20 group/hotspot cursor-heart">
              <div className="absolute inset-0 rounded-full bg-[#A9787C]/50 animate-ping" />
              <button
                type="button"
                className="relative w-8 h-8 rounded-full bg-[#A9787C] border-2 border-white shadow-lg flex items-center justify-center cursor-heart focus:outline-none transition-transform duration-300 group-hover/hotspot:scale-110"
                aria-label="Hair care details"
              >
                {/* Thick Vector SVG Plus Icon in White */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="3.5" 
                  stroke="currentColor" 
                  className="w-4 h-4 text-white select-none"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

                {/* Exploding Burst Mini Hearts (Instagram style) */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E5C7B0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
              </button>
              {/* Tooltip Description Bubble */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-52 p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-[#9D6C76]/20 opacity-0 pointer-events-none scale-95 group-hover/hotspot:opacity-100 group-hover/hotspot:scale-100 transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] text-[11px] leading-relaxed text-dark text-center select-none z-30">
                <strong>Rice Water Shampoo Bar & Hair Serum</strong> deeply nourish roots, smooth cuticles, and make hair anti-frizz and stronger.
              </div>
            </div>
            
            {/* 2. CHEEK HOTSPOT (Face Glow - rose-gold background with white plus SVG) */}
            <div className="absolute left-[60%] top-[45%] z-20 group/hotspot cursor-heart">
              <div className="absolute inset-0 rounded-full bg-[#9D6C76]/50 animate-ping" />
              <button
                type="button"
                className="relative w-8 h-8 rounded-full bg-[#9D6C76] border-2 border-white shadow-lg flex items-center justify-center cursor-heart focus:outline-none transition-transform duration-300 group-hover/hotspot:scale-110"
                aria-label="Skincare details"
              >
                {/* Thick Vector SVG Plus Icon in White */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="3.5" 
                  stroke="currentColor" 
                  className="w-4 h-4 text-white select-none"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#E5C7B0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
              </button>
              {/* Tooltip Description Bubble */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-52 p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-[#9D6C76]/20 opacity-0 pointer-events-none scale-95 group-hover/hotspot:opacity-100 group-hover/hotspot:scale-100 transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] text-[11px] leading-relaxed text-dark text-center select-none z-30">
                <strong>Botanical Body & Face Oil</strong> infuses sweet almond and organic rosehip to restore natural radiance for an organic, healthy face glow.
              </div>
            </div>

            {/* 3. COLLARBONE HOTSPOT (Moisture - soft clay background with white plus SVG) */}
            <div className="absolute left-[18%] bottom-[12%] z-20 group/hotspot cursor-heart">
              <div className="absolute inset-0 rounded-full bg-[#A9787C]/50 animate-ping" />
              <button
                type="button"
                className="relative w-8 h-8 rounded-full bg-[#A9787C] border-2 border-white shadow-lg flex items-center justify-center cursor-heart focus:outline-none transition-transform duration-300 group-hover/hotspot:scale-110"
                aria-label="Body care details"
              >
                {/* Thick Vector SVG Plus Icon in White */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="3.5" 
                  stroke="currentColor" 
                  className="w-4 h-4 text-white select-none"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#E5C7B0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/hotspot:animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]">
                  <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                </svg>
              </button>
              {/* Tooltip Description Bubble */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 w-52 p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-[#9D6C76]/20 opacity-0 pointer-events-none scale-95 group-hover/hotspot:opacity-100 group-hover/hotspot:scale-100 transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] text-[11px] leading-relaxed text-dark text-center select-none z-30">
                <strong>Sugar Body Scrub & Rich Body Butter</strong> melt into the skin, locking in deep hydration for 24-hour moisturized softness.
              </div>
            </div>

            {/* Square Image Frame Wrapper */}
            <div className="w-full h-full bg-[#F5EFE6] rounded-lg overflow-hidden shadow-lg border border-neutral-200/20 z-10 relative">
              <img
                src="/home/featured-kit/model.png"
                alt="Model showcasing Meraki House botanical glow lookbook"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.3,0,0,1)] hover:scale-103"
                loading="lazy"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

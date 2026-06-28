import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";

interface ProductCard {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

const bestsellerProducts: ProductCard[] = [
  {
    id: 4,
    name: "Hibiscus Repair Shampoo Bar",
    price: "₹299",
    imageUrl: "/home/bestsellers/hibiscus-shampoo.jpeg",
  },
  {
    id: 7,
    name: "Anti-Frizz Hair Serum",
    price: "₹449",
    imageUrl: "/home/bestsellers/hair-serum.jpeg",
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
    id: 18,
    name: "Room & Linen Mist",
    price: "₹279",
    imageUrl: "/home/bestsellers/linen-mist.jpeg",
  },
  {
    id: 16,
    name: "Soy Candle",
    price: "₹349",
    imageUrl: "/home/bestsellers/soy-candle.jpeg",
  },
];

export const Bestsellers: FC = () => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [isTitleActive, setIsTitleActive] = useState(false);

  const handleCardClick = (productId: number) => {
    if (window.innerWidth < 1024) {
      setActiveCardId((prev) => (prev === productId ? null : productId));
    }
  };

  const handleTitleClick = () => {
    if (window.innerWidth < 1024) {
      setIsTitleActive(true);
      setTimeout(() => {
        setIsTitleActive(false);
      }, 600);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".bestseller-card-container")) {
        setActiveCardId(null);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      await addToCart(productId, 1);
      showToast(`${productName} added to cart!`);
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showToast("Failed to add to cart");
    }
  };
  return (
    <section className="w-full flex flex-col">
      {/* 1. Smeared Clay Bestsellers Header Banner */}
      <div 
        className="w-full h-32 md:h-40 relative flex items-center justify-center bg-cover bg-center select-none"
        style={{ backgroundImage: "url('/home/bestsellers/banner.png')" }}
      >
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
        <div className="absolute inset-0 bg-[#FAF6F0]/25 z-0" />
        <h2 
          onClick={handleTitleClick}
          className="font-body font-light text-[#2C293E] text-2xl md:text-4xl tracking-[0.25em] uppercase z-10 relative cursor-heart group/title px-6 py-2"
        >
          Bestsellers
          
          {/* Exploding Burst Mini Hearts (Instagram style) */}
          <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/title:animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${isTitleActive ? "animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
            <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#9D6C76] opacity-0 pointer-events-none group-hover/title:animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${isTitleActive ? "animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
            <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#E379B7] opacity-0 pointer-events-none group-hover/title:animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${isTitleActive ? "animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
            <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#FAF6F0] opacity-0 pointer-events-none group-hover/title:animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${isTitleActive ? "animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
            <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] opacity-0 pointer-events-none group-hover/title:animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${isTitleActive ? "animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
            <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute top-1/2 left-1/2 w-3 h-3 text-[#E379B7] opacity-0 pointer-events-none group-hover/title:animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] ${isTitleActive ? "animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards]" : ""}`}>
            <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
          </svg>
        </h2>
      </div>

      {/* 2. Bestsellers Products Showcase Grid */}
      <div className="w-full py-16 md:py-24 bg-[#FAF6F0] flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 px-6 md:px-12">
          {bestsellerProducts.map((product) => (
            <div 
              key={product.id} 
              className="bestseller-card-container group flex flex-col items-start w-full relative cursor-pointer"
              onClick={() => handleCardClick(product.id)}
            >
              {/* Product Card Image Container (overflow-visible to allow breakout zoom) */}
              <div className="w-full aspect-square relative z-10">
                
                {/* Inner scaling card wrapper (Zooms 1.35x anchored at bottom on hover, preventing title overlap) */}
                <div className={`w-full h-full relative rounded-md shadow-sm border border-neutral-200/10 transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] origin-bottom group-hover:scale-[1.35] group-hover:shadow-[0_25px_50px_rgba(40,39,63,0.20)] group-hover:z-30 z-10 overflow-hidden ${
                  product.id === activeCardId ? "scale-[1.35] shadow-[0_25px_50px_rgba(40,39,63,0.20)] z-30" : ""
                }`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Hover overlay with Quick view and Shopping Bag cart triggers */}
                  <div className={`absolute inset-0 bg-[#FAF6F0]/10 transition-opacity duration-300 flex flex-col justify-end p-2.5 pb-3 opacity-0 group-hover:opacity-100 ${
                    product.id === activeCardId ? "opacity-100" : ""
                  }`}>
                    <div className={`flex items-center gap-1.5 w-full transform transition-all duration-300 delay-[50ms] z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                      product.id === activeCardId ? "translate-y-0 opacity-100" : ""
                    }`}>
                      
                      {/* Quick View Button */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
                        }}
                        className="flex-grow !py-2 !px-3 !bg-white !text-dark hover:!bg-dark hover:!text-white !font-body !text-[10px] md:!text-[11px] !font-medium !uppercase !tracking-wider !rounded-[9999px] active:scale-[0.96] transition-all duration-200 cursor-pointer shadow-sm border-none outline-none"
                      >
                        Quick view
                      </button>
                      
                      {/* Shopping Bag Button */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id, product.name);
                        }}
                        className="w-8 h-8 flex items-center justify-center !bg-white !text-dark hover:!bg-dark hover:!text-white !rounded-full active:scale-[0.9] transition-all duration-200 cursor-pointer shadow-sm border-none outline-none"
                        aria-label="Add to cart"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth="2" 
                          stroke="currentColor" 
                          className="w-3.5 h-3.5"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
                          />
                        </svg>
                      </button>

                    </div>
                  </div>
                </div>

              </div>

              {/* Product Info below Card */}
              <div className="w-full flex flex-col items-start mt-4 z-0">
                {/* min-h-[2.5rem] forces all titles to occupy same height, aligning prices horizontally */}
                <h3 className="font-body font-medium text-dark/95 text-xs md:text-sm text-left leading-tight group-hover:text-primary transition-colors duration-300 min-h-[2.5rem] flex items-start">
                  {product.name}
                </h3>
                
                {/* System sans-serif stack inline style for pixel-perfect baseline mapping */}
                <span 
                  className="font-semibold text-dark/80 text-xs md:text-sm mt-1.5 text-left select-none"
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
                >
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import apiClient from "../api/apiClient";
import { resolveImageUrl } from "../utils/imageHelper";

interface CollectionCardType {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: string;
}

interface ParticleType {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  scale: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  opacity: number;
}

const collectionsList: CollectionCardType[] = [
  {
    id: 1,
    name: "Hair Care",
    slug: "hair-care",
    description: "Consciously crafted shampoo bars and botanical serums to repair, clarify, and nourish your locks.",
    image: "/home/categories/hair_care_thumbnail.png",
    itemCount: "7 Products",
  },
  {
    id: 2,
    name: "Body Care",
    slug: "body-care",
    description: "Deeply hydrating body lotions, whipped organic butters, and exfoliating sugar and salt scrubs.",
    image: "/home/categories/body_care_thumbnail.png",
    itemCount: "7 Products",
  },
  {
    id: 3,
    name: "Home & Living",
    slug: "home-living",
    description: "Sensory soy candles, aromatherapeutic linen mists, reed diffusers, and wabi-sabi clay accessories.",
    image: "/home/categories/home_living_thumbnail.png",
    itemCount: "7 Products",
  },
];

interface IngredientType {
  name: string;
  scientificName: string;
  benefit: string;
  image: string;
}

const ingredientsList: IngredientType[] = [
  {
    name: "Hibiscus",
    scientificName: "Hibiscus Sabdariffa",
    benefit: "Naturally conditions hair, strengthens roots, and restores rich shine.",
    image: "/home/ingredients/hibiscus.png",
  },
  {
    name: "Rosemary",
    scientificName: "Rosmarinus Officinalis",
    benefit: "Stimulates hair follicles, supports scalp blood circulation, and prevents thinning.",
    image: "/home/ingredients/rosemary.png",
  },
  {
    name: "Lavender",
    scientificName: "Lavandula Angustifolia",
    benefit: "Calms skin irritation, balances sebum levels, and eases stress.",
    image: "/home/ingredients/lavender.png",
  },
  {
    name: "Shea Butter",
    scientificName: "Butyrospermum Parkii",
    benefit: "Deeply moisturizing emollient rich in vitamins to lock in long-lasting hydration.",
    image: "/home/ingredients/sheabutter.png",
  },
];

interface HoverAnimatedImageProps {
  pngSrc: string;
  gifSrc: string;
  alt: string;
}

const HoverAnimatedImage: React.FC<HoverAnimatedImageProps> = ({ pngSrc, gifSrc, alt }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full relative"
    >
      <img 
        src={isHovered ? gifSrc : pngSrc} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-105"
      />
    </div>
  );
};

export const CollectionPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<ParticleType[]>([]);
  
  const lastSpawnRef = useRef(0);
  const particleIdRef = useRef(0);

  const [collections, setCollections] = useState<CollectionCardType[]>(collectionsList);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const response = await apiClient.get("/categories");
      const categoriesData = response.data.data || [];
      if (categoriesData.length > 0) {
        const mapped = categoriesData.map((cat: any) => {
          const primaryMedia = cat.media?.find((m: any) => m.is_primary) || cat.media?.[0];
          const imageUrl = resolveImageUrl(cat.image || (primaryMedia ? (primaryMedia.url || primaryMedia.path) : "/placeholders/collection.png"));
          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            image: imageUrl,
            itemCount: "Explore"
          };
        });
        setCollections(mapped);
      }
    } catch (error) {
      console.error("Failed to load collections from API, falling back to static list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, type: 'celebration' | 'hearts' | 'glow' = 'celebration') => {
    const now = Date.now();
    if (now - lastSpawnRef.current < 40) return; // Spawn a particle every 40ms on mouse move
    lastSpawnRef.current = now;

    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chars = type === 'hearts'
      ? ["💖", "💗", "💓", "💝", "💕", "♥"]
      : type === 'glow'
      ? ["✨", "✦", "⭐", "🌟", "✧"]
      : ["✨", "✦", "🌸", "💖", "⭐", "🎈"];
      
    const colors = type === 'hearts'
      ? ["#C597A0", "#9D6C76", "#B98EA7", "#E379B7", "#FFB7C5"]
      : type === 'glow'
      ? ["#E1B057", "#FFF2D4", "#F4D068", "#C597A0", "#FFF"]
      : ["#C597A0", "#9D6C76", "#E1B057", "#0E7C7B", "#B98EA7"];

    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newParticle = {
      id: particleIdRef.current++,
      x,
      y,
      char: randomChar,
      color: randomColor,
      scale: Math.random() * 0.5 + 0.6,
      vx: (Math.random() - 0.5) * 5, // Left-right velocity
      vy: -Math.random() * 3.5 - 2.5, // Float upwards velocity
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12, // Spin speed
      opacity: 1,
    };

    setParticles((prev: ParticleType[]) => [...prev.slice(-50), newParticle]); // Caps max particles to 50
  };

  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setInterval(() => {
      setParticles((prev: ParticleType[]) =>
        prev
          .map((p: ParticleType) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            rotation: p.rotation + p.vr,
            opacity: p.opacity - 0.035, // Smooth fade-out rate
          }))
          .filter((p: ParticleType) => p.opacity > 0)
      );
    }, 16); // Run at 60 FPS

    return () => clearInterval(timer);
  }, [particles]);

  return (
    <div ref={pageRef} className="w-full bg-[#FAF8F5] pb-24 select-none relative">
      {/* Slim Soft Blush Editorial Header Banner */}
      <div 
        className="w-full bg-cover bg-center border-b border-[#28273F]/5 select-none relative overflow-hidden py-10 md:py-12 flex items-center justify-center animate-fade-in text-center"
        style={{ backgroundImage: "url('/home/categories/collections_banner.png')" }}
      >
        {/* Soft elegant overlay to ensure text stands out beautifully */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.2px] pointer-events-none" />
        
        {/* Centered Editorial Content */}
        <div className="z-10 relative">
          <div className="relative inline-block">
            <h1 
              onMouseMove={(e) => handleMouseMove(e, 'celebration')}
              className="font-body text-2xl md:text-3xl text-[#2C293E] tracking-[0.25em] uppercase font-light cursor-pointer select-none py-2 px-6"
            >
              Our collections
            </h1>
          </div>
        </div>
      </div>

      {/* Editorial Content Below Banner */}
      <div className="max-w-[1100px] mx-auto px-6 text-center mt-10 mb-12 animate-fade-in cursor-heart">
        <p className="font-body text-base md:text-lg text-[#2C293E]/85 tracking-wide font-light max-w-none mx-auto leading-relaxed">
          Explore our range of premium, small-batch <span className="inline-block whitespace-nowrap">
          <svg 
            onMouseMove={(e) => handleMouseMove(e, 'hearts')}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="!inline-block w-6 h-6 text-[#9D6C76] mr-1.5 align-middle translate-y-[-2px]"
          >
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <path d="M50 42 C40 15, 60 15, 50 42 Z" />
            <path d="M58 50 C85 40, 85 60, 58 50 Z" />
            <path d="M50 58 C40 85, 60 85, 50 58 Z" />
            <path d="M42 50 C15 40, 15 60, 42 50 Z" />
            <path d="M44 44 C20 20, 35 10, 44 44 Z" />
            <path d="M56 44 C80 20, 90 35, 56 44 Z" />
            <path d="M56 56 C80 80, 65 90, 56 56 Z" />
            <path d="M44 56 C20 80, 10 65, 44 56 Z" />
          </svg>
          <span 
            onMouseMove={(e) => handleMouseMove(e, 'hearts')}
            className="relative border-b-[2px] border-[#9D6C76] pb-[1px] font-medium text-[#2C293E]"
          >
            botanical
          </span></span> formulations and wabi-sabi lifestyle accessories.<br className="hidden sm:inline" />
          Each collection is carefully crafted to turn your daily routine into a slow, conscious self-love ritual.
        </p>
      </div>

      {/* Grid of collections */}
      <div className="container-custom px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {collections.map((col, index) => (
            <div
              key={col.id}
              className="group flex flex-col bg-white rounded-[24px] overflow-hidden border border-[#28273F]/12 shadow-[0_20px_50px_rgba(40,39,63,0.08)] hover:shadow-[0_25px_60px_rgba(40,39,63,0.14)] transition-all duration-[800ms] ease-[cubic-bezier(0.3,0,0,1)] animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0] cursor-heart">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1000ms] ease-[cubic-bezier(0.3,0,0,1)]"
                  loading="lazy"
                />
              </div>

              {/* Card Details */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="font-body font-semibold text-lg md:text-xl text-[#28273F] tracking-wide mb-3">
                    {col.name}
                  </h2>
                  <p className="font-body text-sm text-[#666666] leading-relaxed tracking-wide font-light mb-6">
                    {col.description}
                  </p>
                </div>

                <Link
                  to={`/collections/${col.slug}`}
                  className="inline-flex items-center justify-center gap-2 border border-solid border-[#28273F] text-[#28273F] bg-transparent py-2.5 px-6 rounded-[9999px] font-body text-[10px] font-bold tracking-[0.18em] uppercase hover:!bg-[#B98EA7] hover:!border-[#B98EA7] hover:!text-white transition-all duration-300 ease-in-out active:scale-[0.96] self-start cursor-pointer group"
                >
                  Explore
                  <span className="text-[7px] translate-y-[-0.5px]">▶</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="w-full bg-[#FAF6F0] py-20 md:py-24 border-t border-[#28273F]/5 mt-24 cursor-heart">
        <div className="container-custom max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-body text-[#2C293E] text-3xl md:text-[2.5rem] font-light tracking-wide leading-[1.3] text-center">
              Meet the <span className="font-serif italic font-normal text-[#2C293E]">Ingredients</span> in<br />
              Your Formula
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {ingredientsList.map((ing) => (
              <div key={ing.name} className="flex flex-col items-center text-center group">
                {/* Circular image container with zoom */}
                <div className="w-36 h-36 rounded-full overflow-hidden border border-[#28273F]/10 shadow-[0_8px_24px_rgba(40,39,63,0.03)] mb-5 bg-[#FAF8F5]">
                  <HoverAnimatedImage
                    pngSrc={ing.image}
                    gifSrc={ing.image.replace('.png', '.gif')}
                    alt={ing.name}
                  />
                </div>
                {/* Scientific Name */}
                <span className="font-body italic text-[11px] text-[#9D6C76] tracking-wide block">
                  {ing.scientificName}
                </span>
                {/* Common Name */}
                <h3 className="font-body font-semibold text-base text-[#28273F] mt-1 tracking-wide">
                  {ing.name}
                </h3>
                {/* Benefit description */}
                <p className="font-body text-xs text-[#666666] leading-relaxed mt-2.5 max-w-[200px]">
                  {ing.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How We Function Section */}
      <div className="w-full bg-[#FAF8F5] py-20 md:py-24 border-t border-[#28273F]/5 cursor-heart">
        <div className="container-custom max-w-7xl mx-auto px-6">
          {/* Header 2-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start mb-14">
            <div className="md:col-span-1">
              <h2 className="font-body text-[#2C293E] text-3xl md:text-4xl font-light tracking-wide leading-tight">
                How We Function
              </h2>
            </div>
            <div className="md:col-span-2">
              <p className="font-body text-sm md:text-base text-[#666666] leading-relaxed font-light">
                We carefully review every ingredient for safety and performance. Our formulas are science-based and vegan, prioritizing naturally-derived ingredients in optimized dosages based on your skin, hair, and body needs.
              </p>
            </div>
          </div>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-[#28273F]/10 mb-14 text-[#28273F] font-body text-xs font-bold tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <span className="text-[#8FA89B] text-lg font-bold">✓</span> CRUELTY - FREE
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8FA89B] text-lg font-bold">✓</span> SULFATE - FREE
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8FA89B] text-lg font-bold">✓</span> PARABEN - FREE
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8FA89B] text-lg font-bold">✓</span> 100% VEGAN
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8FA89B] text-lg font-bold">✓</span> DERMATOLOGIST TESTED
            </div>
          </div>

          {/* Content Split: Unified Card Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-[#28273F]/10 rounded-[24px] shadow-[0_15px_45px_rgba(40,39,63,0.04)] mt-4 items-stretch">
            {/* Left Column: Product Image (Flush with card edges) */}
            <div className="relative overflow-hidden min-h-[400px] lg:min-h-0">
              <img
                src="/home/how_we_function.jpeg"
                alt="Meraki House Branded Formulations"
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-[1000ms] ease-[cubic-bezier(0.3,0,0,1)]"
              />
            </div>

            {/* Right Column: Quality, Efficacy, Safety Pillars */}
            <div className="bg-[#FCFAF7] p-8 md:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#28273F]/10">
              {/* Quality */}
              <div 
                onMouseMove={(e) => handleMouseMove(e, 'glow')}
                className="pb-8 border-b border-[#28273F]/10 cursor-heart"
              >
                <h3 className="font-body font-semibold text-lg text-[#28273F] tracking-wide mb-2">
                  Quality
                </h3>
                <p className="font-body text-sm text-[#666666] leading-relaxed font-light">
                  Our innovative approach to beauty is to do more with fewer, targeted, high-performing ingredients, combined to work more effectively together.
                </p>
              </div>

              {/* Efficacy */}
              <div 
                onMouseMove={(e) => handleMouseMove(e, 'glow')}
                className="py-8 border-b border-[#28273F]/10 cursor-heart"
              >
                <h3 className="font-body font-semibold text-lg text-[#28273F] tracking-wide mb-2">
                  Efficacy
                </h3>
                <p className="font-body text-sm text-[#666666] leading-relaxed font-light">
                  Combining the best from nature + science, we deliver the most efficacious, personalized formula possible for your unique hair, skin, and body needs.
                </p>
              </div>

              {/* Safety */}
              <div 
                onMouseMove={(e) => handleMouseMove(e, 'glow')}
                className="pt-8 cursor-heart"
              >
                <h3 className="font-body font-semibold text-lg text-[#28273F] tracking-wide mb-2">
                  Safety
                </h3>
                <p className="font-body text-sm text-[#666666] leading-relaxed font-light">
                  Every ingredient meets both US and EU cosmetic regulations, and each of our formulations are reviewed by an expert toxicologist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page-wide Particle Emitter Layer */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute pointer-events-none select-none text-sm z-50"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
            color: p.color,
            opacity: p.opacity,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};

export default CollectionPage;
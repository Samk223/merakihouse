import { FC } from "react";
import { Link } from "react-router-dom";

interface RitualCard {
  id: string;
  title: string;
  categoryLink: string;
  imageUrl: string;
  alt: string;
  cursorClass: string;
}

const ritualCards: RitualCard[] = [
  {
    id: "hair-serums",
    title: "Hair Serums",
    categoryLink: "/collections/hair-care",
    imageUrl: "/home/showcase/hair-serums.jpeg",
    alt: "Applying nourishing anti-frizz hair serum",
    cursorClass: "cursor-serum",
  },
  {
    id: "velvet-hydration",
    title: "Velvet Hydration",
    categoryLink: "/collections/body-care",
    imageUrl: "/home/showcase/velvet-hydration.jpeg",
    alt: "Applying rich body butter to skin",
    cursorClass: "cursor-butter",
  },
  {
    id: "botanical-oils",
    title: "Botanical Oils",
    categoryLink: "/collections/body-care",
    imageUrl: "/home/showcase/botanical-oils.jpeg",
    alt: "Golden botanical body oil being applied with dropper",
    cursorClass: "cursor-oil",
  },
  {
    id: "home-aromatherapy",
    title: "Home Aromatherapy",
    categoryLink: "/collections/home-living",
    imageUrl: "/home/showcase/home-aromatherapy.jpeg",
    alt: "Soy candles and linen mists for self-care ritual",
    cursorClass: "cursor-spray",
  },
];

export const RitualUsageShowcase: FC = () => {
  return (
    <section className="w-full pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-[#FAF6F0]">
      {/* 4-Column Grid for pixel-perfect editorial lookbook cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {ritualCards.map((card) => (
          <Link
            key={card.id}
            to={card.categoryLink}
            className={`group/card relative block w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(40,39,63,0.02)] border border-primary/5 hover:shadow-[0_16px_40px_rgba(40,39,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${card.cursorClass}`}
          >
            {/* Inner wrapper to isolate translates/clicks and stabilize hover hit box boundary */}
            <div className="absolute inset-x-0 top-0 w-full h-[calc(100%+12px)] transform group-hover/card:translate-y-[-6px] active:scale-[0.98] transition-transform duration-500 ease-[cubic-bezier(0.3,0,0,1)]">
              {/* Background Zooming Product Photo (Zoom on hover only) */}
              <img
                src={card.imageUrl}
                alt={card.alt}
                className="absolute inset-0 w-full h-full object-cover transform group-hover/card:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.3,0,0,1)]"
                loading="lazy"
              />

              {/* Gradient Overlay for visual hierarchy and high text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-90 group-hover/card:opacity-95 transition-opacity duration-500" />

              {/* Bottom-left aligned text block */}
              <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col items-start text-left z-10 pointer-events-none">
                <span className="font-body font-semibold text-base sm:text-lg md:text-xl text-white tracking-tight leading-snug">
                  {card.title}
                </span>
                
                <span className="relative font-body text-xs sm:text-sm text-white/95 mt-1 sm:mt-1.5 flex items-center gap-1 font-medium">
                  Shop now
                  
                  {/* Micro-animating underline effect */}
                  <span className="absolute left-0 bottom-[-2px] w-full h-[1px] bg-white origin-left scale-x-100 group-hover/card:scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.3,0,0,1)]" />
                  <span className="absolute left-0 bottom-[-2px] w-full h-[1px] bg-white origin-right scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.3,0,0,1)] delay-100" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

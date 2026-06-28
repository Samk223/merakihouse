import { forwardRef, useRef, useEffect } from "react";
import { Button } from "../../ui/Button/Button";
import { Play } from "lucide-react";

export interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
  onShopClick?: () => void;
  onExploreClick?: () => void;
}

export const Hero = forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      videoSrc = "/assets/home/hero/hero-video-desktop.mp4",
      posterSrc = "",
      onShopClick,
      onExploreClick,
      ...props
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.5; // Play at half-speed
      }
    }, [videoSrc]);

    return (
      <section
        id="hero"
        ref={ref}
        className="relative w-full h-[calc(100vh-36px)] bg-dark overflow-hidden"
        {...props}
      >
        {/* Full-bleed Video Background Container */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            className="w-full h-full object-cover opacity-85 transition-opacity duration-1000 ease-in-out"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle dark gradient overlay to ensure text contrast on the bottom-left */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Overlaid Editorial Content aligned at the bottom-left corner */}
        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-16 lg:left-24 z-10 max-w-xl md:max-w-4xl flex flex-col gap-8 md:gap-10 text-white animate-page">
          
          <h1 className="font-body font-light text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white leading-[1.05] tracking-tight">
            Nature's rituals,<br />
            made for everyday living.
          </h1>

          {/* Action Button */}
          <div className="flex mt-2 md:mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={onShopClick}
              className="!border !border-solid !border-white !text-white hover:!bg-white hover:!text-dark !px-8 !py-3.5 flex items-center gap-3 transition-all duration-300 active:scale-[0.96]"
            >
              <span>Explore Collection</span>
              <Play className="w-2.5 h-2.5 fill-current text-current" />
            </Button>
          </div>
          
        </div>
      </section>
    );
  }
);

Hero.displayName = "Hero";

import { FC, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Footer: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Star rating state
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRatingClick = (stars: number) => {
    setRating(stars);
    setShowThankYou(true);
  };

  const handleLinkClick = (pathOrAnchor: string) => {
    if (pathOrAnchor.startsWith("/")) {
      navigate(pathOrAnchor);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (location.pathname === "/") {
      const element = document.querySelector(pathOrAnchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate("/" + pathOrAnchor);
    }
  };

  const ratingLabels: { [key: number]: string } = {
    1: "Oh no! 😢 We will do better.",
    2: "We'll do better! 🌿 Thank you.",
    3: "Thanks! 🌸 Glad you like it.",
    4: "Love it! ✨ Thank you so much!",
    5: "Meraki Magic! 💖 Best experience!",
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I rate Meraki House ${rating || 5}/5 stars! 🌟 Loving their premium modern bohemian skincare and apothecary line. #BeautyWithMeraki`
  )}`;

  return (
    <footer className="w-full bg-[#1B1A27] text-white pt-16 pb-10 relative overflow-visible select-none border-t border-white/5 rounded-t-[20px] sm:rounded-t-[32px] md:rounded-t-[40px]">
      
      {/* 1. Main content grid containing flower on left and details on right */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 sm:pb-24 relative z-10">
        
        {/* Left Side: Botanical Flower illustration (Enlarged and borderless) */}
        <div className="lg:col-span-6 relative flex flex-col items-center lg:items-start justify-center w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]">
          {/* Peony Flower Image Container - Added background color backdrop for screen blend support */}
          <div className="w-[300px] h-[300px] sm:w-[420px] h-[420px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] relative flex items-center justify-center bg-[#1B1A27]">
            <img 
              src="/home/footer_flower.png" 
              alt="Botanical Flower Petal"
              className="w-full h-full object-cover mix-blend-screen opacity-85"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Side: Rating Interactive Capsule and Links Columns (Natural stack layout) */}
        <div className="lg:col-span-6 flex flex-col lg:pl-6 text-left">
          
          {/* Rating Capsule Section replacing standard subscription */}
          <div className="w-full flex flex-col items-start">
            <h3 className="font-body font-light text-white text-lg tracking-wider mb-2">
              Rate us & share the excitement
            </h3>
            <p className="font-body font-light text-white/50 text-xs tracking-wide mb-5">
              Support us on Twitter using hashtag <span className="text-secondary font-medium">#BeautyWithMeraki</span>
            </p>

            {/* Cute Rating stars picker layout */}
            <div className="flex flex-col gap-3 w-full">
              
              {/* Row 1: Isolated Stars Row to prevent layout shifts */}
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-transform duration-150 hover:scale-115 active:scale-95 bg-transparent border-none p-0 outline-none cursor-pointer focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <span 
                      className={`transition-colors duration-150 ${
                        star <= (hoverRating || rating) 
                          ? "text-[#C597A0] drop-shadow-[0_0_8px_rgba(197,151,160,0.5)]" 
                          : "text-white/20"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>

              {/* Row 2: Fixed height horizontal reaction labels block with whitespace-nowrap */}
              <div className="h-5 flex items-center mt-1">
                {(hoverRating || rating) > 0 ? (
                  <span className="font-body font-medium text-xs text-[#C597A0] tracking-wider transition-opacity duration-300 whitespace-nowrap">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                ) : (
                  <span className="font-body font-light text-xs text-white/40 tracking-wider whitespace-nowrap">
                    Hover and tap to rate your experience
                  </span>
                )}
              </div>

              {/* Share Tweet CTA Button - Styled exactly like landing page button UI */}
              <div className="w-full mt-3">
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-center !py-3.5 !px-8 !bg-[#28273F] hover:!bg-[#9D6C76] !text-white !font-body !text-xs !font-semibold !uppercase !tracking-widest !rounded-[9999px] active:scale-[0.96] transition-all duration-200 cursor-pointer shadow-md border border-white/5 outline-none whitespace-nowrap"
                >
                  Share Tweet
                </a>
              </div>
            </div>

            {showThankYou && (
              <span className="block font-body text-[10px] text-[#FAF6F0]/60 tracking-wider mt-3 animate-pulse">
                Thank you! Click "Share Tweet" to tweet your review.
              </span>
            )}
          </div>

          {/* Links Column Grids - Stacks naturally with controlled margin-top */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-white/10 pt-10 mt-10">
            
            {/* Column 1: Quick Links */}
            <div className="flex flex-col">
              <h4 className="font-body font-medium text-white/95 text-xs sm:text-sm tracking-wider uppercase mb-5">
                Quick links
              </h4>
              <ul className="flex flex-col gap-3 font-body font-light text-white/50 text-[11px] sm:text-xs select-none">
                <li>
                  <button onClick={() => handleLinkClick("/")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">Home</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("/collections")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">Categories</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("#hero")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">News</button>
                </li>
              </ul>
            </div>

            {/* Column 2: Support */}
            <div className="flex flex-col">
              <h4 className="font-body font-medium text-white/95 text-xs sm:text-sm tracking-wider uppercase mb-5">
                Support
              </h4>
              <ul className="flex flex-col gap-3 font-body font-light text-white/50 text-[11px] sm:text-xs select-none">
                <li>
                  <button onClick={() => handleLinkClick("#hero")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">Journal</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("#hero")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">Privacy policy</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("#hero")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">Contacts</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("#faq")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">FAQ</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Follow us */}
            <div className="flex flex-col">
              <h4 className="font-body font-medium text-white/95 text-xs sm:text-sm tracking-wider uppercase mb-5">
                Follow us
              </h4>
              <ul className="flex flex-col gap-3 font-body font-light text-white/50 text-[11px] sm:text-xs select-none">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">Instagram</a>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("#hero")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">Facebook</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("#hero")} className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-left">YouTube</button>
                </li>
                <li>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">X (Twitter)</a>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Massive brand title stretching horizontally across the full footer width overlay */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative -mt-20 sm:-mt-28 lg:-mt-36 z-20 pointer-events-none select-none">
        <h1 className="font-body font-light text-[3.2rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] leading-none tracking-tight text-white select-none whitespace-nowrap opacity-[0.98]">
          Meraki House<span className="text-[1.2rem] sm:text-[2.2rem] lg:text-[3rem] align-super font-normal ml-1">®</span>
        </h1>
      </div>

    </footer>
  );
};

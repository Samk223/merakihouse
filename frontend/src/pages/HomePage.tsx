import { useNavigate } from "react-router-dom";
import { Hero } from "../components/layout/Hero/Hero";
import { ApothecaryPhilosophy } from "../components/layout/ApothecaryPhilosophy/ApothecaryPhilosophy";
import { RitualUsageShowcase } from "../components/layout/RitualUsageShowcase/RitualUsageShowcase";
import { CloudRitualGlow } from "../components/layout/CloudRitualGlow/CloudRitualGlow";
import { SkincareRitualGrid } from "../components/layout/SkincareRitualGrid/SkincareRitualGrid";
import { Bestsellers } from "../components/layout/Bestsellers/Bestsellers";
import { Testimonials } from "../components/layout/Testimonials/Testimonials";
import { FeaturedKit } from "../components/layout/FeaturedKit/FeaturedKit";
import { FAQ } from "../components/layout/FAQ/FAQ";
import { SummerMustHaves } from "../components/layout/SummerMustHaves/SummerMustHaves";
import { InstagramFeed } from "../components/layout/InstagramFeed/InstagramFeed";

const HomePage = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/collections");
  };

  const handleExploreClick = () => {
    navigate("/collections/gift-kits");
  };

  return (
    <div className="w-full">
      {/* Editorial Homepage Hero Section */}
      <Hero
        onShopClick={handleShopClick}
        onExploreClick={handleExploreClick}
      />
      
      {/* Apothecary Philosophy Centered Statement Section */}
      <ApothecaryPhilosophy />

      {/* Ritual Usage Showcase Cards Section */}
      <RitualUsageShowcase />

      {/* Cloud-embellished Glow like never before Ritual section */}
      <CloudRitualGlow />

      {/* Skincare Ritual list grid section with sliding tilted polaroid popup */}
      <SkincareRitualGrid />

      {/* Curated Bestsellers Showcase Product Grid Section */}
      <Bestsellers />

      {/* customer testimonials carousel section */}
      <Testimonials />

      {/* Featured Bestselling Set / Gift Kit Section */}
      <FeaturedKit />

      {/* Frequently Asked Questions accordion section */}
      <FAQ />

      {/* Summer Must-Haves horizontal product slider section */}
      <SummerMustHaves />

      {/* Instagram feed collage masonry section */}
      <InstagramFeed />
    </div>
  );
};

export default HomePage;
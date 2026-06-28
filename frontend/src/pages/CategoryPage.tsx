import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import apiClient from "../api/apiClient";
import { Search, SlidersHorizontal, ShoppingBag, Loader2, ChevronDown } from "lucide-react";
import { resolveProductImage, resolveImageUrl } from "../utils/imageHelper";

interface ProductType {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: string;
  discount_price: string | null;
  stock: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  images?: Array<{ path: string; is_primary: boolean }>;
}

const CATEGORY_META: Record<string, { title: string; subtitle: string; banner: string; domainLabel: string; objectPosition: string }> = {
  "all": {
    title: "All Products",
    subtitle: "Browse our entire catalog of premium botanical formulations.",
    banner: "/home/categories/collections_banner.png",
    domainLabel: "all products",
    objectPosition: "center",
  },
  "hair-care": {
    title: "Hair Care",
    subtitle: "Conscious cleansing, scalp detoxifying, and nourishing elixirs.",
    banner: "/home/categories/hair_care_hero_v3.png",
    domainLabel: "my hair",
    objectPosition: "center 50%", // Keep hair care centered as it already looks perfect
  },
  "body-care": {
    title: "Body Care",
    subtitle: "Sensorial body oils, rich whipped butters, and organic polishes.",
    banner: "/home/categories/body_care_hero_v3.jpg",
    domainLabel: "my body",
    objectPosition: "bottom", // Align the bottom of the image to bring the bottles fully up into view
  },
  "home-living": {
    title: "Home & Living",
    subtitle: "Aromatherapeutic hand-poured soy candles, reed diffusers, and mists.",
    banner: "/home/categories/home_living_hero_v3.jpg",
    domainLabel: "my home",
    objectPosition: "bottom", // Align the bottom of the image to bring the diffusers fully up into view
  },
};

// Sentence filter structures
const TYPE_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  "hair-care": [
    { value: "all", label: "all products" },
    { value: "shampoo", label: "shampoo bars" },
    { value: "conditioner", label: "conditioner bars" },
    { value: "oil", label: "hair oils" },
    { value: "serum", label: "hair serums" },
    { value: "kit", label: "gift kits" },
  ],
  "body-care": [
    { value: "all", label: "all products" },
    { value: "wash", label: "body wash" },
    { value: "lotion", label: "body lotion" },
    { value: "butter", label: "body butter" },
    { value: "oil", label: "body oil" },
    { value: "scrub", label: "body scrubs" },
    { value: "salts", label: "bath salts" },
    { value: "brush", label: "dry brushes" },
    { value: "kit", label: "gift kits" },
  ],
  "home-living": [
    { value: "all", label: "all products" },
    { value: "candle", label: "soy candles" },
    { value: "diffuser", label: "reed diffusers" },
    { value: "mist", label: "linen mists" },
    { value: "melts", label: "wax melts" },
    { value: "holder", label: "incense holders" },
    { value: "oil", label: "essential oils" },
    { value: "kit", label: "gift kits" },
  ],
};

const SUITS_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  "hair-care": [
    { value: "all", label: "all hair types" },
    { value: "straight", label: "straight hair" },
    { value: "wavy", label: "wavy hair" },
    { value: "curly", label: "curly hair" },
    { value: "coily", label: "coily hair" },
    { value: "frizz", label: "frizz concerns" },
    { value: "repair", label: "damaged hair" },
  ],
  "body-care": [
    { value: "all", label: "all skin types" },
    { value: "dry", label: "dry skin" },
    { value: "sensitive", label: "sensitive skin" },
    { value: "normal", label: "normal skin" },
  ],
  "home-living": [
    { value: "all", label: "all spaces" },
    { value: "living", label: "living room" },
    { value: "bedroom", label: "bedroom" },
    { value: "bathroom", label: "bathroom" },
    { value: "meditation", label: "meditation space" },
  ],
};

export const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [categoryDetails, setCategoryDetails] = useState<{ title: string; subtitle: string; banner: string; domainLabel: string; objectPosition: string } | null>(null);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);
  const [activeCartBombId, setActiveCartBombId] = useState<number | null>(null);

  useEffect(() => {
    if (categorySlug) {
      const staticMeta = CATEGORY_META[categorySlug] || CATEGORY_META["all"];
      setCategoryDetails(staticMeta);

      if (categorySlug === "gift-kits") {
        setCategoryDetails({
          title: "Gift Kits",
          subtitle: "Beautifully curated botanical bundles for thoughtful gifting.",
          banner: "/home/categories/collections_banner.png",
          domainLabel: "gift kits",
          objectPosition: "center"
        });
      } else if (categorySlug !== "all") {
        const fetchCategoryDetails = async () => {
          try {
            const response = await apiClient.get(`/categories/${categorySlug}`);
            if (response.data.success || response.status === 200) {
              const cat = response.data.data;
              const heroMedia = cat.media?.find((m: any) => !m.is_primary && m.sort_order === 1) || cat.media?.[0];
              const bannerUrl = resolveImageUrl(heroMedia ? (heroMedia.url || heroMedia.path) : (staticMeta?.banner || "/home/categories/collections_banner.png"));
              
              let domainLabel = "all products";
              if (categorySlug === "hair-care") domainLabel = "my hair";
              else if (categorySlug === "body-care") domainLabel = "my body";
              else if (categorySlug === "home-living") domainLabel = "my home";
              else domainLabel = `my ${cat.name.toLowerCase()}`;

              setCategoryDetails({
                title: cat.name,
                subtitle: cat.description || "",
                banner: bannerUrl,
                domainLabel: domainLabel,
                objectPosition: staticMeta?.objectPosition || "center"
              });
            }
          } catch (error) {
            console.error("Failed to load category details from API, using static fallback:", error);
          }
        };
        fetchCategoryDetails();
      }
    }
  }, [categorySlug]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");

  // Sync search keyword from URL search parameters
  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    setSearchTerm(urlQuery);
  }, [searchParams]);
  const [maxPrice, setMaxPrice] = useState("1500");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sentence Discover Filter State
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [suitsDropdownOpen, setSuitsDropdownOpen] = useState(false);

    const [selectedType, setSelectedType] = useState("all");
  const [selectedSuits, setSelectedSuits] = useState("all");

  const [domainHover, setDomainHover] = useState(false);
  const [typeHover, setTypeHover] = useState(false);
  const [suitsHover, setSuitsHover] = useState(false);
  const [discoverHover, setDiscoverHover] = useState(false);

  interface BubbleParticle {
    id: number;
    x: number;
    y: number;
    type: "bubble" | "soap" | "candle" | "glow";
    size: number;
    vx: number;
    vy: number;
    rotate: number;
    rotateSpeed: number;
    opacity: number;
  }

  const [particles, setParticles] = useState<BubbleParticle[]>([]);
  const particleIdRef = useRef(0);

  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (Math.random() > 0.15) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const isHomeLiving = categorySlug === "home-living";
    const particleType = isHomeLiving
      ? (Math.random() > 0.45 ? "candle" : "glow")
      : (Math.random() > 0.45 ? "bubble" : "soap");

    const newParticle: BubbleParticle = {
      id: particleIdRef.current++,
      x,
      y,
      type: particleType,
      size: Math.random() * 20 + 14,
      vx: (Math.random() - 0.5) * 3.5,
      vy: -Math.random() * 2.5 - 1.5,
      rotate: Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 4,
      opacity: 1.0
    };
    setParticles((prev) => [...prev, newParticle].slice(-45));
  };

  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            rotate: p.rotate + p.rotateSpeed,
            opacity: p.opacity - 0.02
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [particles]);

  const domainRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const suitsRef = useRef<HTMLDivElement>(null);

  // Close sentence dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (domainRef.current && !domainRef.current.contains(e.target as Node)) {
        setDomainDropdownOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
      if (suitsRef.current && !suitsRef.current.contains(e.target as Node)) {
        setSuitsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchProducts = async () => {
    if (!categorySlug) return;
    setLoading(true);
    try {
      const isGiftKits = categorySlug === "gift-kits";
      const response = await apiClient.get("/products", {
        params: {
          category: (categorySlug === "all" || isGiftKits) ? undefined : categorySlug,
          search: searchTerm || undefined,
          max_price: maxPrice || undefined,
          per_page: 50,
        },
      });
      if (response.data.success) {
        let list = response.data.data.data || [];
        if (isGiftKits) {
          list = list.filter((p: any) => p.name.toLowerCase().includes("kit"));
        }
        setProducts(list);
        setFilteredProducts(list);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, searchTerm, maxPrice]);

  useEffect(() => {
    setSelectedType("all");
    setSelectedSuits("all");
  }, [categorySlug]);

  // Apply Sentence Builder Filters
  const handleDiscoverMatch = () => {
    // 1. Find the kit product in this category
    const kitProduct = products.find((p) => p.name.toLowerCase().includes("kit"));
    const nonKitProducts = products.filter((p) => p.id !== kitProduct?.id);

    // 2. Filter non-kit products based on selected type and concerns
    let matched = [...nonKitProducts];

    if (selectedType !== "all") {
      matched = matched.filter((p) => {
        const nameLower = p.name.toLowerCase();
        const descLower = (p.description || "").toLowerCase();
        return nameLower.includes(selectedType) || descLower.includes(selectedType);
      });
    }

    if (selectedSuits !== "all") {
      matched = matched.filter((p) => {
        const nameLower = p.name.toLowerCase();
        const descLower = (p.description || "").toLowerCase();
        const shortLower = (p.short_description || "").toLowerCase();
        return (
          nameLower.includes(selectedSuits) ||
          descLower.includes(selectedSuits) ||
          shortLower.includes(selectedSuits)
        );
      });
    }

    // 3. Only pad if they are discovering without specific filters (i.e. all products + all suits)
    let finalSelection: ProductType[] = [];
    if (selectedType === "all" && selectedSuits === "all") {
      // Show exactly 3 best-selling products by default
      finalSelection = matched.slice(0, 3);
    } else {
      // Strictly show only what matches
      finalSelection = matched;
    }

    // 4. Combine matching products + the kit product (if found)
    const resultList = kitProduct ? [...finalSelection, kitProduct] : finalSelection;

    setFilteredProducts(resultList);
  };

  const handleResetMatch = () => {
    setSelectedType("all");
    setSelectedSuits("all");
    setFilteredProducts(products);
  };

  const handleAddToCart = async (product: ProductType) => {
    setAddingToCartId(product.id);
    setActiveCartBombId(product.id);
    setTimeout(() => setActiveCartBombId(null), 600);
    await addToCart(product.id, 1);
    setAddingToCartId(null);
  };

  if (!categoryDetails || !categorySlug) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center font-body text-[#28273F]">
        <h2 className="text-xl font-semibold mb-4">Collection Not Found</h2>
        <Link to="/collections" className="text-[#9D6C76] hover:underline font-semibold text-sm">
          Return to Collections
        </Link>
      </div>
    );
  }

  const typeOptions = TYPE_OPTIONS[categorySlug] || [];
  const suitsOptions = SUITS_OPTIONS[categorySlug] || [];

  return (
    <div className="w-full bg-[#FAF8F5] pb-24 select-none">
      {/* 1. Full-Bleed Editorial Header Banner */}
      <div className="w-full select-none relative overflow-hidden h-80 md:h-96 flex items-end justify-center pb-8 md:pb-12">
        {/* Background Image occupying the whole background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <style>{`
            .category-hero-banner-img {
              object-position: ${categoryDetails.objectPosition || "center"} !important;
            }
          `}</style>
          <img
            src={categoryDetails.banner}
            alt={categoryDetails.title}
            className="w-full h-full object-cover category-hero-banner-img !w-full !h-full !max-w-none"
          />
        </div>

         {/* Text overlay centered */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 z-10 relative text-center">
          <h1 
            onMouseMove={handleHeaderMouseMove}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.15em] uppercase font-light drop-shadow-md cursor-heart select-none relative inline-block px-4 py-2"
          >
            {categoryDetails.title}
            
            {/* Particle Emitter Container */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    opacity: p.opacity,
                    transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
                    pointerEvents: "none",
                    transition: "opacity 0.03s linear"
                  }}
                >
                  {p.type === "bubble" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-[0_2px_4px_rgba(40,39,63,0.15)]">
                      <circle cx="12" cy="12" r="6" />
                      <path d="M10 9.5a2.5 2.5 0 0 1 2.5-2.5" />
                      <circle cx="6" cy="7" r="3" />
                      <path d="M5 5.8a1.2 1.2 0 0 1 1.2-1.2" />
                      <circle cx="17" cy="8" r="2.5" />
                      <circle cx="18" cy="15" r="1.8" />
                      <circle cx="6" cy="16" r="2" />
                      <circle cx="12" cy="5" r="1.2" />
                    </svg>
                  ) : p.type === "soap" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-[0_2px_4px_rgba(40,39,63,0.15)]">
                      <rect x="4" y="6" width="16" height="12" rx="3" />
                      <circle cx="12" cy="12" r="1.8" />
                      <path d="M12 9v1.5M12 13.5V15M9 12h1.5M13.5 12H15M9.8 9.8l1.1 1.1M13.1 13.1l1.1 1.1M14.2 9.8l-1.1 1.1M10.9 13.1l-1.1 1.1" />
                      <circle cx="17" cy="4" r="1.2" />
                      <circle cx="19" cy="5.5" r="1.0" />
                      <circle cx="5" cy="18" r="1.2" />
                    </svg>
                  ) : p.type === "candle" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-[0_2px_4px_rgba(40,39,63,0.15)]">
                      <path d="M4 20h16a1 1 0 0 1 1 1v1H3v-1a1 1 0 0 1 1-1z" fill="rgba(255,255,255,0.15)" />
                      <rect x="7" y="10" width="10" height="10" rx="1.5" />
                      <path d="M7 12c1 0 1.5 1.5 2 1.5s1-1.5 2-1.5 1.5 2 2.5 2 1.5-2 2.5-2" />
                      <line x1="12" y1="10" x2="12" y2="7.5" />
                      <path d="M12 7.5c0 0-1.5-1.5-1.5-2.8a1.5 1.5 0 0 1 3 0c0 1.3-1.5 2.8-1.5 2.8z" fill="rgba(255,255,255,0.85)" />
                      <path d="M9 3.5c0 0-.6-.6-.6-1.1a.6.6 0 0 1 1.2 0c0 .5-.6 1.1-.6 1.1zM15 4c0 0-.6-.6-.6-1.1a.6.6 0 0 1 1.2 0c0 .5-.6 1.1-.6 1.1z" fill="rgba(255,255,255,0.85)" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" className="w-full h-full drop-shadow-[0_2px_4px_rgba(40,39,63,0.15)]">
                      <path d="M12 21C12 21 3.5 14 3.5 8.5C3.5 5.5 6 3 9 3C10.8 3 11.5 4.2 12 5C12.5 4.2 13.2 3 15 3C18 3 20.5 5.5 20.5 8.5C20.5 14 12 21 12 21Z" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </h1>
          <p 
            className="font-body text-xs md:text-sm text-white tracking-wide font-light max-w-[600px] mx-auto mt-4 leading-relaxed"
            style={{ textShadow: "0 2px 8px rgba(40, 39, 63, 0.95)" }}
          >
            {categoryDetails.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        
        {/* 2. Interactive Natural Language Filter Builder */}
        {categorySlug !== "all" && categorySlug !== "gift-kits" && (
          <div className="w-full bg-white border border-[#28273F]/5 rounded-[24px] p-8 md:p-10 shadow-[0_8px_35px_rgba(40,39,63,0.015)] mb-12 text-center flex flex-col items-center justify-center animate-fade-in relative z-20">
          
          {/* Interactive sentence row */}
          <div className="flex flex-wrap items-center justify-center gap-y-4 font-body text-lg md:text-2xl text-[#28273F] font-light tracking-wide leading-relaxed">
            
            <span className="mr-2">For</span>
            
            {/* Domain Dropdown */}
            <div ref={domainRef} className="relative inline-block mr-3">
              <button
                onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
                onMouseEnter={() => setDomainHover(true)}
                onMouseLeave={() => setDomainHover(false)}
                style={{
                  color: domainHover ? "#855A63" : "#9D6C76",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  padding: "0 4px",
                  outline: "none"
                }}
                className="select-none"
              >
                <span style={{ borderBottom: `1.5px dashed ${domainHover ? "#855A63" : "#9D6C76"}`, paddingBottom: "2px" }}>
                  {categoryDetails.domainLabel}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${domainDropdownOpen ? "rotate-180" : ""}`} style={{ color: domainHover ? "#855A63" : "#9D6C76", opacity: 0.8 }} />
              </button>
              
              {domainDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border border-[#28273F]/10 rounded-[12px] shadow-lg py-2 z-30 animate-scale text-left">
                  <button
                    onClick={() => { navigate("/collections/hair-care"); setDomainDropdownOpen(false); }}
                    className="w-full px-4 py-2 hover:bg-[#FAF8F5] text-xs font-semibold text-[#28273F] text-left capitalize"
                  >
                    my hair
                  </button>
                  <button
                    onClick={() => { navigate("/collections/body-care"); setDomainDropdownOpen(false); }}
                    className="w-full px-4 py-2 hover:bg-[#FAF8F5] text-xs font-semibold text-[#28273F] text-left capitalize"
                  >
                    my body
                  </button>
                  <button
                    onClick={() => { navigate("/collections/home-living"); setDomainDropdownOpen(false); }}
                    className="w-full px-4 py-2 hover:bg-[#FAF8F5] text-xs font-semibold text-[#28273F] text-left capitalize"
                  >
                    my home
                  </button>
                </div>
              )}
            </div>

            <span className="mr-3">I'm looking for</span>

            {/* Product Type Dropdown */}
            <div ref={typeRef} className="relative inline-block mr-3">
              <button
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                onMouseEnter={() => setTypeHover(true)}
                onMouseLeave={() => setTypeHover(false)}
                style={{
                  color: typeHover ? "#799184" : "#8FA89B",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  padding: "0 4px",
                  outline: "none"
                }}
                className="select-none"
              >
                <span style={{ borderBottom: `1.5px dashed ${typeHover ? "#799184" : "#8FA89B"}`, paddingBottom: "2px" }}>
                  {typeOptions.find((o) => o.value === selectedType)?.label || "all products"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${typeDropdownOpen ? "rotate-180" : ""}`} style={{ color: typeHover ? "#799184" : "#8FA89B", opacity: 0.8 }} />
              </button>

              {typeDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-[#28273F]/10 rounded-[12px] shadow-lg py-2 z-30 max-h-60 overflow-y-auto animate-scale text-left">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedType(opt.value); setTypeDropdownOpen(false); }}
                      className="w-full px-4 py-2 hover:bg-[#FAF8F5] text-xs font-semibold text-[#28273F] text-left capitalize"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="mr-3">that suits</span>

            {/* Concerns/Suits Dropdown */}
            <div ref={suitsRef} className="relative inline-block">
              <button
                onClick={() => setSuitsDropdownOpen(!suitsDropdownOpen)}
                onMouseEnter={() => setSuitsHover(true)}
                onMouseLeave={() => setSuitsHover(false)}
                style={{
                  color: suitsHover ? "#9A728A" : "#B98EA7",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  padding: "0 4px",
                  outline: "none"
                }}
                className="select-none"
              >
                <span style={{ borderBottom: `1.5px dashed ${suitsHover ? "#9A728A" : "#B98EA7"}`, paddingBottom: "2px" }}>
                  {suitsOptions.find((o) => o.value === selectedSuits)?.label || "all concerns"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${suitsDropdownOpen ? "rotate-180" : ""}`} style={{ color: suitsHover ? "#9A728A" : "#B98EA7", opacity: 0.8 }} />
              </button>

              {suitsDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-[#28273F]/10 rounded-[12px] shadow-lg py-2 z-30 max-h-60 overflow-y-auto animate-scale text-left">
                  {suitsOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedSuits(opt.value); setSuitsDropdownOpen(false); }}
                      className="w-full px-4 py-2 hover:bg-[#FAF8F5] text-xs font-semibold text-[#28273F] text-left capitalize"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center mt-8 w-full max-w-[450px] gap-6">
            <button
              onClick={handleDiscoverMatch}
              onMouseEnter={() => setDiscoverHover(true)}
              onMouseLeave={() => setDiscoverHover(false)}
              style={{
                border: "1px solid #28273F",
                borderRadius: "9999px",
                padding: "10px 24px",
                color: discoverHover ? "#FFFFFF" : "#28273F",
                backgroundColor: discoverHover ? "#28273F" : "transparent",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="cursor-heart select-none"
            >
              Discover —— Your Match
            </button>
            <button
              onClick={handleResetMatch}
              className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#666666] hover:text-[#28273F] underline underline-offset-4 cursor-pointer"
            >
              Reset
            </button>
          </div>

        </div>
        )}

        {/* Mobile Toggle Filter Button */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <span className="text-xs font-body uppercase tracking-wider text-[#666666]">
            {filteredProducts.length} Products
          </span>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 border border-[#28273F]/10 px-4 py-2 rounded-[9999px] font-body text-xs text-[#28273F] bg-white cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* 3. Filter Sidebar (Desktop: Visible, Mobile: Toggle Drawer) */}
          <aside
            className={`w-full md:w-64 shrink-0 bg-white border border-[#28273F]/5 rounded-[20px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.01)] h-fit space-y-6 ${
              isFilterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#28273F]/5">
              <h2 className="font-heading text-lg text-[#28273F]">Filters</h2>
              <SlidersHorizontal className="w-4 h-4 text-[#28273F]/50 hidden md:block" />
            </div>

             {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#28273F]/70 font-body">
                Search
              </label>
              <div className="relative" style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "38px",
                    paddingRight: "16px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    backgroundColor: "#FAF8F5",
                    border: "1px solid rgba(40, 39, 63, 0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#28273F",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
                <Search
                  className="w-3.5 h-3.5 text-[#28273F]/40"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none"
                  }}
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#28273F]/70 font-body">
                <span>Max Price</span>
                <span className="text-[#9D6C76] font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[#9D6C76] h-1 bg-[#FAF8F5] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#666666] font-body">
                <span>₹100</span>
                <span>₹1,500</span>
              </div>
            </div>

            {/* Reset Filters button */}
            <button
              onClick={() => {
                setSearchTerm("");
                setMaxPrice("1500");
                handleResetMatch();
              }}
              className="w-full py-2 border border-[#9D6C76]/20 rounded-[9999px] text-[10px] font-body tracking-wider uppercase font-semibold text-[#9D6C76] hover:bg-[#9D6C76]/5 transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </aside>

          {/* 4. Product Catalog Grid */}
          <main className="flex-grow">
            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="min-h-[40vh] bg-white border border-[#28273F]/5 rounded-[24px] flex flex-col justify-center items-center p-8 text-center">
                <p className="font-body text-sm text-[#666666] mb-4">
                  No products match your filter parameters.
                </p>
                <button
                  onClick={handleResetMatch}
                  className="inline-flex items-center justify-center border border-[#28273F] text-[#28273F] bg-transparent py-2.5 px-6 rounded-[9999px] font-body text-[10px] font-bold tracking-[0.18em] uppercase hover:bg-[#28273F] hover:text-[#FAF8F5] active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const hasDiscount = !!product.discount_price;
                  const primaryImage = resolveProductImage(product.images?.find((img) => img.is_primary)?.path || product.images?.[0]?.path);

                  return (
                    <div
                      key={product.id}
                      className="group bg-white border border-[#28273F]/10 rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(40,39,63,0.04)] hover:shadow-[0_12px_45px_rgba(40,39,63,0.09)] hover:translate-y-[-4px] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] flex flex-col h-full"
                    >
                      {/* Product Image Frame */}
                      <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0] block">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.3,0,0,1)]"
                          loading="lazy"
                        />
                        {/* Indicators (Featured, Best Seller, New Arrival) */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.is_featured && (
                            <span className="bg-[#28273F] text-white text-[9px] font-body font-bold tracking-widest uppercase px-2.5 py-1 rounded-[4px] shadow-sm">
                              Featured
                            </span>
                          )}
                          {product.is_best_seller && (
                            <span className="bg-[#9D6C76] text-white text-[9px] font-body font-bold tracking-widest uppercase px-2.5 py-1 rounded-[4px] shadow-sm">
                              Best Seller
                            </span>
                          )}
                          {product.is_new_arrival && (
                            <span className="bg-[#B98EA7] text-white text-[9px] font-body font-bold tracking-widest uppercase px-2.5 py-1 rounded-[4px] shadow-sm">
                              New
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Content details */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] tracking-widest uppercase text-[#9D6C76]/70 font-semibold font-body block mb-1">
                            Meraki House
                          </span>
                          <Link to={`/product/${product.slug}`} className="block group-hover:text-[#9D6C76] transition-colors duration-300 mb-2">
                            <h3 className="font-heading text-base text-[#28273F] leading-snug tracking-wide line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="font-body text-xs text-[#666666] leading-relaxed line-clamp-2 mb-4 font-light">
                            {product.short_description}
                          </p>
                        </div>

                        <div>
                          {/* Price Tag */}
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-sm font-semibold text-[#28273F]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                              <span style={{ fontSize: "12px", marginRight: "2px" }}>₹</span>
                              <span>{parseFloat(hasDiscount ? product.discount_price! : product.price).toLocaleString("en-IN")}</span>
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-[#666666]/60 line-through" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                                <span style={{ fontSize: "10px", marginRight: "1.5px" }}>₹</span>
                                <span>{parseFloat(product.price).toLocaleString("en-IN")}</span>
                              </span>
                            )}
                          </div>

                          {/* CTA button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCartId === product.id}
                            className="inline-flex items-center justify-center gap-1.5 border border-[#28273F] text-[#28273F] bg-transparent py-2 px-5 rounded-[9999px] font-body text-[9px] font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-[#28273F] hover:border-[#28273F] active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] w-full cursor-pointer disabled:opacity-50 relative overflow-visible"
                          >
                            {activeCartBombId === product.id && (
                              <span className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-4 h-4 text-[#9D6C76] pointer-events-none animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-3.5 h-3.5 text-[#E379B7] pointer-events-none animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-3.5 h-3.5 text-[#7E4C56] pointer-events-none animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-3.5 h-3.5 text-[#E6A15C] pointer-events-none animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-4 h-4 text-[#F5C767] pointer-events-none animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-3 h-3 text-[#FAF6F0] pointer-events-none animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              </span>
                            )}
                            {addingToCartId === product.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
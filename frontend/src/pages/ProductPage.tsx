import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { resolveProductImage } from "../utils/imageHelper";
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Check,
  Loader2,
  Heart,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  MapPin,
  Leaf,
  Truck,
  Droplet,
  Wind,
  Trash2,
  Recycle,
  Mail
} from "lucide-react";

interface ReviewType {
  id: number;
  rating: number;
  comment: string;
  review_date: string;
  reviewer_name: string;
}

interface ProductDetailType {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: string;
  discount_price: string | null;
  stock: number;
  brand: string;
  low_stock_threshold: number;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  images?: Array<{ path: string; is_primary: boolean }>;
}

// Curated Ingredients & Usage information for brand consistency
const RITUAL_DETAILS: Record<string, { ingredients: string; usage: string }> = {
  "nourishing-shampoo-bar": {
    ingredients: "Saponified Coconut Oil, Raw Shea Butter, Sweet Almond Oil, French Kaolin Clay, Vitamin E, Lavender & Rosemary Essential Oils.",
    usage: "Wet hair thoroughly. Rub the bar directly onto the scalp and lengths until a dense, luxurious lather forms. Massage gently to stimulate hair follicles, then rinse thoroughly with cool water."
  },
  "clarifying-charcoal-shampoo-bar": {
    ingredients: "Activated Coconut Charcoal, Tea Tree Essential Oil, Peppermint Essential Oil, Saponified Olive Oil, Aloe Vera Juice, Castor Oil.",
    usage: "Rub bar between wet hands or directly onto wet hair. Focus the active lather on the scalp, massaging for 1-2 minutes to detoxify and draw out buildup, then rinse."
  },
  "hibiscus-repair-shampoo-bar": {
    ingredients: "Saponified Coconut Oil, Organic Hibiscus Flower Extract, Kaolin Red Clay, Jojoba Oil, Hydrolyzed Wheat Protein, Geranium Essential Oil.",
    usage: "Wet hair. Gently stroke the bar from roots to tips. Work into a creamy lather, letting the reparative amino acids absorb for 1 minute before rinsing clean."
  },
  "rice-water-shampoo-bar": {
    ingredients: "Fermented Rice Water Extract, Pro-Vitamin B5, Cocoa Butter, Argan Kernel Oil, Ginger Root Oil, Grapefruit Essential Oil.",
    usage: "Work up a lather in wet hands and apply to scalp. Massage carefully into hair roots to promote nutrient absorption, then rinse. Ideal for daily or ritual washing."
  },
  "avocado-shea-shampoo-bar": {
    ingredients: "Fresh Avocado Oil, Unrefined Shea Butter, Saponified Olive Oil, Macadamia Nut Oil, Rosemary Leaf Extract, Cedarwood Essential Oil.",
    usage: "Glides smoothly onto very curly or coarse hair. Massage into wet hair, finger-detangling curls as the rich avocado lipids melt in, then rinse clean."
  },
  "anti-frizz-hair-serum": {
    ingredients: "Organic Argan Kernel Oil, Cold-Pressed Rosehip Seed Oil, Golden Jojoba Oil, Natural Vitamin E, Sandalwood & Jasmine Essential Oils.",
    usage: "Warm 2-3 drops between your palms. Apply evenly through the mid-lengths and ends of clean, damp hair. Can also be used on dry hair to smooth flyaways and add a premium satin sheen."
  },
  "hair-care-gift-kit": {
    ingredients: "Includes full size bars (Nourishing, Hibiscus Repair) and Anti-Frizz Hair Serum, wrapped in unbleached organic linen cloth.",
    usage: "Shampoo with Nourishing bar for daily maintenance or Hibiscus for deep repair. Apply 2 drops of Serum to damp ends to lock in botanical moisture."
  },
  "nourishing-body-wash": {
    ingredients: "Colloidal Oatmeal, Saponified Organic Oils, Aloe Leaf Juice, Vegetable Glycerin, Roman Chamomile Oil, Tangerine Essential Oil.",
    usage: "Squeeze a small amount onto a damp washcloth or natural sponge. Work into a gentle, creamy lather and massage over damp skin, then rinse."
  },
  "moisturizing-body-lotion": {
    ingredients: "Pure Aloe Vera Gel, Cold-Pressed Sweet Almond Oil, Calendula Extract, Organic Shea Butter, Rose Geranium Essential Oil, Vitamin E.",
    usage: "Massage generously into clean, dry skin after bathing. Focus on dry areas like elbows, knees, and heels. Reapply as desired for velvety all-day hydration."
  },
  "rich-body-butter": {
    ingredients: "Whipped Cocoa Butter, Virgin Mango Butter, Coconut Oil, Sweet Almond Oil, Organic Vanilla Bean Extract, Ylang-Ylang Essential Oil.",
    usage: "Scoop a small quantity and warm it between your hands. Massage into skin. The whipped butter will melt on contact, absorbing deep into dry patches."
  },
  "botanical-body-oil": {
    ingredients: "Cold-Pressed Jojoba Seed Oil, Sweet Almond Oil, Fractionated Coconut Oil, Lavender Essential Oil, Neroli Blossom Extract, Sunflower Seed Oil.",
    usage: "Apply to damp skin immediately post-shower to lock in vital moisture. Massage with sweeping upward strokes toward the heart to stimulate circulation."
  },
  "sugar-body-scrub": {
    ingredients: "Organic Brown Sugar Crystals, Wildflower Honey, Vanilla Pod Extract, Golden Jojoba Oil, Sweet Almond Oil, Glycerin.",
    usage: "Gently scoop a handful and massage onto wet skin in circular motions, focusing on rough zones. Rinse with warm water to reveal silky, polished skin."
  },
  "salt-body-scrub": {
    ingredients: "Fine Himalayan Pink Salt, Cold-Pressed Grapefruit Peel Oil, Rosemary Leaf Extract, Jojoba Oil, Apricot Kernel Oil.",
    usage: "Massage onto damp skin in circular motions. The minerals detoxify while pink salts polish away dead cells. Rinse off. Do not use on broken or freshly shaved skin."
  },
  "body-care-gift-kit": {
    ingredients: "Includes Nourishing Body Wash, Rich Body Butter, and Sugar Body Scrub, placed inside a wabi-sabi cedarwood tray.",
    usage: "Exfoliate twice weekly with the Sugar Scrub. Wash daily with the Nourishing wash, and lock in moisture post-bath with the Rich Body Butter."
  },
  "soy-candle": {
    ingredients: "Natural Soy Wax, Sandalwood Essential Oil, Sweet Amber Oil, Vetiver Essential Oil, Lead-Free Crackling Wood Wick, Ceramic Jar.",
    usage: "Always trim wood wick to 1/8\" before lighting. Allow the wax to melt evenly to the edges on the first burn to prevent tunneling. Burn in a draft-free space."
  },
  "reed-diffuser": {
    ingredients: "Organic Sugarcane Alcohol Base, Lemongrass Essential Oil, White Sage Essential Oil, Eucalyptus Essential Oil, Rattan Reeds.",
    usage: "Insert the natural rattan reeds into the glass vial. Flip the reeds once a week or as needed to refresh the aromatic scent dispersion."
  },
  "room-linen-mist": {
    ingredients: "Organic Lavender Hydrosol, French Lavender Essential Oil, Cedarwood Essential Oil, Bergamot Peel Oil, Witch Hazel.",
    usage: "Shake bottle well. Lightly mist pillows, bed linens, curtains, or throughout the air. Hold bottle 8-12 inches away from fabrics to refresh scent."
  },
  "wax-melts": {
    ingredients: "Natural Soy Wax, Scented Orange Blossom Oil, Cedarwood Essential Oil, Dried Jasmine Petals, Dried Orange Slices.",
    usage: "Place 1-2 wax melt cubes into the dish of your electric or tea-light wax burner. The heat will melt the wax and release a long-lasting bohemian aroma."
  },
  "ceramic-incense-holder": {
    ingredients: "Locally Sourced Natural Clay, Hand-glazed and kiln-fired, Wabi-sabi hand-pressed details.",
    usage: "Secure your favorite incense stick or cone in the designated slot. Light the tip, blow out the flame to leave a glowing ember, and let ash collect in the dish."
  },
  "essential-oil-blend": {
    ingredients: "Pure Jasmine Absolute, Ylang-Ylang Essential Oil, Sweet Orange Peel Oil, Frankincense Resin Oil.",
    usage: "Add 5-8 drops to your water mist diffuser to create an uplifting atmosphere. Or dilute with a carrier oil (like jojoba) before applying to pulse points."
  },
  "home-living-gift-kit": {
    ingredients: "Contains Sandalwood Soy Candle, Lavender Linen Mist, and Ceramic Incense Holder in a reusable drawstring cotton wrap bag.",
    usage: "Light the Soy Candle to build a base note, burn incense on the wabi-sabi Ceramic Holder, or mist bed linens to wind down for sleep."
  }
};

// Common category image assets mapping provided by user
const CATEGORY_COMMON_IMAGES: Record<string, string[]> = {
  "hair-care": [
    "/home/categories/hair_care_main.jpg",
    "/home/categories/hair_care_texture.jpg",
    "/home/categories/hair_care_ingredient.jpg",
    "/home/categories/hair_care_lifestyle.jpg"
  ],
  "body-care": [
    "/home/categories/body_care_main.jpg",
    "/home/categories/body_care_texture.jpg",
    "/home/categories/body_care_ingredient.jpg",
    "/home/categories/body_care_lifestyle.jpg"
  ],
  "home-living": [
    "/home/categories/home_living_main.jpg",
    "/home/categories/home_living_texture.jpg",
    "/home/categories/home_living_ingredient.jpg",
    "/home/categories/home_living_lifestyle.jpg"
  ]
};

// Common brand grid images used for specs splits
const CATEGORY_BRAND_IMAGES: Record<string, string> = {
  "hair-care": "/home/categories/hair_care_brand.jpg",
  "body-care": "/home/categories/body_care_brand.jpg",
  "home-living": "/home/categories/home_living_brand.jpg"
};

interface ImpactMetrics {
  waterBase: number;
  carbonBase: number;
  plasticBase: number;
  recycledPercent: number;
  waterEquivFactor: number;
  carbonEquivFactor: number;
  plasticEquivFactor: number;
  recycledEquivFactor: number;
}

const CATEGORY_IMPACT_METRICS: Record<string, ImpactMetrics> = {
  "hair-care": {
    waterBase: 2.50,
    carbonBase: 0.45,
    plasticBase: 1.20,
    recycledPercent: 75.00,
    waterEquivFactor: 2.0,
    carbonEquivFactor: 10,
    plasticEquivFactor: 200,
    recycledEquivFactor: 1.0
  },
  "body-care": {
    waterBase: 1.80,
    carbonBase: 0.35,
    plasticBase: 0.85,
    recycledPercent: 60.00,
    waterEquivFactor: 2.0,
    carbonEquivFactor: 10,
    plasticEquivFactor: 200,
    recycledEquivFactor: 1.0
  },
  "home-living": {
    waterBase: 1.50,
    carbonBase: 0.30,
    plasticBase: 0.95,
    recycledPercent: 50.00,
    waterEquivFactor: 2.0,
    carbonEquivFactor: 10,
    plasticEquivFactor: 200,
    recycledEquivFactor: 1.0
  }
};

const getImageLabel = (index: number) => {
  if (index === 0) return "Main View";
  if (index === 1) return "Usecase / Flat Lay";
  if (index === 2) return "Texture Close-up";
  if (index === 3) return "Ingredient Study";
  return "Product Detail";
};

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "materials" | "ritual">("about");
  
  // Purchase type & Gallery state
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscribe">("one-time");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<ProductDetailType[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);
  const [showHeartBomb, setShowHeartBomb] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<{ show: boolean; productName: string } | null>(null);
  const [activeCartBombId, setActiveCartBombId] = useState<number | null>(null);

  // Impact Projections State
  const [impactSets, setImpactSets] = useState(1);
  const [timeHorizon, setTimeHorizon] = useState<"per-purchase" | "one-year" | "three-years">("per-purchase");

  // Reviews States
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [avgRating, setAvgRating] = useState(0.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductAndReviews = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const prodResponse = await apiClient.get(`/products/${slug}`);
      if (prodResponse.data.success) {
        const prodData = prodResponse.data.data;
        setProduct(prodData);
        setWishlisted(!!prodData.is_wishlisted);
        setLoading(false); // Resolve page loader instantly!

        // 1. Fetch reviews in background
        setReviewsLoading(true);
        apiClient.get(`/products/${prodData.id}/reviews`)
          .then(reviewsResponse => {
            if (reviewsResponse.data.success) {
              const { average_rating, total_reviews, reviews: revs } = reviewsResponse.data.data;
              setReviews(revs || []);
              setAvgRating(average_rating || 0);
              setTotalReviews(total_reviews || 0);
            }
          })
          .catch(e => console.error("Failed to load reviews:", e))
          .finally(() => setReviewsLoading(false));

        // 2. Fetch related products in background
        if (prodData.category?.slug) {
          apiClient.get("/products", {
            params: { category: prodData.category.slug, per_page: 5 }
          })
            .then(relResponse => {
              if (relResponse.data.success) {
                const list = relResponse.data.data.data || [];
                setRelatedProducts(list.filter((p: any) => p.id !== prodData.id).slice(0, 4));
              }
            })
            .catch(e => console.error("Failed to load related products:", e));
        }

        // 3. Load wishlist states in background
        const wishIds: number[] = [];
        if (!isAuthenticated) {
          const local = localStorage.getItem("guest_wishlist");
          if (local) {
            try {
              const items = JSON.parse(local);
              items.forEach((item: any) => {
                const itemId = item.id || item.product_id || item.product?.id;
                if (itemId) wishIds.push(itemId);
              });
            } catch (e) {
              console.error(e);
            }
          }
          setWishlistedIds(wishIds);
          setWishlisted(wishIds.includes(prodData.id));
        } else {
          apiClient.get("/wishlist")
            .then(response => {
              if (response.data.success) {
                const items = response.data.data || [];
                items.forEach((item: any) => {
                  const itemId = item.product_id || item.product?.id;
                  if (itemId) wishIds.push(itemId);
                });
                setWishlistedIds(wishIds);
                setWishlisted(wishIds.includes(prodData.id));
              }
            })
            .catch(e => console.error("Failed to fetch authenticated wishlist:", e));
        }
      }
    } catch (error) {
      console.error("Failed to load product details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
    setQuantity(1);
    setActiveImageIndex(0);
    setReviewSuccess(false);
    setReviewError(null);
    setNewTitle("");
    setNewComment("");
  }, [slug, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    setActiveCartBombId(product.id);
    setTimeout(() => setActiveCartBombId(null), 600);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
  };

  const handleBuyItNow = async () => {
    if (!product) return;
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setIsCartOpen(false); // Keep cart drawer closed when heading to checkout
    setAddingToCart(false);
    navigate("/checkout");
  };

  const toggleWishlist = async (productId: number, productObj?: any) => {
    const isCurrentlyWishlisted = wishlistedIds.includes(productId) || (productId === product?.id && wishlisted);

    // 1. Update React state OPTIMISTICALLY (instantly fills heart)
    setWishlistedIds(prev => {
      if (isCurrentlyWishlisted) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    if (productId === product?.id) {
      const nextState = !wishlisted;
      setWishlisted(nextState);
      if (nextState) {
        setShowHeartBomb(true);
        setTimeout(() => setShowHeartBomb(false), 600);
      }
    }

    if (!isCurrentlyWishlisted) {
      const name = productObj?.name || product?.name || "Product";
      setWishlistToast({ show: true, productName: name });
      setTimeout(() => {
        setWishlistToast(null);
      }, 4000);
    }

    // 2. Perform backend operations in background
    if (!isAuthenticated) {
      const local = localStorage.getItem("guest_wishlist");
      let items: any[] = [];
      if (local) {
        try {
          items = JSON.parse(local);
        } catch (e) {
          items = [];
        }
      }

      if (isCurrentlyWishlisted) {
        items = items.filter((item: any) => {
          const itemId = item.id || item.product_id || item.product?.id;
          return itemId !== productId;
        });
      } else {
        const newItem = productObj || product;
        if (newItem) {
          items.push(newItem);
        }
      }
      localStorage.setItem("guest_wishlist", JSON.stringify(items));
    } else {
      if (isCurrentlyWishlisted) {
        apiClient.delete(`/wishlist/${productId}`).catch((e) => {
          console.error("Failed to remove from wishlist:", e);
          // Rollback on error
          setWishlistedIds(prev => [...prev, productId]);
          if (productId === product?.id) setWishlisted(true);
        });
      } else {
        apiClient.post("/wishlist", { product_id: productId }).catch((e) => {
          console.error("Failed to add to wishlist:", e);
          // Rollback on error
          setWishlistedIds(prev => prev.filter(id => id !== productId));
          if (productId === product?.id) setWishlisted(false);
        });
      }
    }
  };

  const handleWishlistClick = () => {
    if (!product) return;
    toggleWishlist(product.id);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!isAuthenticated) {
      setReviewError("Please Sign In to submit a review.");
      return;
    }

    setReviewError(null);
    setSubmittingReview(true);

    try {
      const response = await apiClient.post("/reviews", {
        product_id: product.id,
        rating: newRating,
        title: newTitle || undefined,
        comment: newComment || undefined,
      });

      if (response.data.success) {
        setReviewSuccess(true);
        setNewComment("");
        setNewTitle("");
        // Reload reviews list
        const reviewsResponse = await apiClient.get(`/products/${product.id}/reviews`);
        if (reviewsResponse.data.success) {
          const { average_rating, total_reviews, reviews: revs } = reviewsResponse.data.data;
          setReviews(revs || []);
          setAvgRating(average_rating || 0);
          setTotalReviews(total_reviews || 0);
        }
      }
    } catch (err: any) {
      setReviewError(
        err.response?.data?.message ||
        "Review submission failed. You can only review products you have purchased and received."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-[#FAF8F5]">
        <h2 className="text-xl font-heading text-[#28273F] mb-4">Product Not Found</h2>
        <Link to="/collections" className="text-[#9D6C76] font-body text-sm font-semibold hover:underline">
          Browse Collections
        </Link>
      </div>
    );
  }

  const prodMeta = RITUAL_DETAILS[product.slug] || {
    ingredients: "Pure botanical extracts, essential oils, and organic base agents.",
    usage: "Incorporate gently into your daily cleansing routine. Massage onto skin or hair, then rinse clean with warm water."
  };

  const hasDiscount = !!product.discount_price;
  const primaryImage = resolveProductImage(product.images?.find((img) => img.is_primary)?.path || product.images?.[0]?.path);
  const categorySlug = product.category?.slug || "hair-care";
  const commonImages = CATEGORY_COMMON_IMAGES[categorySlug] || [];
  
  // Combine primary product image with common gallery images
  const galleryImages = [primaryImage, ...commonImages];
  
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const isLowStock = product.stock <= product.low_stock_threshold && product.stock > 0;

  // Dynamic Impact Projections Calculations
  const impactCategorySlug = product.category?.slug || "home-living";
  const impactMetrics = CATEGORY_IMPACT_METRICS[impactCategorySlug] || CATEGORY_IMPACT_METRICS["home-living"];
  const horizonMultiplier = timeHorizon === "one-year" ? 4 : timeHorizon === "three-years" ? 12 : 1;
  const totalImpactSets = impactSets * horizonMultiplier;

  const waterSavedVal = (impactMetrics.waterBase * totalImpactSets).toFixed(2);
  const waterBuckets = Math.round(impactMetrics.waterBase * totalImpactSets * impactMetrics.waterEquivFactor);

  const carbonAvoidedVal = (impactMetrics.carbonBase * totalImpactSets).toFixed(2);
  const carbonTrees = Math.round(impactMetrics.carbonBase * totalImpactSets * impactMetrics.carbonEquivFactor);

  const plasticPreventedVal = (impactMetrics.plasticBase * totalImpactSets).toFixed(2);
  const plasticBags = Math.round(impactMetrics.plasticBase * totalImpactSets * impactMetrics.plasticEquivFactor);

  const recycledPercentVal = (impactMetrics.recycledPercent).toFixed(2);
  const recycledBottles = Math.round(impactMetrics.recycledPercent * totalImpactSets * impactMetrics.recycledEquivFactor);

  return (
    <div className="w-full bg-[#FAF8F5] pb-24 select-none cursor-heart">
      {/* 1. Breadcrumb Navigation */}
      <div className="container-custom max-w-7xl mx-auto px-6 py-6 text-xs font-body tracking-wider text-[#666666]/65 flex gap-2">
        <Link to="/" className="hover:text-[#9D6C76] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/collections" className="hover:text-[#9D6C76] transition-colors">Collections</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/collections/${product.category.slug}`} className="hover:text-[#9D6C76] transition-colors capitalize">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#28273F] font-semibold">{product.name}</span>
      </div>

      {/* 2. Main Product Layout (Gallery Left, Details Right) */}
      <div className="container-custom max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
        
        {/* LEFT COLUMN: Main Active View & Horizontal Gallery Below (Spans 6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between select-none h-full">
          
          {/* Large Active Image Box */}
          <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-white border border-[#28273F]/5 shadow-[0_8px_30px_rgba(40,39,63,0.015)] group cursor-heart">
            <img
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] hover:scale-105 cursor-heart !w-full !h-full !max-w-none !max-h-none"
            />
            
            {/* Sunshine Bomb Bursting Over Main Image on Hover */}
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

            {/* Left/Right Navigation Arrows overlay */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#28273F] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-heart"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 cursor-heart" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#28273F] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-heart"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 cursor-heart" />
            </button>

            {/* Heart Wishlist Overlay Badge Container */}
            <div className="absolute top-4 right-4 z-30 w-10 h-10">
              <button 
                onClick={handleWishlistClick}
                className="w-full h-full rounded-full bg-white/95 text-[#28273F] hover:text-[#9D6C76] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 cursor-heart"
              >
                <Heart 
                  className="w-5 h-5 cursor-heart transition-all duration-300"
                  fill={wishlisted ? "#9D6C76" : "transparent"}
                  stroke={wishlisted ? "#28273F" : "currentColor"}
                  strokeWidth={wishlisted ? "2.5" : "2"}
                />
              </button>

              {/* Love Heart Bomb Bursting on click */}
              {showHeartBomb && (
                <>
                  {/* 1. Rose Heart */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#9D6C76] pointer-events-none animate-[popLove1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* 2. Soft Pink Heart */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#E379B7] pointer-events-none animate-[popLove2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* 3. Clay Heart */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#A9787C] pointer-events-none animate-[popLove3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* 4. White Cream Heart */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#FAF6F0] pointer-events-none animate-[popLove4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* 5. Terracotta Heart */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-[#9D6C76] pointer-events-none animate-[popLove5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* 6. Soft Pink Heart */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-1/2 w-4 h-4 text-[#E379B7] pointer-events-none animate-[popLove6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] z-20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </>
              )}
            </div>
          </div>

          {/* Horizontal Thumbnail strip underneath */}
          <div className="flex flex-row gap-3 items-center h-20 mt-6 cursor-heart">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`aspect-square w-16 md:w-20 rounded-[12px] overflow-hidden bg-white border-2 border-solid transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-heart ${
                  activeImageIndex === index
                    ? "border-[#9D6C76] shadow-[0_4px_12px_rgba(157,108,118,0.15)] scale-[1.03]"
                    : "border-[#28273F]/5 hover:border-[#28273F]/20"
                }`}
              >
                <img src={img} alt={`${product.name} thumb ${index}`} className="w-full h-full object-cover cursor-heart !w-full !h-full !max-w-none !max-h-none" />
              </button>
            ))}
          </div>
        </div>

      {/* RIGHT COLUMN: Product details and checkout (Spans 6 cols) */}
      <div className="lg:col-span-6 flex flex-col justify-between animate-fade-up h-full">
        <div className="flex flex-col justify-start">
          {/* Breadcrumb path label */}
          <span className="text-[10px] tracking-widest uppercase text-[#9D6C76] font-semibold font-body mb-2">
            {product.category?.name || "Formulation"} • {product.brand}
          </span>

          {/* Product Name */}
          <h1 className="font-heading text-3xl md:text-4xl text-[#28273F] tracking-wide mb-3 leading-tight font-light font-heading">
            {product.name}
          </h1>

          {/* Stars & Reviews Summary */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(avgRating) ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#E2E8F0] fill-[#E2E8F0]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-body text-[#666666]/70 uppercase tracking-widest font-semibold mt-0.5">
              {avgRating.toFixed(1)} ({totalReviews} Reviews)
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-center gap-4 mb-4">
            <span className="font-body text-3xl font-bold text-[#28273F]">
              ₹{(parseFloat(hasDiscount ? product.discount_price! : product.price) * quantity).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="font-body text-lg text-[#666666]/55 line-through">
                  ₹{(parseFloat(product.price) * quantity).toLocaleString("en-IN")}
                </span>
                <span className="bg-[#9D6C76]/10 text-[#9D6C76] text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-[6px]">
                  {Math.round(((parseFloat(product.price) - parseFloat(product.discount_price!)) / parseFloat(product.price)) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          <p className="font-body text-sm text-[#666666] leading-relaxed tracking-wide font-light mb-5">
            {product.short_description || product.description}
          </p>

            {/* Photo Type Explorer (Instead of variants) */}
            <div className="mb-4 border-t border-[#28273F]/5 pt-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#28273F] font-body mb-2">
                VIEWING DETAIL: <span className="text-[#9D6C76] font-semibold">{getImageLabel(activeImageIndex)}</span>
              </label>
              <div className="flex flex-wrap gap-4 items-center">
                {galleryImages.map((img, index) => {
                  const label = getImageLabel(index);
                  const isActive = activeImageIndex === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className="flex items-center gap-2 group cursor-heart"
                    >
                      <div className={`w-8 h-8 rounded-full overflow-hidden border-2 border-solid transition-all duration-300 aspect-square cursor-heart ${
                        isActive ? "border-[#9D6C76] scale-110 shadow-xs" : "border-[#28273F]/10 group-hover:border-[#9D6C76]"
                      }`}>
                        <img src={img} className="w-full h-full object-cover cursor-heart" alt="" />
                      </div>
                      <span className={`text-[11px] font-body tracking-wider transition-colors cursor-heart ${
                        isActive ? "text-[#9D6C76] font-bold" : "text-[#28273F]/70 group-hover:text-[#9D6C76]"
                      }`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purchase Options Toggle (One-time vs Subscribe) */}
            <div className="mb-4 border-t border-[#28273F]/5 pt-4">
              <div 
                className="flex items-center p-1.5 bg-[#28273F]/5 rounded-[9999px] w-full max-w-[320px]"
                style={{ border: '1px solid rgba(40, 39, 63, 0.15)' }}
              >
                <button
                  type="button"
                  onClick={() => setPurchaseType("one-time")}
                  className={`flex-1 py-3.5 rounded-[9999px] text-center font-body transition-all duration-300 active:scale-95 cursor-heart ${
                    purchaseType === "one-time"
                      ? "bg-[#28273F] text-white font-bold shadow-sm"
                      : "bg-transparent text-[#28273F]/70 font-semibold hover:text-[#28273F]"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest font-heading cursor-heart">One-Time</div>
                  <div className="text-xs mt-0.5 font-bold cursor-heart">
                    ₹{(parseFloat(product.price) * quantity).toLocaleString("en-IN")}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseType("subscribe")}
                  className={`flex-1 py-3.5 rounded-[9999px] text-center font-body transition-all duration-300 active:scale-95 cursor-heart ${
                    purchaseType === "subscribe"
                      ? "bg-[#28273F] text-white font-bold shadow-sm"
                      : "bg-transparent text-[#28273F]/70 font-semibold hover:text-[#28273F]"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest font-heading cursor-heart">Subscribe</div>
                  <div className="text-xs mt-0.5 font-bold cursor-heart">
                    ₹{(parseFloat(product.price) * 0.9 * quantity).toLocaleString("en-IN")}
                  </div>
                </button>
              </div>
            </div>

          {/* Inventory Alert Status */}
          <div className="mb-4 flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] font-body text-[#666666] tracking-wider uppercase font-semibold">
                  {isLowStock ? `Only ${product.stock} left!` : "In Stock - Prepared Fresh"}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-[10px] font-body text-[#EF4444] tracking-wider uppercase font-bold">
                  Out of Stock
                </span>
              </>
            )}
          </div>

          {/* Checkout controls wrapper (Compact max-w aligned column) */}
          {product.stock > 0 && (
            <div className="w-full max-w-[320px] flex flex-col gap-3">
              <div className="flex flex-row items-center gap-3">
                {/* Quantity Counter */}
                <div className="flex items-center justify-between border-2 border-solid border-[#28273F]/20 rounded-[9999px] px-3.5 py-2.5 bg-white select-none shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 hover:text-[#9D6C76] transition-colors cursor-heart"
                  >
                    <Minus className="w-3 h-3 cursor-heart" />
                  </button>
                  <span className="w-8 text-center font-body text-xs font-semibold text-[#28273F]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-1 hover:text-[#9D6C76] transition-colors cursor-heart"
                  >
                    <Plus className="w-3 h-3 cursor-heart" />
                  </button>
                </div>
  
                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || purchaseType === "subscribe"}
                  className="flex-grow inline-flex items-center justify-center gap-2 text-[#28273F] bg-transparent py-4 px-4 rounded-[9999px] font-body text-[10px] font-bold tracking-widest uppercase hover:bg-[#28273F] hover:text-white active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-heart disabled:opacity-50 disabled:cursor-not-allowed relative overflow-visible"
                  style={{ border: '1px solid #28273F' }}
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
                  {purchaseType === "subscribe" ? (
                    "Coming Soon ▸"
                  ) : addingToCart ? (
                    "Adding... ▸"
                  ) : (
                    "Add to Bag ▸"
                  )}
                </button>
              </div>

              {/* Buy Now button */}
              {purchaseType === "one-time" ? (
                <button
                  onClick={handleBuyItNow}
                  className="w-full text-center text-[#28273F] bg-transparent py-4 rounded-[9999px] font-body text-[10px] font-bold tracking-widest uppercase hover:bg-[#28273F] hover:text-white active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-heart mb-5"
                  style={{ border: '1px solid #28273F' }}
                >
                  Buy It Now ▸
                </button>
              ) : (
                <button
                  disabled
                  className="w-full text-center text-[#28273F] bg-transparent py-4 rounded-[9999px] font-body text-[10px] font-bold tracking-widest uppercase cursor-not-allowed mb-5 disabled:opacity-50"
                  style={{ border: '1px solid #28273F' }}
                >
                  Coming Soon ▸
                </button>
              )}
            </div>
          )}
        </div>

        {/* Delivery, Exchange, Take-Back Specifications Grid */}
        <div className="border-t border-[#28273F]/10 pt-6 grid grid-cols-3 gap-3 text-center mt-6 select-none h-20 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <Truck className="w-5 h-5 text-[#28273F]/75" />
            <span className="font-body text-[10px] font-bold text-[#28273F] uppercase tracking-wider">Delivery</span>
            <span className="font-body text-[9px] text-[#666666]/70 uppercase tracking-widest font-light">3-7 Days</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x border-[#28273F]/10 px-2">
            <ShieldCheck className="w-5 h-5 text-[#28273F]/75" />
            <span className="font-body text-[10px] font-bold text-[#28273F] uppercase tracking-wider">Exchange</span>
            <span className="font-body text-[9px] text-[#666666]/70 uppercase tracking-widest font-light">No Exchange</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RefreshCw className="w-5 h-5 text-[#28273F]/75" />
            <span className="font-body text-[10px] font-bold text-[#28273F] uppercase tracking-wider">Take-Back</span>
            <span className="font-body text-[9px] text-[#666666]/70 uppercase tracking-widest font-light">Not Available</span>
          </div>
        </div>
      </div>
    </div>

    {/* 3. Your Impact Projections Section */}
    <div className="border-t border-[#28273F]/10 pt-16 mt-16 pb-12 w-full bg-[#FAF8F5]">
      <div className="container-custom max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Header Badge */}
        <div className="flex justify-center mb-6 select-none">
          <span 
            className="font-body font-bold tracking-widest text-[#28273F]/65 uppercase text-[9px]"
            style={{
              display: 'inline-flex',
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(40, 39, 63, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              boxShadow: '0 2px 10px rgba(40, 39, 63, 0.02)'
            }}
          >
            <span>Impact Projections</span>
            <span className="mx-2 opacity-40">•</span>
            <span>Powered by Meraki House</span>
          </span>
        </div>

        {/* Section Title & Subtitle */}
        <h3 className="font-heading text-3xl md:text-4xl text-center text-[#28273F] font-light tracking-wide mb-3 leading-tight">
          Your impact with this <span className="text-[#9D6C76] font-semibold">purchase.</span>
        </h3>
        <p className="text-center font-body text-[10px] text-[#666666]/70 uppercase tracking-widest font-bold mb-8">
          Every projection is driven by seller details and backed by verified benchmarks.
        </p>

        {/* Sets Calculator Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-[20px] px-8 py-5 border border-[#28273F]/10 shadow-[0_8px_30px_rgba(40,39,63,0.015)] max-w-[620px] w-full select-none gap-4 mb-6">
          <span className="font-body text-sm font-semibold text-[#28273F] text-center sm:text-left tracking-wide">
            How many <span className="text-[#9D6C76] font-semibold">sets</span> would you love to have ?
          </span>
          <div className="flex items-center gap-2 bg-[#28273F]/5 p-1 select-none" style={{ borderRadius: '9999px' }}>
            <button
              type="button"
              onClick={() => setImpactSets((s) => Math.max(1, s - 1))}
              className="hover:scale-105 active:scale-95 transition-all duration-200 cursor-heart"
              style={{
                backgroundColor: '#ffffff',
                border: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                boxShadow: '0 2px 6px rgba(40, 39, 63, 0.06)'
              }}
            >
              <Minus className="w-3.5 h-3.5 cursor-heart text-[#28273F]" />
            </button>
            <span className="font-body font-bold text-sm text-[#28273F] w-8 text-center">
              {impactSets}
            </span>
            <button
              type="button"
              onClick={() => setImpactSets((s) => s + 1)}
              className="hover:scale-105 active:scale-95 transition-all duration-200 cursor-heart"
              style={{
                backgroundColor: '#ffffff',
                border: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                boxShadow: '0 2px 6px rgba(40, 39, 63, 0.06)'
              }}
            >
              <Plus className="w-3.5 h-3.5 cursor-heart text-[#28273F]" />
            </button>
          </div>
        </div>

        {/* Time Horizon Toggles Capsule */}
        <div className="flex flex-wrap justify-center gap-3 select-none mb-12">
          <button
            type="button"
            onClick={() => setTimeHorizon("per-purchase")}
            className="hover:scale-103 active:scale-97 transition-all duration-200 cursor-heart"
            style={
              timeHorizon === "per-purchase"
                ? {
                    backgroundColor: '#28273F',
                    border: '1px solid #28273F',
                    color: '#ffffff',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(40, 39, 63, 0.15)'
                  }
                : {
                    backgroundColor: 'transparent',
                    border: '1px solid #28273F',
                    color: '#28273F',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.65
                  }
            }
          >
            Per purchase ({impactSets} {impactSets === 1 ? 'set' : 'sets'})
          </button>
          <button
            type="button"
            onClick={() => setTimeHorizon("one-year")}
            className="hover:scale-103 active:scale-97 transition-all duration-200 cursor-heart"
            style={
              timeHorizon === "one-year"
                ? {
                    backgroundColor: '#28273F',
                    border: '1px solid #28273F',
                    color: '#ffffff',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(40, 39, 63, 0.15)'
                  }
                : {
                    backgroundColor: 'transparent',
                    border: '1px solid #28273F',
                    color: '#28273F',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.65
                  }
            }
          >
            Over 1 year ({impactSets * 4} {impactSets * 4 === 1 ? 'set' : 'sets'})
          </button>
          <button
            type="button"
            onClick={() => setTimeHorizon("three-years")}
            className="hover:scale-103 active:scale-97 transition-all duration-200 cursor-heart"
            style={
              timeHorizon === "three-years"
                ? {
                    backgroundColor: '#28273F',
                    border: '1px solid #28273F',
                    color: '#ffffff',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(40, 39, 63, 0.15)'
                  }
                : {
                    backgroundColor: 'transparent',
                    border: '1px solid #28273F',
                    color: '#28273F',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.65
                  }
            }
          >
            Over 3 years ({impactSets * 12} {impactSets * 12 === 1 ? 'set' : 'sets'})
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Card 1: Water Saved */}
          <div className="bg-[#EAF2F0] rounded-[24px] p-6 flex flex-col justify-between min-h-[220px] shadow-[0_8px_30px_rgba(40,39,63,0.01)] border border-white/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(40,39,63,0.03)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-[9px] font-bold uppercase tracking-widest text-[#28273F]/75">Water Saved</span>
                <Droplet className="w-4 h-4 text-[#9D6C76]/70 cursor-heart" />
              </div>
              <div>
                <span className="font-heading text-4xl font-light text-[#28273F] tracking-tight">{waterSavedVal}</span>
                <span className="font-body text-xs font-semibold text-[#28273F]/70 ml-1">liters</span>
              </div>
              <p className="font-body text-[11px] text-[#28273F]/80 font-light leading-relaxed mt-1">
                Water saved during production compared to industry standard benchmarks.
              </p>
            </div>
            <div 
              className="text-[#28273F] font-body font-bold tracking-wide mt-4 self-start"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(40, 39, 63, 0.08)',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>-</span>
              <span>Enough water to fill {waterBuckets} small {waterBuckets === 1 ? 'bucket' : 'buckets'}</span>
            </div>
          </div>

          {/* Card 2: Carbon Avoided */}
          <div className="bg-[#EBF1FA] rounded-[24px] p-6 flex flex-col justify-between min-h-[220px] shadow-[0_8px_30px_rgba(40,39,63,0.01)] border border-white/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(40,39,63,0.03)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-[9px] font-bold uppercase tracking-widest text-[#28273F]/75">Carbon Avoided</span>
                <Wind className="w-4 h-4 text-[#9D6C76]/70 cursor-heart" />
              </div>
              <div>
                <span className="font-heading text-4xl font-light text-[#28273F] tracking-tight">{carbonAvoidedVal}</span>
                <span className="font-body text-xs font-semibold text-[#28273F]/70 ml-1">kg CO₂</span>
              </div>
              <p className="font-body text-[11px] text-[#28273F]/80 font-light leading-relaxed mt-1">
                Carbon emissions avoided during manufacture and logistics.
              </p>
            </div>
            <div 
              className="text-[#28273F] font-body font-bold tracking-wide mt-4 self-start"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(40, 39, 63, 0.08)',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>-</span>
              <span>Equivalent to planting {carbonTrees} small {carbonTrees === 1 ? 'tree' : 'trees'}</span>
            </div>
          </div>

          {/* Card 3: Plastic Waste Prevented */}
          <div className="bg-[#FCF2E8] rounded-[24px] p-6 flex flex-col justify-between min-h-[220px] shadow-[0_8px_30px_rgba(40,39,63,0.01)] border border-white/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(40,39,63,0.03)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-[9px] font-bold uppercase tracking-widest text-[#28273F]/75">Plastic Prevented</span>
                <Trash2 className="w-4 h-4 text-[#9D6C76]/70 cursor-heart" />
              </div>
              <div>
                <span className="font-heading text-4xl font-light text-[#28273F] tracking-tight">{plasticPreventedVal}</span>
                <span className="font-body text-xs font-semibold text-[#28273F]/70 ml-1">kg</span>
              </div>
              <p className="font-body text-[11px] text-[#28273F]/80 font-light leading-relaxed mt-1">
                Plastic waste prevented due to custom 100% plastic-free packaging.
              </p>
            </div>
            <div 
              className="text-[#28273F] font-body font-bold tracking-wide mt-4 self-start"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(40, 39, 63, 0.08)',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>-</span>
              <span>Enough plastic to fill {plasticBags} plastic {plasticBags === 1 ? 'bag' : 'bags'}</span>
            </div>
          </div>

          {/* Card 4: Recycled Content */}
          <div className="bg-[#EAF5F5] rounded-[24px] p-6 flex flex-col justify-between min-h-[220px] shadow-[0_8px_30px_rgba(40,39,63,0.01)] border border-white/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(40,39,63,0.03)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-[9px] font-bold uppercase tracking-widest text-[#28273F]/75">Recycled Content</span>
                <Recycle className="w-4 h-4 text-[#9D6C76]/70 cursor-heart" />
              </div>
              <div>
                <span className="font-heading text-4xl font-light text-[#28273F] tracking-tight">{recycledPercentVal}</span>
                <span className="font-body text-xs font-semibold text-[#28273F]/70 ml-1">%</span>
              </div>
              <p className="font-body text-[11px] text-[#28273F]/80 font-light leading-relaxed mt-1">
                Recycled material and post-consumer waste used in this kit.
              </p>
            </div>
            <div 
              className="text-[#28273F] font-body font-bold tracking-wide mt-4 self-start"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(40, 39, 63, 0.08)',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>-</span>
              <span>Equivalent to recycling {recycledBottles} old plastic {recycledBottles === 1 ? 'bottle' : 'bottles'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 4. More From Brand Section */}
    {relatedProducts.length > 0 && (
      <div className="bg-white py-20 w-full border-t border-[#28273F]/10">
        <div className="container-custom max-w-7xl mx-auto px-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 select-none">
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span className="text-[10px] tracking-widest uppercase text-[#9D6C76] font-bold font-body mb-2 block">
                FROM THE SAME CATEGORY
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-[#28273F] font-light tracking-wide mb-3 leading-tight">
                More from <span className="text-[#9D6C76] font-semibold">{product.category?.name || 'this category'}</span>
              </h2>
              <p 
                className="font-body text-xs text-[#666666]/70 font-light leading-relaxed"
                style={{ maxWidth: '450px', width: '100%', display: 'block' }}
              >
                Discover more premium, sustainable creations from our {product.category?.name?.toLowerCase() || 'organic care'} collection.
              </p>
            </div>
            <Link 
              to={`/collections/${product.category?.slug || ''}`}
              className="font-body text-xs font-semibold text-[#28273F] hover:text-[#9D6C76] flex items-center gap-1.5 transition-colors group cursor-heart"
            >
              <span>View category store</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {relatedProducts.map((p) => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/product/${p.slug}`)}
                className="group flex flex-col justify-between h-full bg-white rounded-[24px] p-4 border border-[#28273F]/5 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(40,39,63,0.03)] cursor-heart select-none"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-white border border-[#28273F]/5 select-none mb-4 cursor-heart">
                    {/* Wishlist Overlay */}
                    <div className="absolute top-3 right-3 z-10 w-8 h-8">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id, p);
                        }}
                        className="w-full h-full rounded-full bg-white text-[#28273F] hover:text-[#9D6C76] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-heart"
                        style={{ border: 'none', padding: 0 }}
                      >
                        <Heart 
                          className="w-3.5 h-3.5 cursor-heart" 
                          fill={wishlistedIds.includes(p.id) ? "#9D6C76" : "none"}
                          stroke={wishlistedIds.includes(p.id) ? "#28273F" : "currentColor"}
                          strokeWidth={wishlistedIds.includes(p.id) ? "2.5" : "1.5"}
                        />
                      </button>
                    </div>
                    {/* Main Image */}
                    <img 
                      src={resolveProductImage(p.images?.find((img) => img.is_primary)?.path || p.images?.[0]?.path)} 
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-105 cursor-heart"
                    />
                  </div>

                  {/* Stars Rating */}
                  <div className="flex items-center gap-1 mb-1.5 select-none">
                    <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="font-body text-[10px] font-bold text-[#28273F]">0.0</span>
                  </div>

                  {/* Product Title */}
                  <h4 className="font-heading text-sm text-[#28273F] font-semibold tracking-wide mb-1 leading-snug line-clamp-1">
                    {p.name}
                  </h4>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-body font-bold text-xs text-[#28273F]">
                      ₹{p.discount_price ? p.discount_price : p.price}
                    </span>
                    {p.discount_price && (
                      <span className="font-body text-[10px] text-[#666666]/65 line-through">₹{p.price}</span>
                    )}
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCartBombId(p.id);
                    setTimeout(() => setActiveCartBombId(null), 600);
                    addToCart(p.id, 1);
                  }}
                  className="w-full text-center cursor-heart relative overflow-visible"
                  style={{
                    backgroundColor: 'rgba(157, 108, 118, 0.08)',
                    border: 'none',
                    color: '#9D6C76',
                    padding: '10px 0',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#28273F';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(157, 108, 118, 0.08)';
                    e.currentTarget.style.color = '#9D6C76';
                  }}
                >
                  {activeCartBombId === p.id && (
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
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    {/* 5. Wishlist Toast Notification */}
    <div 
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3.5 bg-white border border-[#28273F]/10 rounded-[20px] p-5 shadow-[0_16px_45px_rgba(40,39,63,0.1)] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${
        wishlistToast?.show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0 pointer-events-none'
      }`}
      style={{ width: '340px', maxWidth: '90vw' }}
    >
      {/* Absolute Close Button */}
      <button 
        type="button"
        onClick={() => setWishlistToast(null)} 
        className="absolute top-3.5 right-3.5 text-[#28273F]/35 hover:text-[#28273F] transition-colors cursor-heart text-xs"
        style={{ border: 'none', background: 'transparent' }}
      >
        ✕
      </button>

      {/* Top Section: Horizontal text */}
      <div className="w-full text-center pr-4">
        <p className="font-body text-xs text-[#28273F] font-semibold leading-relaxed">
          "{wishlistToast?.productName || 'Product'}" has been added to your wishlist.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#28273F]/5" />

      {/* Bottom Section: Centered Letter icon & actions */}
      <div className="flex items-center justify-center gap-3 w-full">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#9D6C76]/8 border border-[#9D6C76]/10 flex-shrink-0">
          <Mail className="w-4 h-4 text-[#9D6C76]" strokeWidth={1.5} />
        </div>
        <Link 
          to="/wishlist" 
          className="font-body text-[9px] font-bold text-[#9D6C76] hover:text-[#28273F] uppercase tracking-widest border-b border-[#9D6C76] pb-0.5 transition-colors cursor-heart whitespace-nowrap"
        >
          Go to your wishlist
        </Link>
      </div>
    </div>
  </div>
);
};

export default ProductPage;
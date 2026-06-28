import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import apiClient from "../api/apiClient";
import { Heart, Trash2, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { resolveProductImage } from "../utils/imageHelper";

interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  discount_price: string | null;
  short_description: string | null;
  images?: Array<{ path: string; is_primary: boolean }>;
}

export const WishlistPage = () => {
  const { isAuthenticated, user } = useAuth();
  const displayName = isAuthenticated && user?.name 
    ? user.name 
    : "Dear Customer";
  const { addToCart } = useCart();
  
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [activeCartBombId, setActiveCartBombId] = useState<number | null>(null);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      // Local storage guest wishlist
      const local = localStorage.getItem("guest_wishlist");
      if (local) {
        try {
          setWishlistItems(JSON.parse(local));
        } catch (e) {
          localStorage.removeItem("guest_wishlist");
        }
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get("/wishlist");
      if (response.data.success) {
        setWishlistItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId: number) => {
    setActionId(productId);
    if (!isAuthenticated) {
      const updated = wishlistItems.filter((item) => item.product_id !== productId && item.id !== productId);
      setWishlistItems(updated);
      localStorage.setItem("guest_wishlist", JSON.stringify(updated));
      setActionId(null);
      return;
    }

    try {
      const response = await apiClient.delete(`/wishlist/${productId}`);
      if (response.data.success) {
        setWishlistItems(wishlistItems.filter((item) => item.product_id !== productId));
      }
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
    } finally {
      setActionId(null);
    }
  };

  const handleMoveToCart = async (product: WishlistProduct) => {
    setActionId(product.id);
    setActiveCartBombId(product.id);
    setTimeout(() => setActiveCartBombId(null), 600);
    // Add to cart
    const result = await addToCart(product.id, 1);
    if (result.success) {
      // Remove from wishlist
      await handleRemove(product.id);
    }
    setActionId(null);
  };

  return (
    <div className="w-full bg-[#FAF8F5] pb-24 min-h-[80vh] select-none">
      {/* Page Header Banner */}
      <div className="w-full mb-10">
        <div 
          className="relative w-full h-[120px] md:h-[150px] overflow-hidden flex flex-col justify-center items-center text-center px-6 shadow-xs select-none animate-fade-in border-b border-[#28273F]/5"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.2)), url('/assets/wishlist_banner.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 60%',
          }}
        >
          <div className="relative z-10 w-full text-center px-4">
            <h1 className="font-body text-sm md:text-lg text-[#28273F] tracking-[0.35em] uppercase font-light leading-none whitespace-nowrap">
              Welcome, {displayName}
            </h1>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/5 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Lookbook Intro Description */}
      <p 
        className="font-body text-xs text-[#28273F] text-center mb-10 leading-relaxed font-medium px-4 animate-fade-in"
        style={{ display: 'block', width: '100%', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}
      >
        Welcome to your wishlist curation. Here lie your self-care rituals, organic beauty bars, and hand-poured accents.
      </p>

      <div className="container-custom max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white border border-[#28273F]/5 rounded-[24px] p-12 text-center shadow-[0_8px_30px_rgba(40,39,63,0.01)] max-w-xl mx-auto animate-fade-in">
            <Heart className="w-12 h-12 text-[#28273F]/15 mx-auto mb-4" />
            <h2 className="font-heading text-lg text-[#28273F] mb-2">Your wishlist is empty</h2>
            <p className="font-body text-xs text-[#666666] leading-relaxed mb-6 font-light">
              Formulate your self-care rituals by adding your favorite bars, scrubs, and candles to this list.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center gap-2 bg-[#28273F] text-white py-3 px-6 rounded-[9999px] font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all duration-300 shadow-button hover:shadow-hover cursor-pointer"
            >
              Browse Collections
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product: WishlistProduct = item.product || item;
              if (!product) return null;
              
              const primaryImg = resolveProductImage(product.images?.find((img) => img.is_primary)?.path || product.images?.[0]?.path);
              const hasDiscount = !!product.discount_price;

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-[#28273F]/5 rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(40,39,63,0.01)] hover:shadow-[0_12px_45px_rgba(40,39,63,0.03)] hover:translate-y-[-4px] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] flex flex-col h-full relative animate-fade-up"
                >
                  {/* Remove absolute button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={actionId === product.id}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-[#EF4444] hover:text-white p-2 rounded-full backdrop-blur-md shadow-sm z-10 transition-colors duration-300 cursor-pointer text-[#28273F]/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>

                  {/* Image Frame */}
                  <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0] block">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.3,0,0,1)]"
                      loading="lazy"
                    />
                  </Link>

                  {/* Body details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] tracking-widest uppercase text-[#9D6C76]/70 font-semibold font-body block mb-1">
                        Meraki House
                      </span>
                      <Link to={`/product/${product.slug}`} className="block group-hover:text-[#9D6C76] transition-colors duration-300 mb-2">
                        <h3 className="font-heading text-sm text-[#28273F] leading-snug tracking-wide line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-body text-[11px] text-[#666666] leading-relaxed line-clamp-2 mb-4 font-light">
                        {product.short_description}
                      </p>
                    </div>

                    <div>
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="font-body text-xs font-semibold text-[#28273F]">
                          ₹{parseFloat(hasDiscount ? product.discount_price! : product.price).toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <span className="font-body text-[10px] text-[#666666]/60 line-through">
                            ₹{parseFloat(product.price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Move to Cart CTA */}
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={actionId === product.id}
                        className="w-full bg-[#28273F] text-white py-2.5 px-4 rounded-[9999px] font-body text-[9px] font-semibold tracking-widest uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] shadow-button hover:shadow-hover flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 relative overflow-visible"
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
                        {actionId === product.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Moving...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            Move to Cart
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
      </div>
    </div>
  );
};

export default WishlistPage;
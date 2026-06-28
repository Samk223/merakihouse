import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { resolveProductImage } from "../../../utils/imageHelper";

export const CartDrawer = () => {
  const {
    cartItems,
    subtotal,
    shipping,
    total,
    cartCount,
    loading,
    updateCartItem,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    lastAddedItemId,
    setLastAddedItemId,
  } = useCart();

  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isCartOpen]);

  // Clear last added item ID when drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      setLastAddedItemId(null);
    }
  }, [isCartOpen, setLastAddedItemId]);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const parsedSubtotal = parseFloat(subtotal);
  const freeShippingThreshold = 150.0;
  const progressToFreeShipping = Math.min((parsedSubtotal / freeShippingThreshold) * 100, 100);
  const neededForFreeShipping = Math.max(freeShippingThreshold - parsedSubtotal, 0);

  const highlightedItem = lastAddedItemId 
    ? cartItems.find((item) => item.product_id === lastAddedItemId)
    : null;

  const regularItems = highlightedItem 
    ? cartItems.filter((item) => item.id !== highlightedItem.id)
    : cartItems;

  return (
    <div
      className={`fixed inset-0 z-50 select-none transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${
        isCartOpen ? "visible" : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop Dimming Overlay */}
      <div
        className={`absolute inset-0 bg-[#28273F]/40 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sliding Content Drawer */}
      <div
        ref={drawerRef}
        className={`absolute top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-[0_0_50px_rgba(40,39,63,0.12)] border-l border-[#28273F]/5 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#28273F]/5 flex justify-between items-center bg-[#FAF8F5]/50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#28273F]" strokeWidth={1.5} />
            <h2 className="font-heading text-lg text-[#28273F] tracking-wide uppercase">
              Shopping Bag
            </h2>
            <span className="bg-[#9D6C76] text-white text-[10px] font-bold font-body px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-[#28273F]/5 transition-colors cursor-pointer text-[#28273F]/70"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {parsedSubtotal > 0 && (
          <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#28273F]/5 text-center">
            <p className="font-body text-xs text-[#666666] tracking-wide mb-2">
              {neededForFreeShipping > 0 ? (
                <>
                  Add <span className="font-semibold text-[#28273F]">₹{neededForFreeShipping.toFixed(2)}</span> more for{" "}
                  <span className="font-semibold text-[#9D6C76]">Free Shipping</span>!
                </>
              ) : (
                <span className="font-semibold text-[#10B981]">You have unlocked Free Shipping!</span>
              )}
            </p>
            <div className="w-full h-1.5 bg-[#28273F]/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C597A0] to-[#9D6C76] rounded-full transition-all duration-700 ease-[cubic-bezier(0.3,0,0,1)]"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body (Scrollable items container) */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {loading && cartItems.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#28273F]/15 mb-4 animate-bounce" />
              <p className="font-heading text-lg text-[#28273F] mb-2">Your bag is empty</p>
              <p className="font-body text-xs text-[#666666] max-w-[240px] leading-relaxed mb-6 font-light">
                Discover our botanical formulations and self-care bundles.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/collections");
                }}
                className="w-full max-w-[260px] py-3.5 rounded-[9999px] font-body text-[10px] font-bold tracking-widest uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] shadow-button hover:shadow-hover flex items-center justify-center cursor-pointer"
                style={{
                  background: "transparent",
                  color: "#28273F",
                  border: "1.5px solid #28273F"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9D6C76";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#9D6C76";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#28273F";
                  e.currentTarget.style.borderColor = "#28273F";
                }}
              >
                Browse Collections
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cute thank you header (always visible when items exist) */}
              <div className="text-center py-2 select-none flex flex-col gap-1">
                <p className="font-body text-[10px] font-bold text-[#9D6C76] uppercase tracking-widest leading-relaxed">
                  Added to your bag!
                </p>
                <p className="font-body text-[9px] font-medium text-[#28273F]/70 tracking-wide">
                  Thank you for supporting Meraki House 🌸
                </p>
              </div>

              {/* Highlighted "Just Added" Item */}
              {highlightedItem && (() => {
                const productImg = resolveProductImage(highlightedItem.product.images?.find((img) => img.is_primary)?.path || highlightedItem.product.images?.[0]?.path);
                return (
                  <div className="flex flex-col gap-4 p-5 border border-[#9D6C76]/20 rounded-[24px] bg-[#FAF8F5] shadow-[0_8px_30px_rgba(157,108,118,0.03)] relative animate-fade-in">
                    <div className="flex gap-5">
                      {/* Big Item Image */}
                      <div className="w-28 h-28 shrink-0 rounded-[16px] overflow-hidden bg-white border border-[#28273F]/5 shadow-xs">
                        <img
                          src={productImg}
                          alt={highlightedItem.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h3 className="font-heading text-base text-[#28273F] font-semibold leading-tight line-clamp-2">
                              {highlightedItem.product.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(highlightedItem.id)}
                              className="text-[#666666]/40 hover:text-[#EF4444] p-0.5 transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-[10px] font-body text-[#28273F]/60 line-clamp-2 mt-1 leading-normal font-light">
                            {highlightedItem.product.short_description || "Botanical formulation for your daily rituals."}
                          </p>
                        </div>

                        {/* Quantity selector & price */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-[#28273F]/10 rounded-[9999px] px-2.5 py-1 bg-white">
                            <button
                              onClick={() => updateCartItem(highlightedItem.id, highlightedItem.quantity - 1)}
                              className="p-0.5 hover:text-[#9D6C76] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-body text-xs font-semibold text-[#28273F]">
                              {highlightedItem.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItem(highlightedItem.id, highlightedItem.quantity + 1)}
                              className="p-0.5 hover:text-[#9D6C76] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-body text-sm font-bold text-[#28273F]">
                            ₹{parseFloat(highlightedItem.subtotal).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Regular Items List header (if both highlighted and regular items exist) */}
              {highlightedItem && regularItems.length > 0 && (
                <div className="pt-2">
                  <p className="font-body text-[9px] font-bold text-[#28273F]/40 uppercase tracking-widest">
                    Other items in your bag
                  </p>
                  <div className="w-full h-[1px] bg-[#28273F]/5 mt-1.5 mb-1" />
                </div>
              )}

              {/* Regular Items List */}
              {regularItems.length > 0 && (
                <div className="space-y-4">
                  {regularItems.map((item) => {
                    const productImg = resolveProductImage(item.product.images?.find((img) => img.is_primary)?.path || item.product.images?.[0]?.path);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-[#28273F]/5 rounded-[16px] bg-white shadow-[0_4px_15px_rgba(40,39,63,0.005)] relative group/item"
                      >
                        {/* Item Image */}
                        <div className="w-20 h-20 shrink-0 rounded-[10px] overflow-hidden bg-[#FAF6F0] border border-[#28273F]/5">
                          <img
                            src={productImg}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item details */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h3 className="font-heading text-sm text-[#28273F] line-clamp-1">
                                {item.product.name}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#666666]/40 hover:text-[#EF4444] p-0.5 transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                            <p className="text-[10px] font-body text-[#28273F]/60 line-clamp-1 mt-0.5 leading-normal font-light">
                              {item.product.short_description || "Botanical formulation."}
                            </p>
                          </div>

                          {/* Quantity & price tags */}
                          <div className="flex justify-between items-center mt-2">
                            {/* Selector */}
                            <div className="flex items-center border border-[#28273F]/10 rounded-[9999px] px-2.5 py-1 bg-[#FAF8F5]">
                              <button
                                onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                className="p-0.5 hover:text-[#9D6C76] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-body text-xs font-semibold text-[#28273F]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                className="p-0.5 hover:text-[#9D6C76] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-body text-xs font-semibold text-[#28273F]">
                              ₹{parseFloat(item.subtotal).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer (Subtotals & Checkout) */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#28273F]/5 bg-[#FAF8F5]/80 backdrop-blur-md space-y-4">
            <div className="space-y-2.5 font-body text-xs text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#28273F]">₹{parseFloat(subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#28273F]">
                  {parseFloat(shipping) === 0 ? (
                    <span className="text-[#10B981] font-bold uppercase tracking-wider text-[10px]">Free</span>
                  ) : (
                    `₹${parseFloat(shipping).toLocaleString("en-IN")}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-[#28273F]/5 pt-3 text-[#28273F]">
                <span>Total</span>
                <span>₹{parseFloat(total).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex justify-center w-full pt-2">
              <button
                onClick={handleCheckoutClick}
                disabled={loading}
                className="w-full max-w-[260px] py-3 rounded-[9999px] font-body text-[10px] font-bold tracking-widest uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] shadow-button hover:shadow-hover flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{
                  background: "transparent",
                  color: "#28273F",
                  border: "1.5px solid #28273F"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9D6C76";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#9D6C76";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#28273F";
                  e.currentTarget.style.borderColor = "#28273F";
                }}
              >
                Proceed to Checkout
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

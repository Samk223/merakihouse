import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "./AuthContext";

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  discount_price: string | null;
  brand: string | null;
  short_description: string | null;
  images?: Array<{ path: string; is_primary: boolean }>;
}

export interface CartItemType {
  id: number;
  cart_id?: number;
  product_id: number;
  quantity: number;
  subtotal: string;
  product: CartProduct;
}

interface CartContextType {
  cartItems: CartItemType[];
  subtotal: string;
  shipping: string;
  total: string;
  cartCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<any>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<any>;
  removeFromCart: (cartItemId: number) => Promise<any>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedItemId: number | null;
  setLastAddedItemId: (id: number | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [subtotal, setSubtotal] = useState("0.00");
  const [shipping, setShipping] = useState("0.00");
  const [total, setTotal] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItemId, setLastAddedItemId] = useState<number | null>(null);
  const pendingUpdatesRef = React.useRef<Record<number, number>>({});

  // Calculate local guest totals
  const calculateLocalTotals = (items: CartItemType[]) => {
    let sub = 0;
    items.forEach((item) => {
      const price = parseFloat(item.product.price);
      sub += price * item.quantity;
    });

    const ship = sub > 0 ? (sub >= 150 ? 0 : 15) : 0;
    const tot = sub + ship;

    setSubtotal(sub.toFixed(2));
    setShipping(ship.toFixed(2));
    setTotal(tot.toFixed(2));
  };

  // Fetch cart
  const fetchCart = async () => {
    if (!isAuthenticated) {
      // Load guest cart from local storage
      const guestCart = localStorage.getItem("guest_cart");
      if (guestCart) {
        try {
          const parsed = JSON.parse(guestCart);
          setCartItems(parsed);
          calculateLocalTotals(parsed);
        } catch (e) {
          localStorage.removeItem("guest_cart");
        }
      }
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get("/cart");
      if (response.data.success) {
        const { cart_items, subtotal: s, shipping: sh, total: t } = response.data.data;
        setCartItems(cart_items || []);
        setSubtotal(s);
        setShipping(sh);
        setTotal(t);
      }
    } catch (error) {
      console.error("Failed to fetch cart from server:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart when authentication status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // Add to cart
  const addToCart = async (productId: number, quantity = 1) => {
    if (!isAuthenticated) {
      // Fetch product details first to store in local guest cart
      setLoading(true);
      try {
        const response = await apiClient.get(`/products`);
        // Find product in list (supports both paginated data structure and simple array)
        const rawData = response.data.data;
        const productsList = Array.isArray(rawData)
          ? rawData
          : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        
        const product = productsList.find((p: any) => p.id === productId);

        if (!product) {
          return { success: false, message: "Product not found." };
        }

        const existingItems = [...cartItems];
        const existingItemIndex = existingItems.findIndex(
          (item) => item.product_id === productId
        );

        if (existingItemIndex > -1) {
          existingItems[existingItemIndex].quantity += quantity;
          existingItems[existingItemIndex].subtotal = (
            parseFloat(product.price) * existingItems[existingItemIndex].quantity
          ).toFixed(2);
        } else {
          existingItems.push({
            id: Date.now(), // temporary local id
            product_id: productId,
            quantity,
            subtotal: (parseFloat(product.price) * quantity).toFixed(2),
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              price: product.price,
              discount_price: product.discount_price,
              brand: product.brand,
              short_description: product.short_description,
              images: product.images,
            },
          });
        }

        setCartItems(existingItems);
        localStorage.setItem("guest_cart", JSON.stringify(existingItems));
        calculateLocalTotals(existingItems);
        setLastAddedItemId(productId);
        setTimeout(() => {
          setIsCartOpen(true);
        }, 600);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to add item to guest cart:", error);
        return { success: false, message: "Failed to add product to cart." };
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/cart", {
        product_id: productId,
        quantity,
      });
      if (response.data.success) {
        const { cart_items, subtotal: s, shipping: sh, total: t } = response.data.data;
        setCartItems(cart_items || []);
        setSubtotal(s);
        setShipping(sh);
        setTotal(t);
        setLastAddedItemId(productId);
        setTimeout(() => {
          setIsCartOpen(true);
        }, 600);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add to cart.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity optimistically
  const updateCartItem = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    // Capture current state for rollback
    const originalCartItems = [...cartItems];
    const originalSubtotal = subtotal;
    const originalShipping = shipping;
    const originalTotal = total;

    // Record this as the latest pending quantity
    pendingUpdatesRef.current[cartItemId] = quantity;

    // 1. Optimistic UI update
    const updatedItems = cartItems.map((item) => {
      if (item.id === cartItemId) {
        const itemSubtotal = (parseFloat(item.product.price) * quantity).toFixed(2);
        return { ...item, quantity, subtotal: itemSubtotal };
      }
      return item;
    });

    setCartItems(updatedItems);
    
    // Calculate new totals optimistically
    let newSubtotalVal = 0;
    updatedItems.forEach((item) => {
      newSubtotalVal += parseFloat(item.product.price) * item.quantity;
    });
    const newShippingVal = newSubtotalVal > 0 ? (newSubtotalVal >= 150 ? 0 : 15) : 0;
    const newTotalVal = newSubtotalVal + newShippingVal;

    setSubtotal(newSubtotalVal.toFixed(2));
    setShipping(newShippingVal.toFixed(2));
    setTotal(newTotalVal.toFixed(2));

    if (!isAuthenticated) {
      localStorage.setItem("guest_cart", JSON.stringify(updatedItems));
      return { success: true };
    }

    // 2. Async backend network call
    try {
      const response = await apiClient.patch(`/cart/${cartItemId}`, {
        quantity,
      });

      // ONLY apply response if this is the latest update requested for this item
      if (pendingUpdatesRef.current[cartItemId] === quantity) {
        if (response.data.success) {
          const { cart_items, subtotal: s, shipping: sh, total: t } = response.data.data;
          // Sync with server response
          setCartItems(cart_items || []);
          setSubtotal(s);
          setShipping(sh);
          setTotal(t);
        } else {
          // Rollback on server failure
          setCartItems(originalCartItems);
          setSubtotal(originalSubtotal);
          setShipping(originalShipping);
          setTotal(originalTotal);
        }
      }
      return { success: response.data.success };
    } catch (error: any) {
      // Rollback on network error only if there are no newer updates pending
      if (pendingUpdatesRef.current[cartItemId] === quantity) {
        setCartItems(originalCartItems);
        setSubtotal(originalSubtotal);
        setShipping(originalShipping);
        setTotal(originalTotal);
      }
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update item quantity.",
      };
    }
  };

  // Remove cart item optimistically
  const removeFromCart = async (cartItemId: number) => {
    // Capture current state for rollback
    const originalCartItems = [...cartItems];
    const originalSubtotal = subtotal;
    const originalShipping = shipping;
    const originalTotal = total;

    // Clear any pending updates for this item
    delete pendingUpdatesRef.current[cartItemId];

    // 1. Optimistic UI update
    const updatedItems = cartItems.filter((item) => item.id !== cartItemId);
    setCartItems(updatedItems);

    // Calculate new totals optimistically
    let newSubtotalVal = 0;
    updatedItems.forEach((item) => {
      newSubtotalVal += parseFloat(item.product.price) * item.quantity;
    });
    const newShippingVal = newSubtotalVal > 0 ? (newSubtotalVal >= 150 ? 0 : 15) : 0;
    const newTotalVal = newSubtotalVal + newShippingVal;

    setSubtotal(newSubtotalVal.toFixed(2));
    setShipping(newShippingVal.toFixed(2));
    setTotal(newTotalVal.toFixed(2));

    if (!isAuthenticated) {
      localStorage.setItem("guest_cart", JSON.stringify(updatedItems));
      return { success: true };
    }

    // 2. Async backend network call
    try {
      const response = await apiClient.delete(`/cart/${cartItemId}`);
      if (response.data.success) {
        const { cart_items, subtotal: s, shipping: sh, total: t } = response.data.data;
        setCartItems(cart_items || []);
        setSubtotal(s);
        setShipping(sh);
        setTotal(t);
        return { success: true };
      } else {
        // Rollback
        setCartItems(originalCartItems);
        setSubtotal(originalSubtotal);
        setShipping(originalShipping);
        setTotal(originalTotal);
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      // Rollback
      setCartItems(originalCartItems);
      setSubtotal(originalSubtotal);
      setShipping(originalShipping);
      setTotal(originalTotal);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove item.",
      };
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setSubtotal("0.00");
    setShipping("0.00");
    setTotal("0.00");
    localStorage.removeItem("guest_cart");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        shipping,
        total,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        isCartOpen,
        setIsCartOpen,
        lastAddedItemId,
        setLastAddedItemId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import apiClient from "../api/apiClient";
import {
  MapPin,
  CreditCard,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Phone,
  User,
  Home
} from "lucide-react";

interface AddressType {
  id: number;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export const CheckoutPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // Mock Payment State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const fetchAddresses = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await apiClient.get("/addresses");
      if (response.data.success) {
        const addrList: AddressType[] = response.data.data || [];
        setAddresses(addrList);
        // Auto-select default or first address
        const def = addrList.find((a) => a.is_default);
        if (def) {
          setSelectedAddressId(def.id);
        } else if (addrList.length > 0) {
          setSelectedAddressId(addrList[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  // Validation rules
  const validateAddress = () => {
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setAddressError("Please fill in all required fields.");
      return false;
    }

    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      setAddressError("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }

    const pinRegex = /^[1-9]\d{5}$/;
    if (!pinRegex.test(postalCode.replace(/\s+/g, ""))) {
      setAddressError("Please enter a valid 6-digit Indian PIN code.");
      return false;
    }

    return true;
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    if (!validateAddress()) return;

    setSavingAddress(true);
    try {
      const response = await apiClient.post("/addresses", {
        full_name: fullName,
        phone: phone.replace(/\s+/g, ""),
        address_line_1: addressLine1,
        address_line_2: addressLine2 || undefined,
        city: city,
        state: state,
        postal_code: postalCode.replace(/\s+/g, ""),
        country: "India",
        is_default: addresses.length === 0, // default if first
      });

      if (response.data.success) {
        const newAddr = response.data.data;
        setAddresses([...addresses, newAddr]);
        setSelectedAddressId(newAddr.id);
        setShowAddressForm(false);
        // Reset form fields
        setFullName("");
        setPhone("");
        setAddressLine1("");
        setAddressLine2("");
        setCity("");
        setState("");
        setPostalCode("");
      }
    } catch (err: any) {
      setAddressError(err.response?.data?.message || "Failed to save address. Please check input parameters.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAddressId) {
      setError("Please select or add a shipping address.");
      return;
    }

    if (!cardName || cardNumber.length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
      setError("Please complete your credit card payment details.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/checkout", {
        address_id: selectedAddressId,
      });

      if (response.data.success) {
        const orderData = response.data.data;
        clearCart();
        localStorage.setItem("last_order_id", orderData.order.id.toString());
        navigate("/thank-you", {
          state: {
            order: orderData.order,
            orderItems: orderData.order_items,
          },
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Order placement failed. Please verify stock availability.");
    } finally {
      setLoading(false);
    }
  };

  // Formatting helper for Card Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setCardExpiry(value.slice(0, 5));
  };

  // Formatting helper for Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.slice(0, 19));
  };

  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12 select-none">
        <div 
          className="w-full max-w-[450px] bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.02)] p-8 text-center animate-fade-in flex flex-col items-center"
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <ShoppingBag className="w-10 h-10 text-[#9D6C76] mb-4" />
          <h2 className="font-heading text-xl text-[#28273F] mb-3 w-full text-center">
            Checkout Restricted
          </h2>
          <p 
            className="font-body text-xs text-[#666666] leading-relaxed mb-8 font-light text-center w-full"
            style={{ maxWidth: "340px", display: "block" }}
          >
            You are currently logged in as an Administrator. Checkout and order placement are reserved for customer accounts only.
          </p>
          <div className="w-full flex justify-center" style={{ maxWidth: "280px" }}>
            <Link
              to="/"
              className="block w-full bg-[#28273F] text-white py-3.5 rounded-[9999px] font-body text-xs font-semibold tracking-wider uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all duration-300 shadow-button text-center"
              style={{ display: "block", width: "100%", textAlign: "center", color: "#ffffff" }}
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12 select-none">
        <div className="w-full max-w-[450px] bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.02)] p-8 text-center animate-fade-in">
          <Lock className="w-10 h-10 text-[#9D6C76] mx-auto mb-4" />
          <h2 className="font-heading text-xl text-[#28273F] mb-3">Sign In Required</h2>
          <p className="font-body text-xs text-[#666666] leading-relaxed max-w-sm mx-auto mb-8 font-light">
            To protect your transactions and secure shipping details, please log in or create a Meraki House account to complete checkout.
          </p>
          <div className="space-y-3">
            <Link
              to="/login?redirect=/checkout"
              className="block w-full bg-[#28273F] text-white py-3.5 rounded-[9999px] font-body text-xs font-semibold tracking-wider uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all duration-300 shadow-button"
            >
              Sign In to Checkout
            </Link>
            <Link
              to="/signup?redirect=/checkout"
              className="block w-full border border-[#28273F]/10 text-[#28273F] py-3.5 rounded-[9999px] font-body text-xs font-semibold tracking-wider uppercase hover:bg-[#28273F]/5 active:scale-[0.96] transition-all duration-300"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12 select-none">
        <div className="w-full max-w-[450px] bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.02)] p-8 text-center animate-fade-in">
          <ShoppingBag className="w-10 h-10 text-[#28273F]/20 mx-auto mb-4" />
          <h2 className="font-heading text-lg text-[#28273F] mb-2">Your cart is empty</h2>
          <p className="font-body text-xs text-[#666666] leading-relaxed mb-6 font-light">
            Add item formulations to your shopping bag before proceeding to checkout.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center gap-2 bg-[#28273F] text-white py-3 px-6 rounded-[9999px] font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all duration-300 shadow-button"
          >
            Browse Collections
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF8F5] pb-24 select-none">
      {/* Editorial Header */}
      <div className="w-full py-10 text-center px-4 max-w-[800px] mx-auto animate-fade-in">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#9D6C76] mb-2 block font-body">
          Slow Living Store
        </span>
        <h1 className="font-heading text-2xl md:text-3xl text-[#28273F] tracking-[0.1em] uppercase font-light">
          Checkout
        </h1>
        <div className="w-16 h-[1px] bg-[#9D6C76]/30 mx-auto mt-4" />
      </div>

      <div className="container-custom max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Billing Address & Payment forms */}
        <div className="lg:col-span-7 space-y-8 animate-fade-in">
          {/* Billing Shipping Address Panel */}
          <div className="bg-white border border-[#28273F]/5 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(40,39,63,0.01)]">
            <div className="flex items-center gap-2.5 mb-6 border-b border-[#28273F]/5 pb-4">
              <MapPin className="w-5 h-5 text-[#9D6C76]" strokeWidth={1.5} />
              <h2 className="font-heading text-lg text-[#28273F]">Shipping Address</h2>
            </div>

            {/* List of addresses */}
            {addresses.length > 0 && (
              <div className="space-y-4 mb-6">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-4 p-4 border rounded-[16px] cursor-pointer transition-all duration-300 ${
                      selectedAddressId === addr.id
                        ? "border-[#9D6C76] bg-[#9D6C76]/5 shadow-[0_4px_15px_rgba(157,108,118,0.03)]"
                        : "border-[#28273F]/10 hover:border-[#28273F]/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-[#9D6C76]"
                    />
                    <div className="font-body text-xs text-[#666666] leading-relaxed">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#28273F] text-sm">{addr.full_name}</span>
                        {addr.is_default && (
                          <span className="bg-[#28273F]/10 text-[#28273F] text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p>{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}</p>
                      <p>{addr.city}, {addr.state} - <span className="font-bold text-[#28273F]">{addr.postal_code}</span></p>
                      <p className="flex items-center gap-1.5 mt-1 text-[#28273F]/75">
                        <Phone className="w-3 h-3 text-[#9D6C76]" />
                        {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Address Form Trigger */}
            {!showAddressForm ? (
              <button
                onClick={() => setShowAddressForm(true)}
                className="inline-flex items-center gap-2 border border-[#28273F]/10 px-5 py-3 rounded-[9999px] font-body text-xs font-semibold uppercase tracking-wider text-[#28273F] hover:bg-[#28273F]/5 transition-colors cursor-pointer bg-white"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddAddress} className="space-y-4 border border-[#28273F]/5 rounded-[18px] p-5 bg-[#FAF8F5]/30">
                <h3 className="font-heading text-sm text-[#28273F] mb-2">New Shipping Location</h3>
                {addressError && (
                  <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-[10px] text-[#EF4444] font-body">
                    {addressError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="please enter Your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Mobile Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Line 1 (House No, Building, Street)"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Line 2 (Area, Colony, Landmark - Optional)"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Pin Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="font-body text-[10px] font-bold tracking-wider uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer flex items-center gap-1.5 shadow-xs"
                    style={{
                      background: "transparent",
                      color: "#28273F",
                      border: "1.5px solid #28273F",
                      padding: "10px 24px",
                      borderRadius: "9999px",
                      lineHeight: "1"
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
                    {savingAddress ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Location"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="font-body text-[10px] font-bold tracking-wider uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer shadow-xs"
                    style={{
                      background: "transparent",
                      color: "#28273F",
                      border: "1.5px solid #28273F",
                      padding: "10px 24px",
                      borderRadius: "9999px",
                      lineHeight: "1"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#28273F";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "#28273F";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#28273F";
                      e.currentTarget.style.borderColor = "#28273F";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Billing Payment Details Panel */}
          <div className="bg-white border border-[#28273F]/5 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(40,39,63,0.01)]">
            <div className="flex items-center gap-2.5 mb-6 border-b border-[#28273F]/5 pb-4">
              <CreditCard className="w-5 h-5 text-[#9D6C76]" strokeWidth={1.5} />
              <h2 className="font-heading text-lg text-[#28273F]">Payment Formulation</h2>
            </div>

            {/* Premium Simulated Mock Card Graphic */}
            <div className="w-full aspect-[1.58/1] max-w-[340px] bg-gradient-to-br from-[#28273F] via-[#3E3A59] to-[#9D6C76] rounded-[18px] p-6 text-white relative shadow-lg overflow-hidden mb-6 flex flex-col justify-between select-none">
              <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] bg-white/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] tracking-[0.2em] font-semibold uppercase opacity-75">Meraki House Pay</span>
                <svg className="w-8 h-8 opacity-75" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="35" cy="50" r="28" fill="white" fillOpacity="0.4" />
                  <circle cx="65" cy="50" r="28" fill="white" fillOpacity="0.6" />
                </svg>
              </div>

              <div className="space-y-4">
                <div className="font-heading text-lg tracking-[0.18em] font-light">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[7px] tracking-widest uppercase opacity-55 block mb-0.5">Card Holder</span>
                    <span className="text-[10px] tracking-wider uppercase font-semibold block">
                      {cardName || "Your Name"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[7px] tracking-widest uppercase opacity-55 block mb-0.5">Expiry</span>
                    <span className="text-[10px] font-semibold block">
                      {cardExpiry || "MM/YY"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Inputs Form */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Cardholder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Please enter your name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="1234 5678 1234 5678"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Expiry Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">CVV *</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Invoice Breakdown and CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#28273F]/5 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(40,39,63,0.015)] space-y-6 sticky top-24">
            <h2 className="font-heading text-lg text-[#28273F] pb-4 border-b border-[#28273F]/5">
              Order Summary
            </h2>

            {/* List of items */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const primaryImg = item.product.images?.find((img) => img.is_primary)?.path || "/placeholders/product.png";
                return (
                  <div key={item.id} className="flex gap-3 justify-between items-center text-xs font-body">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-[#FAF6F0] border border-[#28273F]/5 shrink-0">
                        <img src={primaryImg} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#28273F] line-clamp-1">{item.product.name}</h4>
                        <span className="text-[#666666] text-[10px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#28273F]">
                      ₹{parseFloat(item.subtotal).toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Subtotals & calculations */}
            <div className="space-y-2.5 font-body text-xs text-[#666666] border-t border-[#28273F]/5 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#28273F]">₹{parseFloat(subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
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

            {/* Error notifications */}
            {error && (
              <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-[10px] text-[#EF4444] font-body leading-relaxed">
                {error}
              </div>
            )}

            {/* Place Order CTA */}
            <div className="flex justify-center w-full pt-2">
              <button
                onClick={handlePlaceOrder}
                disabled={loading || addresses.length === 0}
                className="w-full max-w-[260px] font-body text-[10px] font-bold tracking-widest uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] shadow-button hover:shadow-hover flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                style={{
                  background: "transparent",
                  color: "#28273F",
                  border: "1.5px solid #28273F",
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  lineHeight: "1"
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
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>
            </div>
            <p className="text-[9px] font-body text-[#666666]/65 text-center leading-relaxed font-light">
              By clicking "Place Order", you authorize simulated payment verification and agree to Meraki House policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight, ClipboardList } from "lucide-react";
import apiClient from "../api/apiClient";

interface OrderDetail {
  id: number;
  user_id: number;
  status: string;
  payment_status: string;
  subtotal: string;
  shipping: string;
  total: string;
  shipping_address_snapshot: any;
  created_at: string;
}

export const ThankyouPage = () => {
  const location = useLocation();
  
  // Retrieve order details from React Router state
  const state = location.state as {
    order?: OrderDetail;
    orderItems?: Array<{
      id: number;
      product_id: number;
      quantity: number;
      price: string;
      product: {
        name: string;
        sku: string;
        images?: Array<{ path: string; is_primary: boolean }>;
      };
    }>;
  };

  const [order, setOrder] = useState<OrderDetail | undefined>(state?.order);
  const [orderItems, setOrderItems] = useState<any[]>(state?.orderItems || []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = order?.id || localStorage.getItem("last_order_id");
      if (!orderId) return;
      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data.order);
          setOrderItems(response.data.data.order_items || []);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      }
    };

    fetchOrderDetails();
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] pb-24 min-h-[90vh] flex flex-col justify-center items-center px-4 select-none">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#F3DCF9]/20 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#C597A0]/15 blur-[90px] pointer-events-none" />

      {/* Main thank you card */}
      <div className="w-full max-w-[650px] bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.02)] p-8 md:p-12 relative z-10 animate-scale mt-8">
        
        {/* Success Icon & Heading */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-[#10B981] mx-auto mb-4" strokeWidth={1.2} />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#9D6C76] mb-2 block font-body">
            Order Confirmed
          </span>
          <h1 className="font-heading text-2xl md:text-3xl text-[#28273F] tracking-wide mb-3">
            Thank You for Your Order
          </h1>
          <p 
            className="font-body text-xs md:text-sm text-[#666666] leading-relaxed font-light"
            style={{ maxWidth: "460px", margin: "0 auto", display: "block" }}
          >
            Your daily botanical self-care ritual is being carefully prepared. We have sent an invoice validation to your email.
          </p>
        </div>

        {/* Order Details box */}
        {order ? (
          <div className="space-y-6 border-t border-[#28273F]/5 pt-6">
            <div className="grid grid-cols-2 gap-4 text-xs font-body leading-relaxed text-[#666666]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#28273F]/65 block mb-1">Order Date</span>
                <span>{new Date(order.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#28273F]/65 block mb-1">Status</span>
                <span className="capitalize font-semibold text-[#10B981]">{order.status}</span>
              </div>
            </div>

            {/* Address snapshot */}
            {order.shipping_address_snapshot && (
              <div className="p-4 bg-[#FAF8F5] border border-[#28273F]/5 rounded-[16px] text-xs font-body leading-relaxed text-[#666666]">
                <span className="text-[9px] uppercase font-bold text-[#28273F]/65 tracking-wider block mb-2">
                  Shipping Destination
                </span>
                <p className="font-semibold text-[#28273F] text-sm mb-1">
                  {order.shipping_address_snapshot.full_name}
                </p>
                <p>{order.shipping_address_snapshot.address_line_1}{order.shipping_address_snapshot.address_line_2 ? `, ${order.shipping_address_snapshot.address_line_2}` : ""}</p>
                <p>{order.shipping_address_snapshot.city}, {order.shipping_address_snapshot.state} - {order.shipping_address_snapshot.postal_code}</p>
                <p className="mt-1 text-[#28273F]/75">Phone: {order.shipping_address_snapshot.phone}</p>
              </div>
            )}

            {/* Order Items list */}
            {orderItems.length > 0 && (
              <div className="space-y-3.5">
                <span className="text-[9px] uppercase font-bold text-[#28273F]/65 tracking-wider block mb-2">
                  Items Purchased
                </span>
                <div className="space-y-3 pr-1">
                  {orderItems.map((item) => {
                    const primaryImg = item.product.images?.find((img: any) => img.is_primary)?.path || "/placeholders/product.png";
                    return (
                      <div key={item.id} className="flex justify-between items-center text-xs font-body">
                        <div className="flex items-center gap-3">
                          <div 
                            className="relative group cursor-heart shrink-0"
                            style={{ zIndex: 1 }}
                            onMouseEnter={(e) => { e.currentTarget.style.zIndex = "50"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.zIndex = "1"; }}
                          >
                            {/* Square thumbnail container */}
                            <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-[#FAF6F0] border border-[#28273F]/5">
                              <img 
                                src={primaryImg} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-110" 
                              />
                            </div>
                            
                            {/* Circular Preview Popup */}
                            <div 
                              className="absolute bottom-[110%] left-1/2 -translate-x-1/2 mb-2 w-36 h-36 rounded-full overflow-hidden border-[2.5px] border-solid border-[#9D6C76] bg-white shadow-[0_12px_40px_rgba(40,39,63,0.16)] pointer-events-none opacity-0 scale-50 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] z-[999] flex items-center justify-center"
                              style={{ transformOrigin: "bottom center" }}
                            >
                              <img 
                                src={primaryImg} 
                                alt={`${item.product.name} preview`} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#28273F] line-clamp-1">{item.product.name}</h4>
                            <span className="text-[#666666] text-[10px]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-[#28273F]">
                          ₹{parseFloat(item.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pricing Details */}
            <div className="space-y-2 border-t border-[#28273F]/5 pt-4 text-xs font-body text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#28273F]">₹{parseFloat(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#28273F]">
                  {parseFloat(order.shipping) === 0 ? "Free" : `₹${parseFloat(order.shipping).toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-[#28273F]/5 pt-3 text-[#28273F]">
                <span>Total Paid</span>
                <span>₹{parseFloat(order.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="font-body text-sm text-[#666666] mb-4">
              Your order confirmation summary has been completed successfully.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-[#28273F]/5 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/profile/orders"
            className="w-full sm:w-auto font-body text-xs font-semibold tracking-wider uppercase active:scale-[0.96] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-button"
            style={{
              background: "transparent",
              color: "#28273F",
              border: "1.5px solid #28273F",
              padding: "12px 32px",
              borderRadius: "9999px",
              lineHeight: "1",
              minWidth: "200px"
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
            <ClipboardList className="w-3.5 h-3.5" />
            Track Orders
          </Link>
          <Link
            to="/collections"
            className="w-full sm:w-auto font-body text-xs font-semibold tracking-wider uppercase active:scale-[0.96] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-button"
            style={{
              background: "transparent",
              color: "#28273F",
              border: "1.5px solid #28273F",
              padding: "12px 32px",
              borderRadius: "9999px",
              lineHeight: "1",
              minWidth: "200px"
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
            Continue Shopping
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ThankyouPage;
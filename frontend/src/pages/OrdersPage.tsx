import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  MapPin,
  Loader2,
  Calendar,
  CheckCircle,
  Truck,
  Box,
  Clock,
  ExternalLink
} from "lucide-react";

interface OrderHeader {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: string;
  shipping: string;
  total: string;
  currency: string;
  created_at: string;
}

interface OrderDetailType {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: string;
  shipping: string;
  total: string;
  shipping_address_snapshot: any;
  created_at: string;
  updated_at: string;
}

interface OrderItemType {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  product: {
    name: string;
    slug: string;
    sku: string;
    images?: Array<{ path: string; is_primary: boolean }>;
  };
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<number, { order: OrderDetailType; items: OrderItemType[] }>>({});
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/orders");
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleToggleExpand = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    // If order details not cached yet, fetch them
    if (!orderDetails[orderId]) {
      setDetailLoading(true);
      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        if (response.data.success) {
          const { order, order_items } = response.data.data;
          setOrderDetails((prev) => ({
            ...prev,
            [orderId]: {
              order,
              items: order_items,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  // Status timeline steps map
  const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];
  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-[#10B981]/10 text-[#10B981]";
      case "Shipped":
        return "bg-[#B98EA7]/15 text-[#B98EA7]";
      case "Processing":
        return "bg-[#F59E0B]/10 text-[#F59E0B]";
      default:
        return "bg-[#28273F]/10 text-[#28273F]/80";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      <h2 className="font-heading text-lg text-[#28273F] pb-3 border-b border-[#28273F]/5">
        Order History
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-[#FAF8F5]/35 border border-[#28273F]/5 rounded-[20px] p-6">
          <ClipboardList className="w-8 h-8 text-[#28273F]/10 mx-auto mb-3" />
          <p className="font-body text-xs text-[#666666] font-light">
            You haven't placed any orders yet. Visit our collections to start your first ritual.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className={`border rounded-[20px] overflow-hidden bg-white transition-all duration-300 ${
                  isExpanded ? "border-[#9D6C76]/30 shadow-[0_4px_20px_rgba(40,39,63,0.015)]" : "border-[#28273F]/5"
                }`}
              >
                {/* Order Header Summary */}
                <div
                  onClick={() => handleToggleExpand(order.id)}
                  className="p-5 md:p-6 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-[#FAF8F5]/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-heading text-sm text-[#28273F] font-semibold">
                        #{order.order_number}
                      </span>
                      <span className={`text-[9px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#666666] font-body">
                      <Calendar className="w-3 h-3 text-[#9D6C76]" />
                      <span>
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-[#666666]/50 block font-body">
                        Total Amount
                      </span>
                      <span className="font-body text-sm font-semibold text-[#28273F]">
                        ₹{parseFloat(order.total).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#28273F]/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#28273F]/50" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-[#28273F]/5 bg-[#FAF8F5]/25 p-5 md:p-6 space-y-6">
                    {detailLoading && !orderDetails[order.id] ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
                      </div>
                    ) : (
                      orderDetails[order.id] && (
                        <>
                          {/* 1. Status Delivery Step Timeline */}
                          <div className="w-full max-w-[500px] mx-auto py-4">
                            <div className="flex justify-between items-center relative select-none">
                              {/* Horizontal Timeline Connector Bar */}
                              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#28273F]/5 z-0" />
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#9D6C76] transition-all duration-700 z-0"
                                style={{
                                  width: `${Math.max(
                                    0,
                                    (getStepIndex(orderDetails[order.id].order.status) / (statusSteps.length - 1)) * 100
                                  )}%`,
                                }}
                              />

                              {/* Timeline Circles */}
                              {statusSteps.map((step, idx) => {
                                const currentIdx = getStepIndex(orderDetails[order.id].order.status);
                                const isDone = idx <= currentIdx;
                                const isActive = idx === currentIdx;

                                return (
                                  <div key={step} className="flex flex-col items-center relative z-10">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 ${
                                        isActive
                                          ? "bg-white border-[#9D6C76] text-[#9D6C76] ring-4 ring-[#9D6C76]/10"
                                          : isDone
                                          ? "bg-[#9D6C76] border-[#9D6C76] text-white"
                                          : "bg-white border-[#28273F]/10 text-[#666666]/40"
                                      }`}
                                    >
                                      {idx === 0 && <Clock className="w-3.5 h-3.5" />}
                                      {idx === 1 && <Box className="w-3.5 h-3.5" />}
                                      {idx === 2 && <Truck className="w-3.5 h-3.5" />}
                                      {idx === 3 && <CheckCircle className="w-3.5 h-3.5" />}
                                    </div>
                                    <span
                                      className={`text-[9px] font-body font-semibold uppercase tracking-wider mt-1.5 ${
                                        isActive
                                          ? "text-[#9D6C76]"
                                          : isDone
                                          ? "text-[#28273F]"
                                          : "text-[#666666]/40"
                                      }`}
                                    >
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Items Purchased List */}
                          <div className="space-y-3">
                            <span className="text-[9px] uppercase font-bold text-[#666666]/55 tracking-wider block">
                              Items Ordered
                            </span>
                            <div className="space-y-3">
                              {orderDetails[order.id].items.map((item) => {
                                const primaryImg = item.product.images?.find((img) => img.is_primary)?.path || "/placeholders/product.png";
                                return (
                                  <div key={item.id} className="flex justify-between items-center text-xs font-body">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-[#FAF6F0] border border-[#28273F]/5 shrink-0">
                                        <img src={primaryImg} alt={item.product.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <Link to={`/product/${item.product.slug}`} className="font-semibold text-[#28273F] hover:text-[#9D6C76] flex items-center gap-1">
                                          {item.product.name}
                                          <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                                        </Link>
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

                          {/* 3. Address snapshot & invoices details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#28273F]/5 text-xs font-body text-[#666666]">
                            {/* Address details */}
                            {orderDetails[order.id].order.shipping_address_snapshot && (
                              <div className="p-4 bg-white border border-[#28273F]/5 rounded-[16px] leading-relaxed">
                                <span className="text-[9px] uppercase font-bold text-[#666666]/55 tracking-wider block mb-2">
                                  Delivery Address
                                </span>
                                <p className="font-semibold text-[#28273F] text-sm mb-1">
                                  {orderDetails[order.id].order.shipping_address_snapshot.full_name}
                                </p>
                                <p>
                                  {orderDetails[order.id].order.shipping_address_snapshot.address_line_1}
                                  {orderDetails[order.id].order.shipping_address_snapshot.address_line_2 ? `, ${orderDetails[order.id].order.shipping_address_snapshot.address_line_2}` : ""}
                                </p>
                                <p>
                                  {orderDetails[order.id].order.shipping_address_snapshot.city}, {orderDetails[order.id].order.shipping_address_snapshot.state} - {orderDetails[order.id].order.shipping_address_snapshot.postal_code}
                                </p>
                                <p className="mt-1 text-[#28273F]/75">Phone: {orderDetails[order.id].order.shipping_address_snapshot.phone}</p>
                              </div>
                            )}

                            {/* Cost Breakdown */}
                            <div className="space-y-2 p-4 bg-white border border-[#28273F]/5 rounded-[16px]">
                              <span className="text-[9px] uppercase font-bold text-[#666666]/55 tracking-wider block mb-2">
                                Bill Breakdown
                              </span>
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-[#28273F]">
                                  ₹{parseFloat(orderDetails[order.id].order.subtotal).toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping Charge</span>
                                <span className="font-semibold text-[#28273F]">
                                  {parseFloat(orderDetails[order.id].order.shipping) === 0 ? (
                                    <span className="text-[#10B981] font-bold uppercase tracking-wider text-[10px]">Free</span>
                                  ) : (
                                    `₹${parseFloat(orderDetails[order.id].order.shipping).toLocaleString("en-IN")}`
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm font-semibold border-t border-[#28273F]/5 pt-3 text-[#28273F]">
                                <span>Grand Total</span>
                                <span>₹{parseFloat(orderDetails[order.id].order.total).toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  MapPin,
  Loader2,
  Calendar,
  Check,
  User,
  Phone,
  Box,
  Truck,
  CheckCircle,
  ExternalLink,
  Search
} from "lucide-react";

interface AdminOrderHeader {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total: string;
  created_at: string;
  shipping_address_snapshot?: {
    full_name: string;
    phone: string;
  };
}

interface AdminOrderDetailType {
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

interface AdminOrderItemType {
  id: number;
  quantity: number;
  price: string;
  product: {
    name: string;
    sku: string;
  };
}

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrderHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<number, { order: AdminOrderDetailType; items: AdminOrderItemType[] }>>({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/orders", {
        params: {
          status: statusFilter || undefined,
          search: debouncedSearch || undefined,
        },
      });
      // Collection Resource wrapped response lists items in data
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Failed to load admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, debouncedSearch]);

  const handleToggleExpand = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!orderDetails[orderId]) {
      setDetailLoading(true);
      try {
        const response = await apiClient.get(`/admin/orders/${orderId}`);
        if (response.data.success || response.status === 200) {
          const detail = response.data.data;
          // Eager loaded has order_items in response
          setOrderDetails((prev) => ({
            ...prev,
            [orderId]: {
              order: detail.order || detail,
              items: detail.order_items || [],
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

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        remarks: `Status updated by Admin to ${newStatus}`,
      });

      if (response.data.success || response.status === 200) {
        // Update header list
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

        // Update detail cache
        if (orderDetails[orderId]) {
          setOrderDetails((prev) => ({
            ...prev,
            [orderId]: {
              ...prev[orderId],
              order: {
                ...prev[orderId].order,
                status: newStatus,
              },
            },
          }));
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating order status. Please verify transition eligibility.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-[#10B981]/10 text-[#10B981]";
      case "Shipped":
        return "bg-[#B98EA7]/15 text-[#B98EA7]";
      case "Processing":
        return "bg-[#F59E0B]/10 text-[#F59E0B]";
      case "Packed":
        return "bg-[#3B82F6]/10 text-[#3B82F6]";
      default:
        return "bg-[#28273F]/10 text-[#28273F]/80";
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-[#28273F] tracking-wide">
          Order Center
        </h1>
        <p className="font-body text-xs text-[#666666] tracking-wide mt-1">
          Monitor customer transactions and transition shipment statuses.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-[#28273F]/5 rounded-[20px] shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by Order # or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "42px" }}
            className="w-full pr-4 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[9999px] font-body text-xs text-[#28273F] focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76]/30 transition-all duration-300"
          />
          <Search className="w-3.5 h-3.5 text-[#9D6C76] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%239D6C76' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>")`,
            paddingLeft: "16px",
            paddingRight: "36px"
          }}
          className="appearance-none bg-no-repeat bg-[right_14px_center] bg-[size:10px] px-3.5 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[9999px] font-body text-xs text-[#28273F] font-semibold focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76]/30 transition-all duration-300 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
          <ClipboardList className="w-10 h-10 text-[#28273F]/10 mx-auto mb-3" />
          <p className="font-body text-xs text-[#666666] font-light">No orders match your filter parameters.</p>
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
                {/* Header overview row */}
                <div
                  onClick={() => handleToggleExpand(order.id)}
                  className="p-5 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-[#FAF8F5]/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm text-[#28273F] font-semibold">
                        #{order.order_number}
                      </span>
                      <span className={`text-[8px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#666666] font-body">
                      Customer: {order.shipping_address_snapshot?.full_name || "Guest User"} • {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <span className="text-[8px] uppercase font-bold text-[#666666]/50 block font-body">Amount</span>
                      <span className="font-body text-xs font-semibold text-[#28273F]">
                        ₹{parseFloat(order.total).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Quick status selector */}
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[8px] font-body text-[10px] text-[#28273F] focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleToggleExpand(order.id)}
                      className="p-1 rounded hover:bg-[#28273F]/5 text-[#28273F]/50"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded items breakdown */}
                {isExpanded && (
                  <div className="border-t border-[#28273F]/5 bg-[#FAF8F5]/25 p-5 md:p-6 space-y-5">
                    {detailLoading && !orderDetails[order.id] ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
                      </div>
                    ) : (
                      orderDetails[order.id] && (
                        <>
                          {/* Items table */}
                          <div className="space-y-2">
                            <span className="text-[9px] uppercase font-bold text-[#666666]/55 tracking-wider block">
                              Items Breakdown
                            </span>
                            <div className="space-y-3 bg-white border border-[#28273F]/5 rounded-[16px] p-4">
                              {orderDetails[order.id].items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs font-body">
                                  <div>
                                    <h4 className="font-semibold text-[#28273F]">{item.product.name}</h4>
                                    <span className="text-[#666666]/70 text-[10px] uppercase font-semibold">{item.product.sku}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-[#28273F]">
                                      {item.quantity} x ₹{parseFloat(item.price).toLocaleString("en-IN")}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address Info snapshot */}
                          {orderDetails[order.id].order.shipping_address_snapshot && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-body text-[#666666]">
                              <div className="p-4 bg-white border border-[#28273F]/5 rounded-[16px] leading-relaxed">
                                <span className="text-[9px] uppercase font-bold text-[#666666]/55 tracking-wider block mb-2">
                                  Shipping Destination
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
                                <p className="mt-1 text-[#28273F]/75 flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-[#9D6C76]" />
                                  {orderDetails[order.id].order.shipping_address_snapshot.phone}
                                </p>
                              </div>

                              <div className="p-4 bg-white border border-[#28273F]/5 rounded-[16px] space-y-2">
                                <span className="text-[9px] uppercase font-bold text-[#666666]/55 tracking-wider block mb-2">
                                  Bill Calculations
                                </span>
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>₹{parseFloat(orderDetails[order.id].order.subtotal).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>₹{parseFloat(orderDetails[order.id].order.shipping).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold border-t border-[#28273F]/5 pt-2 text-[#28273F]">
                                  <span>Total Paid</span>
                                  <span>₹{parseFloat(orderDetails[order.id].order.total).toLocaleString("en-IN")}</span>
                                </div>
                              </div>
                            </div>
                          )}
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

export default AdminOrdersPage;
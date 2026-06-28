import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  TrendingUp,
  Loader2,
  DollarSign,
  ClipboardList,
  Ship,
  TrendingDown,
  BarChart3,
  Calendar
} from "lucide-react";

interface OrderBillingType {
  id: number;
  order_number: string;
  subtotal: string;
  shipping: string;
  total: string;
  created_at: string;
}

export const AdminRevenuePage = () => {
  const [orders, setOrders] = useState<OrderBillingType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderBilling = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/orders", {
        params: { per_page: 100 },
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Failed to load billing details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderBilling();
  }, []);

  // Compute stats
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const totalSubtotal = orders.reduce((sum, o) => sum + parseFloat(o.subtotal), 0);
  const totalShipping = orders.reduce((sum, o) => sum + parseFloat(o.shipping), 0);
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-8 animate-fade-in select-none">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-[#28273F] tracking-wide">
          Revenue Analytics
        </h1>
        <p className="font-body text-xs text-[#666666] tracking-wide mt-1">
          Review checkout metrics, shipping revenue, and average transaction values.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
        </div>
      ) : (
        <>
          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cumulative Sales */}
            <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 animate-fade-up">
              <div className="w-12 h-12 rounded-[16px] bg-[#9D6C76]/10 flex items-center justify-center text-[#9D6C76] shrink-0">
                <TrendingUp className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="font-body text-xs text-[#666666]">
                <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Cumulative Sales</span>
                <span className="text-xl font-bold text-[#28273F]">
                  ₹{totalSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="w-12 h-12 rounded-[16px] bg-[#B98EA7]/10 flex items-center justify-center text-[#B98EA7] shrink-0">
                <BarChart3 className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="font-body text-xs text-[#666666]">
                <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Avg Order Value</span>
                <span className="text-xl font-bold text-[#28273F]">
                  ₹{averageOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Subtotal Sales */}
            <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="w-12 h-12 rounded-[16px] bg-[#F3DCF9]/30 flex items-center justify-center text-[#B98EA7] shrink-0">
                <DollarSign className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="font-body text-xs text-[#666666]">
                <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Subtotal Volume</span>
                <span className="text-xl font-bold text-[#28273F]">
                  ₹{totalSubtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Shipping Collected */}
            <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="w-12 h-12 rounded-[16px] bg-[#FAF6F0] border border-[#28273F]/10 flex items-center justify-center text-[#28273F]/80 shrink-0">
                <Ship className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="font-body text-xs text-[#666666]">
                <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Shipping Collected</span>
                <span className="text-xl font-bold text-[#28273F]">
                  ₹{totalShipping.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Sales History Log Table */}
          <div className="bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.015)] space-y-4">
            <h2 className="font-heading text-lg text-[#28273F] pb-4 border-b border-[#28273F]/5">
              Sales Transaction Log
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-xs font-body text-[#666666]/60">
                No checkout billing logs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-xs text-[#666666]">
                  <thead>
                    <tr className="border-b border-[#28273F]/5 text-[10px] uppercase tracking-wider text-[#28273F]/75 font-semibold bg-[#FAF8F5]/50">
                      <th className="p-4">Order Number</th>
                      <th className="p-4">Order Date</th>
                      <th className="p-4">Subtotal</th>
                      <th className="p-4">Shipping Collected</th>
                      <th className="p-4 text-right">Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-[#28273F]/5 hover:bg-[#FAF8F5]/30">
                        <td className="p-4 font-semibold text-[#28273F]">#{o.order_number}</td>
                        <td className="p-4">
                          {new Date(o.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-4">₹{parseFloat(o.subtotal).toLocaleString("en-IN")}</td>
                        <td className="p-4">
                          {parseFloat(o.shipping) === 0 ? (
                            <span className="text-[#10B981] font-semibold">Free</span>
                          ) : (
                            `₹${parseFloat(o.shipping).toLocaleString("en-IN")}`
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-[#28273F]">
                          ₹{parseFloat(o.total).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminRevenuePage;
import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  Package,
  ClipboardList,
  Users,
  Star,
  Loader2,
  DollarSign,
  TrendingUp,
  Inbox,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatsType {
  total_products: number;
  total_categories: number;
  total_customers: number;
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  total_reviews: number;
  average_rating: number;
  currency: string;
}

interface RecentOrderType {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total: string;
  created_at: string;
  shipping_address_snapshot?: {
    full_name: string;
  };
}

const adminEssentials = [
  // 1. Laptop (Rose gold)
  <svg key="laptop" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(40,39,63,0.35)]">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="#9D6C76"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
    <line x1="12" y1="17" x2="12" y2="20"/>
  </svg>,
  // 2. Keyboard (Mauve)
  <svg key="keyboard" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(40,39,63,0.35)]">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#B98EA7"/>
    <line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/>
    <line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/>
    <line x1="7" y1="16" x2="17" y2="16"/>
  </svg>,
  // 3. Headphones (Rose gold)
  <svg key="headphones" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(40,39,63,0.35)]">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="#9D6C76"/>
  </svg>,
  // 4. Mouse (Mauve)
  <svg key="mouse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(40,39,63,0.35)]">
    <rect x="5" y="2" width="14" height="20" rx="7" fill="#B98EA7"/>
    <line x1="12" y1="2" x2="12" y2="12"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>,
  // 5. Coffee cup (Rose gold)
  <svg key="coffee" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(40,39,63,0.35)]">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="#9D6C76"/>
    <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
  </svg>,
  // 6. Sparkle star (Mauve)
  <svg key="sparkle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#B98EA7" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(40,39,63,0.35)]">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
];

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; iconIndex: number; tx: number; ty: number; rot: number }[]>([]);

  const handleAdminHover = (e: React.MouseEvent<HTMLHeadingElement>) => {
    // Control density of particles
    if (Math.random() > 0.3) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pId = Date.now() + Math.random();
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 30; 
    const tx = Math.cos(angle) * distance;
    // Always translate upwards (negative Y direction) to float above the text
    const ty = -30 - Math.random() * 50; 
    const rot = (Math.random() - 0.5) * 120;
    const iconIndex = Math.floor(Math.random() * adminEssentials.length);

    const newParticle = { id: pId, x, y, iconIndex, tx, ty, rot };
    setParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pId));
    }, 1400); // 1.4 seconds duration
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch dashboard stats
      const statsResponse = await apiClient.get("/admin/dashboard");
      setStats(statsResponse.data);

      // 2. Fetch recent orders (limit to 5)
      const ordersResponse = await apiClient.get("/admin/orders", {
        params: { per_page: 5 },
      });
      setRecentOrders(ordersResponse.data.data || []);
    } catch (error) {
      console.error("Failed to load admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
      </div>
    );
  }

  // Calculate mock total sales revenue based on delivered orders or standard mock multiplier
  const mockRevenue = recentOrders.reduce((acc, order) => acc + parseFloat(order.total), 0) * 1.5;

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
    <div className="animate-fade-in select-none">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes burst {
          0% {
            transform: translate(0, 0) scale(0.6) rotate(0deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(var(--rot));
            opacity: 0;
          }
        }
      `}</style>

      {/* 1. Slim Soft Blush Editorial Header Banner (Matching Category Pages) */}
      <div 
        className="w-full bg-cover bg-center border-b border-[#28273F]/5 select-none relative overflow-hidden py-10 md:py-16 flex items-center justify-center animate-fade-in text-center rounded-none"
        style={{ 
          backgroundImage: "url('/admin_dashboard_banner.png')",
          backgroundPosition: "center" 
        }}
      >
        {/* Soft elegant overlay to ensure text stands out beautifully */}
        <div className="absolute inset-0 bg-[#28273F]/25 backdrop-blur-[0.2px] pointer-events-none" />

        {/* Centered Editorial Content */}
        <div className="z-10 relative px-6">
          <div className="relative inline-block select-none">
            {/* Dynamic Bursting Particles (positioned relative to the header text behind it) */}
            {particles.map((p) => (
              <span
                key={p.id}
                className="absolute pointer-events-none select-none z-0"
                style={{
                  left: p.x - 14,
                  top: p.y - 14,
                  animation: "burst 1.4s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
                  transform: "translate(0, 0) scale(0.6) rotate(0deg)",
                  opacity: 1,
                  "--tx": `${p.tx}px`,
                  "--ty": `${p.ty}px`,
                  "--rot": `${p.rot}deg`
                } as React.CSSProperties}
              >
                {adminEssentials[p.iconIndex]}
              </span>
            ))}

            <h1 
              onMouseMove={handleAdminHover}
              className="relative z-10 font-heading text-2xl md:text-4xl text-white tracking-[0.18em] uppercase font-light cursor-pointer py-2 px-6"
              style={{ textShadow: "0 2px 10px rgba(40, 39, 63, 0.95)" }}
            >
              Welcome dear Admin
            </h1>
          </div>
          <p 
            className="font-body text-xs md:text-sm text-white/90 tracking-wide font-light max-w-[600px] mx-auto mt-4 leading-relaxed"
            style={{ textShadow: "0 2px 8px rgba(40, 39, 63, 0.95)" }}
          >
            May your day be filled with calm, conscious, and wabi-sabi moments. Let's review the heartbeat of our slow-living community.
          </p>
        </div>
      </div>

      {/* Dashboard Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-8 space-y-8 pb-16">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders Card */}
        <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 hover:translate-y-[-4px] hover:shadow-[0_15px_35px_rgba(40,39,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)]">
          <div className="w-12 h-12 rounded-[16px] bg-[#9D6C76]/10 flex items-center justify-center text-[#9D6C76] shrink-0">
            <ClipboardList className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="font-body">
            <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Total Orders</span>
            <span className="text-2xl font-semibold text-[#28273F]">{stats?.total_orders || 0}</span>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 hover:translate-y-[-4px] hover:shadow-[0_15px_35px_rgba(40,39,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)]">
          <div className="w-12 h-12 rounded-[16px] bg-[#B98EA7]/10 flex items-center justify-center text-[#B98EA7] shrink-0">
            <Users className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="font-body">
            <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Total Customers</span>
            <span className="text-2xl font-semibold text-[#28273F]">{stats?.total_customers || 0}</span>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 hover:translate-y-[-4px] hover:shadow-[0_15px_35px_rgba(40,39,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)]">
          <div className="w-12 h-12 rounded-[16px] bg-[#F3DCF9]/30 flex items-center justify-center text-[#B98EA7] shrink-0">
            <Package className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="font-body">
            <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Active Products</span>
            <span className="text-2xl font-semibold text-[#28273F]">{stats?.total_products || 0}</span>
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="p-6 bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgba(40,39,63,0.005)] flex items-center gap-4 hover:translate-y-[-4px] hover:shadow-[0_15px_35px_rgba(40,39,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)]">
          <div className="w-12 h-12 rounded-[16px] bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
            <Star className="w-6 h-6 fill-[#F59E0B]" strokeWidth={1.5} />
          </div>
          <div className="font-body">
            <span className="text-[10px] uppercase font-bold text-[#666666]/60 block mb-0.5">Average Rating</span>
            <span className="text-2xl font-semibold text-[#28273F]">{stats?.average_rating || 0.0} / 5</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.015)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#28273F]/5">
            <h2 className="font-heading text-lg text-[#28273F]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-[#9D6C76] hover:underline font-body uppercase tracking-wider">
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <Inbox className="w-8 h-8 text-[#28273F]/10 mx-auto mb-3" />
              <p className="font-body text-xs text-[#666666] font-light">No orders placed recently.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs text-[#666666]">
                <thead>
                  <tr className="border-b border-[#28273F]/5 text-[10px] uppercase tracking-wider text-[#28273F]/75 font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#28273F]/5 hover:bg-[#FAF8F5]/30">
                      <td className="py-4 font-semibold text-[#28273F]">#{order.order_number}</td>
                      <td className="py-4">{order.shipping_address_snapshot?.full_name || "Guest Customer"}</td>
                      <td className="py-4 font-semibold text-[#28273F]">₹{parseFloat(order.total).toLocaleString("en-IN")}</td>
                      <td className="py-4">
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Stats Breakdown Panel (Span 1) */}
        <div className="bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.015)] flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-lg text-[#28273F] pb-4 border-b border-[#28273F]/5 mb-6">
              Order Breakdown
            </h2>

            <div className="space-y-6">
              {/* Pending Orders indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-body text-[#666666]">
                  <span className="flex items-center gap-1.5 font-semibold text-[#28273F]/75">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Pending Orders
                  </span>
                  <span className="font-bold text-[#28273F]">{stats?.pending_orders || 0}</span>
                </div>
                <div className="w-full h-2 bg-[#28273F]/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full"
                    style={{
                      width: `${
                        stats?.total_orders ? ((stats.pending_orders / stats.total_orders) * 100) : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Delivered Orders indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-body text-[#666666]">
                  <span className="flex items-center gap-1.5 font-semibold text-[#28273F]/75">
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                    Delivered Orders
                  </span>
                  <span className="font-bold text-[#28273F]">{stats?.delivered_orders || 0}</span>
                </div>
                <div className="w-full h-2 bg-[#28273F]/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full"
                    style={{
                      width: `${
                        stats?.total_orders ? ((stats.delivered_orders / stats.total_orders) * 100) : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#28273F]/5 pt-6 mt-8 space-y-4">
            <h3 className="font-heading text-sm text-[#28273F]">Estimated Dashboard Sales</h3>
            <div className="p-4 bg-[#FAF8F5] rounded-[16px] flex items-center justify-between">
              <span className="text-xs font-body text-[#666666]">Monthly Revenue</span>
              <span className="font-body font-bold text-lg text-[#9D6C76]">
                ₹{(mockRevenue || 12000).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
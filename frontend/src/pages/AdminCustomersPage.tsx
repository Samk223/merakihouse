import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { Users, Loader2, Search, Inbox, ShieldCheck, Mail, Clipboard } from "lucide-react";

interface CustomerAggregatedType {
  userId: number;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
}

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerAggregatedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomersFromOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders to aggregate customer profiles
      const response = await apiClient.get("/admin/orders", {
        params: { per_page: 100 },
      });
      const orderList = response.data.data || [];

      // Aggregate customers from orders
      const aggMap: Record<number, CustomerAggregatedType> = {};

      orderList.forEach((order: any) => {
        if (!order.customer) return;
        const uId = order.customer.id;
        const totalVal = parseFloat(order.total);

        if (aggMap[uId]) {
          aggMap[uId].orderCount += 1;
          aggMap[uId].totalSpent += totalVal;
        } else {
          aggMap[uId] = {
            userId: uId,
            name: order.customer.name,
            email: order.customer.email,
            orderCount: 1,
            totalSpent: totalVal,
          };
        }
      });

      setCustomers(Object.values(aggMap));
    } catch (error) {
      console.error("Failed to load customer profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersFromOrders();
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-6 animate-fade-in select-none">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl text-[#28273F] tracking-wide">
          Customer Sanctuary Accounts
        </h1>
        <p className="font-body text-xs text-[#666666] tracking-wide mt-1">
          Monitor customer activity, purchase histories, and total spent.
        </p>
      </div>

      {/* Search Input bar */}
      <div className="flex bg-white p-4 border border-[#28273F]/5 rounded-[20px] shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "42px" }}
            className="w-full pr-4 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[9999px] font-body text-xs text-[#28273F] focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76]/30 transition-all duration-300"
          />
          <Search className="w-3.5 h-3.5 text-[#9D6C76] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
          <Users className="w-10 h-10 text-[#28273F]/10 mx-auto mb-3" />
          <p className="font-body text-xs text-[#666666] font-light">No customers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.userId}
              className="bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.005)] space-y-4 hover:shadow-[0_12px_35px_rgba(40,39,63,0.02)] hover:translate-y-[-2px] transition-all duration-300"
            >
              {/* Profile Card Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9D6C76]/10 flex items-center justify-center text-[#9D6C76] font-semibold text-sm">
                  {cust.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading text-sm text-[#28273F] font-semibold flex items-center gap-1.5">
                    {cust.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  </h3>
                  <span className="text-[10px] font-body text-[#666666] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#9D6C76]" />
                    {cust.email}
                  </span>
                </div>
              </div>

              {/* Statistics details */}
              <div className="grid grid-cols-2 gap-4 border-t border-[#28273F]/5 pt-4 font-body text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-[#666666]/55 block">Total Orders</span>
                  <span className="font-semibold text-[#28273F] flex items-center gap-1">
                    <Clipboard className="w-3.5 h-3.5 text-[#28273F]/40" />
                    {cust.orderCount} Orders
                  </span>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[9px] uppercase font-bold text-[#666666]/55 block">Total Spent</span>
                  <span className="font-bold text-[#9D6C76]">
                    ₹{cust.totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
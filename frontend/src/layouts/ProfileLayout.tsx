import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, ClipboardList, LifeBuoy, LogOut, Loader2 } from "lucide-react";

export const ProfileLayout = () => {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login?redirect=/profile");
      } else if (isAdmin) {
        navigate("/admin");
      }
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  if (loading || !isAuthenticated || isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-5 py-3.5 rounded-[12px] font-body text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
      isActive
        ? "bg-[#9D6C76] !text-white hover:!text-white shadow-[0_4px_15px_rgba(157,108,118,0.2)]"
        : "text-[#28273F]/75 hover:bg-[#28273F]/5 hover:text-[#28273F]"
    }`;

  return (
    <div className="w-full bg-[#FAF8F5] pb-24 select-none min-h-[80vh]">
      {/* Sanctuary Profile Banner */}
      <div className="w-full bg-[#C597A0]/10 py-12 md:py-16 text-center px-4 border-b border-[#28273F]/5">
        <h1 className="font-heading text-2xl md:text-3xl text-[#28273F] tracking-wide">
          Welcome back, {user?.name}
        </h1>
      </div>

      <div className="container-custom max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar Panel */}
          <aside className="lg:col-span-3 bg-white border border-[#28273F]/5 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(40,39,63,0.01)] space-y-2">
            <NavLink to="/profile" end className={navLinkClass}>
              <User className="w-4 h-4" strokeWidth={2} />
              My Profile
            </NavLink>
            <NavLink to="/profile/orders" className={navLinkClass}>
              <ClipboardList className="w-4 h-4" strokeWidth={2} />
              Order History
            </NavLink>
            <NavLink to="/profile/help" className={navLinkClass}>
              <LifeBuoy className="w-4 h-4" strokeWidth={2} />
              Slow Support
            </NavLink>
            
            <div className="h-[1px] bg-[#28273F]/5 my-3" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-[12px] font-body text-xs font-semibold tracking-wider uppercase text-[#EF4444] hover:bg-[#EF4444]/5 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Sign Out
            </button>
          </aside>

          {/* Subpage viewport Outlet */}
          <main className="lg:col-span-9 bg-white border border-[#28273F]/5 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(40,39,63,0.01)] min-h-[400px]">
            <Outlet />
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
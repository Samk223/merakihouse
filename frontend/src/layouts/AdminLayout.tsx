import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  LogOut,
  ChevronDown
} from "lucide-react";

export const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Dropdown States
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [navHover, setNavHover] = useState(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        navigate("/login?redirect=/admin");
      }
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target as Node)) {
        setNavDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navOptions = [
    { label: "view dashboard overview", path: "/admin" },
    { label: "manage catalog products", path: "/admin/products" },
    { label: "manage product categories", path: "/admin/categories" },
    { label: "manage customer orders", path: "/admin/orders" },
    { label: "view customer directory", path: "/admin/customers" },
    { label: "resolve support tickets", path: "/admin/tickets" },
    { label: "analyze revenue statistics", path: "/admin/revenue" },
    { label: "return to storefront", path: "/" },
    { label: "sign out of session", action: "logout" }
  ];

  const getCurrentActionLabel = () => {
    const currentPath = location.pathname;
    const activeOpt = navOptions.find(opt => opt.path === currentPath);
    return activeOpt ? activeOpt.label : "navigate admin panels";
  };

  const isOptionActive = (opt: any) => {
    return location.pathname === opt.path;
  };

  const handleNavAction = async (opt: any) => {
    setNavDropdownOpen(false);
    if (opt.action === "logout") {
      await handleLogout();
    } else if (opt.path) {
      navigate(opt.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col select-none admin-route-container">
      <style>{`
        .admin-route-container, .admin-route-container * {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%239D6C76'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") 12 12, auto !important;
        }
      `}</style>
      {/* Sticky top header with Meraki House logo and the natural language nav selector */}
      <header className="w-full bg-white border-b border-[#28273F]/5 py-4 px-6 md:px-8 shadow-[0_4px_20px_rgba(40,39,63,0.01)] flex flex-col md:flex-row items-center justify-between gap-4 z-30 select-none">
        {/* Logo and title */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg text-[#28273F] tracking-widest uppercase">
            Meraki House
          </span>
          <span className="text-[8px] font-body tracking-wider uppercase font-bold text-[#9D6C76] bg-[#9D6C76]/10 px-2 py-0.5 rounded">
            Admin
          </span>
        </div>

        {/* 2. Interactive Natural Language Admin Selector */}
        <div className="flex flex-wrap items-center justify-center font-body text-xs md:text-sm text-[#28273F] font-light tracking-wide gap-1.5 text-center">
          <span>As a dear admin, I want to</span>
          
          {/* Action Dropdown */}
          <div ref={navDropdownRef} className="relative inline-block">
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              onMouseEnter={() => setNavHover(true)}
              onMouseLeave={() => setNavHover(false)}
              style={{
                color: navHover ? "#855A63" : "#9D6C76",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                padding: "0 2px",
                outline: "none"
              }}
            >
              <span style={{ borderBottom: `1.5px dashed ${navHover ? "#855A63" : "#9D6C76"}`, paddingBottom: "2px" }}>
                {getCurrentActionLabel()}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${navDropdownOpen ? "rotate-180" : ""}`} style={{ color: navHover ? "#855A63" : "#9D6C76" }} />
            </button>
            
            {navDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-[#28273F]/5 rounded-[20px] shadow-[0_15px_50px_rgba(40,39,63,0.08)] p-2 z-50 animate-scale text-left">
                {/* Section 1: Dashboard Navigation */}
                <div className="space-y-0.5">
                  {navOptions.slice(0, 7).map((opt) => (
                    <button
                      key={opt.path || opt.action}
                      onClick={() => handleNavAction(opt)}
                      className={`w-full px-4 py-2.5 rounded-[12px] text-xs font-semibold text-left flex items-center justify-between transition-all duration-200 ${
                        isOptionActive(opt) 
                          ? "text-[#9D6C76] bg-[#9D6C76]/5 font-bold" 
                          : "text-[#28273F] hover:bg-[#28273F]/5"
                      }`}
                    >
                      <span className="capitalize">{opt.label}</span>
                      {isOptionActive(opt) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9D6C76]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#28273F]/5 my-2" />

                {/* Section 2: Storefront Redirection */}
                <button
                  onClick={() => handleNavAction(navOptions[7])}
                  className="w-full px-4 py-2.5 rounded-[12px] text-xs font-semibold text-left text-[#28273F] hover:bg-[#28273F]/5 transition-all duration-200"
                >
                  <span className="capitalize">{navOptions[7].label}</span>
                </button>

                {/* Divider */}
                <div className="h-[1px] bg-[#28273F]/5 my-2" />

                {/* Section 3: Session Actions */}
                <button
                  onClick={() => handleNavAction(navOptions[8])}
                  className="w-full px-4 py-2.5 rounded-[12px] text-xs font-semibold text-left text-[#EF4444] hover:bg-[#EF4444]/5 transition-all duration-200"
                >
                  <span className="capitalize">{navOptions[8].label}</span>
                </button>
              </div>
            )}
          </div>

          <span>today.</span>
        </div>

        {/* Profile Info / Actions */}
        <div className="flex items-center gap-4 text-xs font-body">
          <div className="text-right hidden md:block">
            <span className="font-semibold text-[#28273F] block">{user?.name}</span>
            <span className="opacity-60 text-[9px] block">{user?.email}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[#EF4444] hover:bg-[#EF4444]/5 px-3 py-1.5 rounded-[9999px] font-body text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer border border-[#EF4444]/10"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content viewport */}
      <main className="flex-grow overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
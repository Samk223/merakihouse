import { Outlet, useLocation } from "react-router-dom";
import { AnnouncementBar } from "../components/layout/AnnouncementBar/AnnouncementBar";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";
import { CartDrawer } from "../components/navigation/CartDrawer/CartDrawer";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Slim rotating Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky overlay Header */}
      <Header isHome={isHome} />

      {/* Main viewport area */}
      <main className={`flex-grow ${isHome ? "" : "pt-[76px] md:pt-[84px]"}`}>
        <Outlet />
      </main>

      {/* Global Brand Footer Layout */}
      <Footer />

      {/* Global Shopping Cart Drawer Overlay */}
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
  
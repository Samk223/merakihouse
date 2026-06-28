import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import {
  Logo,
  MobileMenuButton,
  NavigationLink,
  NavigationGroup,
  SearchButton,
  CartButton,
  WishlistButton,
  ProfileButton
} from "../../navigation";

export interface HeaderProps {
  isHome?: boolean;
}

export const Header = ({ isHome = false }: HeaderProps) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const userName = user ? user.name : "Guest";
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  const headerBgClass = isTransparent
    ? "bg-gradient-to-b from-black/45 via-black/15 to-transparent text-white border-transparent"
    : "bg-[#FAF8F5]/95 backdrop-blur-md shadow-card border-b border-border-main/40 text-text-primary";

  const headerHeightClass = isTransparent
    ? "h-[96px] md:h-[104px]"
    : "h-[76px] md:h-[84px]";

  const logoSize = isTransparent ? "lg" : "md";

  return (
    <header
      className={`fixed left-0 w-full z-40 transition-all duration-500 ease-emphasized ${
        scrolled ? "top-0" : "top-[36px]"
      } ${headerBgClass} ${headerHeightClass}`}
    >
      {/* 3-Column Grid for pixel-perfect centering */}
      <div className="container-custom h-full grid grid-cols-3 items-center">
        
        {/* Left Column: Mobile Menu trigger or Desktop Navigation Links */}
        <div className="flex items-center justify-start h-full">
          <MobileMenuButton
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-current"
          />
          <NavigationGroup
            align="left"
            gap="md"
            className="hidden md:flex h-full"
          >
            <NavigationLink to="/collections/hair-care">Hair Care</NavigationLink>
            <NavigationLink to="/collections/body-care">Body Care</NavigationLink>
            <NavigationLink to="/collections/home-living">Home Living</NavigationLink>
            <NavigationLink to="/collections/gift-kits">Gift Kits</NavigationLink>
          </NavigationGroup>
        </div>

        {/* Center Column: Perfectly centered Brand Logo */}
        <div className="flex items-center justify-center h-full">
          <Logo size={logoSize} className="text-current transition-all duration-500 ease-emphasized" />
        </div>

        {/* Right Column: Desktop Actions & Links or Mobile actions */}
        <div className="flex items-center justify-end h-full">
          <NavigationGroup gap="md" align="right" className="hidden lg:flex mr-6 h-full">
            <NavigationLink to="/journal">Journal</NavigationLink>
          </NavigationGroup>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1 text-current">
            <SearchButton size="md" className="text-current" />
            <Link to="/wishlist" aria-label="Wishlist">
              <WishlistButton size="md" count={0} className="text-current cursor-pointer" />
            </Link>
            <CartButton size="md" count={cartCount} onClick={() => setIsCartOpen(true)} className="text-current cursor-pointer" />
            <Link to={isAuthenticated ? (isAdmin ? "/admin" : "/profile") : "/login"} aria-label="Profile">
              <ProfileButton size="md" userName={userName} className="text-current cursor-pointer" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-1 text-current">
            <Link to="/wishlist" aria-label="Wishlist">
              <WishlistButton size="sm" className="text-current cursor-pointer" />
            </Link>
            <CartButton size="sm" count={cartCount} onClick={() => setIsCartOpen(true)} className="text-current cursor-pointer" />
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-[#FAF8F5] border-b border-border-main/50 transition-all duration-500 ease-emphasized overflow-hidden ${
          mobileMenuOpen ? "max-h-[80vh] opacity-100 shadow-modal" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-6 gap-4 text-text-primary">
          <Link
            to="/collections/hair-care"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-base font-semibold uppercase tracking-wider py-2 border-b border-border-main/20"
          >
            Hair Care
          </Link>
          <Link
            to="/collections/body-care"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-base font-semibold uppercase tracking-wider py-2 border-b border-border-main/20"
          >
            Body Care
          </Link>
          <Link
            to="/collections/home-living"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-base font-semibold uppercase tracking-wider py-2 border-b border-border-main/20"
          >
            Home Living
          </Link>
          <Link
            to="/collections/gift-kits"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-base font-semibold uppercase tracking-wider py-2 border-b border-border-main/20"
          >
            Gift Kits
          </Link>
          <Link
            to="/journal"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-base font-semibold uppercase tracking-wider py-2"
          >
            Journal
          </Link>
          <Link
            to={isAuthenticated ? (isAdmin ? "/admin" : "/profile") : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-4 mt-4 pt-4 border-t border-border-main/40 text-text-primary"
          >
            <ProfileButton size="md" userName={userName} />
            <span className="font-body text-body font-semibold">{isAuthenticated ? "Account" : "Sign In"}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

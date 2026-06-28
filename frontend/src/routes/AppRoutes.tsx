import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import CollectionPage from "../pages/CollectionPage";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import WishlistPage from "../pages/WhishlistPage";
import CheckoutPage from "../pages/CheckoutPage";
import ThankyouPage from "../pages/ThankyouPage";
import ScrollToTop from "../components/ScrollToTop";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import ProfilePage from "../pages/ProfilePage";
import OrdersPage from "../pages/OrdersPage";
import HelpPage from "../pages/HelpPage";

import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminCategoriesPage from "../pages/AdminCategoriesPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminCustomersPage from "../pages/AdminCustomersPage";
import AdminTicketsPage from "../pages/AdminTicketsPage";
import AdminRevenuePage from "../pages/AdminRevenuePage";

const AppRoutes = () => {
  return (
   <BrowserRouter>
    <ScrollToTop />
    <Routes>
    {/* Public Routes for everyone*/}
    <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/collections/:categorySlug" element={<CategoryPage />} /> //here slug refres to the particular categories
        <Route path="/product/:slug" element={<ProductPage />} /> //here slug refres to the particular product id's
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankyouPage />} />
        
        {/* User Profile Routes*/}
        <Route path="/profile" element={<ProfileLayout />}>
        <Route index element={<ProfilePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="help" element={<HelpPage />} />
        </Route>
    </Route>

    {/* Auth routes for everyone*/}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* Admin Profile Routes*/}
    <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboardPage />} />
    <Route path="products" element={<AdminProductsPage />} />
    <Route path="categories" element={<AdminCategoriesPage />} />
    <Route path="orders" element={<AdminOrdersPage />} />
    <Route path="customers" element={<AdminCustomersPage />} />
    <Route path="tickets" element={<AdminTicketsPage />} />
    <Route path="revenue" element={<AdminRevenuePage />} />
    </Route>
   </Routes>
   </BrowserRouter>
  );
};

export default AppRoutes;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CartPage from "./pages/cart/cart-page";
import ShippingAddress from "./pages/cart/shipping-address";
import HomePage from "./pages/home";
import ProductDetails from "./pages/product-details";
import Login from "./pages/users/login";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ProductTable from "./pages/dashboard/products/product-table";
import UserTable from "./pages/dashboard/users/users-table";
import ProductUpdate from "./pages/dashboard/products/product-update";
import Register from "./pages/users/register";
import Profile from "./pages/users/profile";
import Contact from "./pages/contact/contact";
import About from "./pages/about/about";
import OrdersTable from "./pages/dashboard/orders/order-table";
import OrderDetails from "./pages/cart/order-details";
import Products from "./pages/products";
import AuthProvider from "./utils/auth-provider";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Loader from "./components/UI/loader";
import ErrorFallback from "./components/UI/error-fallback";
import "react-lazy-load-image-component/src/effects/blur.css";
import PlaceOrder from "./pages/cart/place-order";
import Cancel from "./pages/cancel";
import Success from "./pages/success";
import Wishlist from "./pages/wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import EmailVerificationPage from "./pages/EmailVerificationPage";

const DashboardLayout = lazy(
  () => import("./components/layouts/dashboard-layout")
);

const App = () => {
  return (
    <WishlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Products />} />
          <Route path="/search/:keyword" element={<Products />} />
          <Route path="/page/:pageNumber" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/shipping-address"
            element={
              <AuthProvider>
                <ShippingAddress />
              </AuthProvider>
            }
          />
          <Route
            path="/place-order"
            element={
              <AuthProvider>
                <PlaceOrder />
              </AuthProvider>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <AuthProvider>
                <Profile />
              </AuthProvider>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/orders/:id"
            element={
              <AuthProvider>
                <OrderDetails />
              </AuthProvider>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ErrorBoundary
                onReset={() => (location.href = "/")}
                FallbackComponent={ErrorFallback}
              >
                <Suspense fallback={<Loader />}>
                  <DashboardLayout />
                </Suspense>
              </ErrorBoundary>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="product-list" element={<ProductTable />} />
            <Route path="product-list/:pageNumber" element={<ProductTable />} />
            <Route path="user-list" element={<UserTable />} />
            <Route path="orders-list" element={<OrdersTable />} />
            <Route path="product-edit/:id" element={<ProductUpdate />} />
          </Route>

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </WishlistProvider>
  );
};

export default App;

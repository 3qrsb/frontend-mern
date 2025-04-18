import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CartPage from "./pages/cart/CartPage";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetailsPage";
import Login from "./pages/users/login";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProductTable from "./pages/dashboard/products/ProductTablePage";
import UserTable from "./pages/dashboard/users/UsersTablePage";
import Register from "./pages/users/register";
import Profile from "./pages/users/profile";
import OrdersTable from "./pages/dashboard/orders/OrdersTablePage";
import OrderDetails from "./pages/cart/OrderDetailsPage";
import Products from "./pages/ProductsPage";
import AuthProvider from "./utils/auth-provider";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Loader from "./components/UI/loader";
import ErrorFallback from "./components/UI/error-fallback";
import "react-lazy-load-image-component/src/effects/blur.css";
import PlaceOrder from "./pages/cart/PlaceOrderPage";
import Wishlist from "./pages/users/wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import EmailVerificationPage from "./pages/helpers/EmailVerificationPage";
import ResetPassword from "./pages/helpers/resetPassword";
import ForgotPassword from "./pages/helpers/forgotPassword";
import Contact from "./pages/ContactPage";
import About from "./pages/AboutPage";
import { fetchExchangeRates } from "./redux/settings/exchangeRatesSlice";
import { useAppDispatch } from "./redux";
import "./config/chartConfig";
import Success from "./pages/payment/Success";
import Cancel from "./pages/payment/Cancel";

const DashboardLayout = lazy(
  () => import("./components/layouts/admin-dashboard/DashboardLayout")
);

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchExchangeRates());
  }, [dispatch]);

  return (
    <WishlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search/:keyword" element={<Products />} />
          <Route path="/page/:pageNumber" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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

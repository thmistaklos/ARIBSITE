import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DashboardLayout from "./pages/admin/DashboardLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ProductsManagement from "./pages/admin/ProductsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import SettingsPage from "./pages/admin/SettingsPage";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <main className="flex-grow">
                      <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                          <Route index element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                        </Routes>
                      </AnimatePresence>
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Protected Admin Dashboard Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="orders" element={<OrdersManagement />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/admin/DashboardLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ProductsManagement from "./pages/admin/ProductsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import SettingsPage from "./pages/admin/SettingsPage";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./components/PublicLayout";
import DistributorsManagement from "./pages/admin/DistributorsManagement";
import RecipesManagement from "./pages/admin/RecipesManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import FaqManagement from "./pages/admin/FaqManagement";
import FactsManagement from "./pages/admin/FactsManagement";
import DiscountsManagement from "./pages/admin/DiscountsManagement";

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
              {/* Public Routes with common Header/Footer and animations */}
              <Route path="/*" element={<PublicLayout />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Protected Admin Dashboard Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="distributors" element={<DistributorsManagement />} />
                  <Route path="recipes" element={<RecipesManagement />} />
                  <Route path="blog" element={<BlogManagement />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="faq" element={<FaqManagement />} />
                  <Route path="facts" element={<FactsManagement />} />
                  <Route path="discounts" element={<DiscountsManagement />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Catch-all for 404 - This will only catch routes not handled by PublicLayout or Admin routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
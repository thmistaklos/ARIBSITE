import React from "react"; // Import React for error boundary
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
import HeroCarouselManagement from "./pages/admin/HeroCarouselManagement";
import FarmInfoManagement from "./pages/admin/FarmInfoManagement"; // Import the new component

const queryClient = new QueryClient();

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-800 p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-center">We're sorry for the inconvenience. Please try refreshing the page.</p>
          {this.state.error && (
            <details className="mt-4 p-2 bg-red-200 rounded-md text-sm text-left max-w-lg overflow-auto">
              <summary>Error Details</summary>
              <pre className="whitespace-pre-wrap break-all">{this.state.error.toString()}</pre>
              {this.state.errorInfo && (
                <pre className="whitespace-pre-wrap break-all mt-2">{this.state.errorInfo.componentStack}</pre>
              )}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
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
                    <Route path="herocarousel" element={<HeroCarouselManagement />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="distributors" element={<DistributorsManagement />} />
                    <Route path="recipes" element={<RecipesManagement />} />
                    <Route path="blog" element={<BlogManagement />} />
                    <Route path="content" element={<ContentManagement />} />
                    <Route path="faq" element={<FaqManagement />} />
                    <Route path="facts" element={<FactsManagement />} />
                    <Route path="farminfo" element={<FarmInfoManagement />} />
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
  </ErrorBoundary>
);

export default App;
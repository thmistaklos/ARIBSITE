import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import DistributorsPage from "../pages/DistributorsPage";
import RecipesPage from "../pages/RecipesPage";
import BlogPage from "../pages/BlogPage";
import BlogPostDetail from "../pages/BlogPostDetail";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import Footer from "./Footer";

const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/distributors" element={<DistributorsPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
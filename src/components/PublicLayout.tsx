import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DistributorsPage from '@/pages/DistributorsPage';
import RecipesPage from '@/pages/RecipesPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostDetail from '@/pages/BlogPostDetail';
import ProductDetailPage from '@/pages/ProductDetailPage';
import RecipeDetailPage from '@/pages/RecipeDetailPage'; // New import
import NotFound from '@/pages/NotFound';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              index
              element={
                <motion.div
                  key="home"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <HomePage />
                </motion.div>
              }
            />
            <Route
              path="/products"
              element={
                <motion.div
                  key="products"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <ProductsPage />
                </motion.div>
              }
            />
            <Route
              path="/products/:id"
              element={
                <motion.div
                  key="product-detail"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <ProductDetailPage />
                </motion.div>
              }
            />
            <Route
              path="/distributors"
              element={
                <motion.div
                  key="distributors"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <DistributorsPage />
                </motion.div>
              }
            />
            <Route
              path="/recipes"
              element={
                <motion.div
                  key="recipes"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <RecipesPage />
                </motion.div>
              }
            />
            <Route
              path="/recipes/:id" {/* New route for recipe detail */}
              element={
                <motion.div
                  key="recipe-detail"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <RecipeDetailPage />
                </motion.div>
              }
            />
            <Route
              path="/blog"
              element={
                <motion.div
                  key="blog"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <BlogPage />
                </motion.div>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <motion.div
                  key="blog-detail"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <BlogPostDetail />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div
                  key="about"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <AboutPage />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div
                  key="contact"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="h-full w-full"
                >
                  <ContactPage />
                </motion.div>
              }
            />
            {/* Catch-all for 404 within the public layout */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
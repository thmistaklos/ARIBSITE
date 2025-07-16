import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DistributorsPage from '@/pages/DistributorsPage'; // New import
import RecipesPage from '@/pages/RecipesPage'; // New import
import BlogPage from '@/pages/BlogPage'; // New import
import BlogPostDetail from '@/pages/BlogPostDetail'; // New import
import ProductDetailPage from '@/pages/ProductDetailPage'; // New import
import NotFound from '@/pages/NotFound'; // Include NotFound for public paths not explicitly defined

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
              path="/products/:id" // New route for product detail
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
              path="/distributors" // New route
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
              path="/recipes" // New route
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
              path="/blog" // New route
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
              path="/blog/:id" // New route for blog post detail
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
import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
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
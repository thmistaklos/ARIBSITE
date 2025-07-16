import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import HomePage from "../pages/HomePage";
// ✅ Import other pages as needed
// import AboutPage from "../pages/AboutPage";
// import ContactPage from "../pages/ContactPage";

const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            {/* ✅ Add your other routes here */}
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* <Route path="/contact" element={<ContactPage />} /> */}
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
};

export default PublicLayout;
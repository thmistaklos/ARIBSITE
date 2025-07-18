import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import ParticleBackground from '@/components/ParticleBackground';
import AccordionSection from '@/components/AccordionSection';
import FloatingStats from '@/components/FloatingStats';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(100vh-160px)] flex flex-col items-center bg-dairy-cream text-dairy-text relative overflow-hidden"
    >
      <ParticleBackground />
      <FloatingStats />

      {/* New Hero Section */}
      <section className="header w-full h-[calc(100vh-160px)] flex items-center justify-center text-center relative z-10">
        <div className="title-wrapper">
          <span className="top-title"></span>
          <h1 className="sweet-title">
            <span data-text="Freshness">Freshness</span>
            <span data-text="in Every Drop">in Every Drop</span>
          </h1>
          <span className="bottom-title"></span>
          <p className="text-xl md:text-2xl mt-4 text-white drop-shadow-md font-exo">
            Experience the pure taste of nature with ARIB DAIRY, bringing you the finest dairy products.
          </p>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="w-full relative z-10 py-12">
        <ProductGallery />
      </section>

      {/* Recipes Section */}
      <RecipesSection />

      {/* Facts Section */}
      <FactsSection />

      {/* FAQ Accordion Section */}
      <AccordionSection />
    </motion.div>
  );
};

export default HomePage;
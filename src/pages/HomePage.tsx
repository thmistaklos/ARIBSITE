import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import ParticleBackground from '@/components/ParticleBackground';
import AccordionSection from '@/components/AccordionSection';
import FloatingStats from '@/components/FloatingStats';
import BeerSlider from '@/components/BeerSlider'; // Import the new BeerSlider component

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

      {/* Beer Slider Section */}
      <section className="w-full relative z-10">
        <BeerSlider start={30} /> {/* You can adjust the start value here */}
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
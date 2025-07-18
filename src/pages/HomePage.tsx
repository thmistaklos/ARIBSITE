"use client";
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
      className="min-h-[calc(100vh-160px)] flex flex-col items-center relative overflow-hidden" /* Removed bg-dairy-cream here */
    >
      <ParticleBackground />
      <FloatingStats />

      {/* Hero Section with image background and section-bubble1 */}
      <section
        className="header w-full h-[calc(100vh-160px)] flex items-center justify-center text-center relative z-10 bg-cover bg-center section-bubble section-bubble1"
        style={{ backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(9).jpg')` }}
      >
        <div className="absolute inset-0 bg-dairy-darkBlue/60"></div> {/* Overlay for text readability */}
        <div className="title-wrapper relative z-10">
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

      {/* Product Gallery Section with section-bubble2 */}
      <section className="w-full relative z-10 py-8 section-bubble section-bubble2"> {/* Changed py-12 to py-8 */}
        <ProductGallery />
      </section>

      {/* Recipes Section with section-bubble3 */}
      <RecipesSection className="section-bubble section-bubble3" /> {/* Added className prop */}

      {/* Facts Section with section-bubble4 */}
      <section
        className="w-full relative z-10 py-10 px-4 bg-cover bg-center bg-no-repeat section-bubble section-bubble4" {/* Changed py-20 to py-10 */}
        style={{
          backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-dairy-darkBlue/70"></div>
        <FactsSection /> {/* FactsSection content is already inside this section */}
      </section>

      {/* FAQ Accordion Section with section-bubble5 */}
      <AccordionSection className="section-bubble section-bubble5" /> {/* Added className prop */}
    </motion.div>
  );
};

export default HomePage;
import React from 'react';
import { motion } from 'framer-motion'; // Keep motion for other sections
import { useTranslation } from 'react-i18next'; // Keep useTranslation for other sections

import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import AccordionSection from '@/components/AccordionSection';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingFlyer from '@/components/FloatingFlyer';
import DiscountPopup from '@/components/DiscountPopup';
import HeroCarousel from '@/components/HeroCarousel'; // Import the new component

const HomePage: React.FC = () => {
  // useTranslation is still needed for other sections, so keep it
  // const { t } = useTranslation(); 
  // currentTextIndex and useEffect for hero text are now in HeroCarousel

  return (
    <div className="relative min-h-screen bg-dairy-cream text-dairy-text overflow-hidden">
      <ParticleBackground />

      {/* Hero Section - Now using HeroCarousel */}
      <HeroCarousel />

      {/* Product Gallery Section */}
      <section className="w-full py-12 px-4 bg-dairy-cream">
        <ProductGallery />
      </section>

      {/* Recipes Section */}
      <section className="w-full py-12 px-4 bg-dairy-cream">
        <RecipesSection />
      </section>

      {/* Facts Section */}
      <section
        className="w-full py-20 px-4 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg')` }}
      >
        {/* Optional: Add an overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <FactsSection />
      </section>

      {/* FAQ Section */}
      <section className="relative z-20 overflow-hidden pb-8 pt-10 lg:pb-[90px] lg:pt-[120px] bg-dairy-cream text-dairy-text">
        <AccordionSection />
      </section>

      {/* Floating Flyer */}
      <FloatingFlyer />

      {/* Discount Popup */}
      <DiscountPopup />
    </div>
  );
};

export default HomePage;
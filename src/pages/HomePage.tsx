import React from 'react';
import { useTranslation } from 'react-i18next';

import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import AccordionSection from '@/components/AccordionSection';
import ParticleBackground from '@/components/ParticleBackground';
import HeroCarousel from '@/components/HeroCarousel';
import ImageSliderSection from '@/components/ImageSliderSection';
import DiscountPopup from '@/components/DiscountPopup';
import FarmInfoSection from '@/components/FarmInfoSection';
import BlogSection from '@/components/BlogSection'; // Import the new section

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-dairy-cream text-dairy-text overflow-hidden">
      <DiscountPopup />
      <ParticleBackground />

      {/* Hero Section - Now using HeroCarousel */}
      <HeroCarousel />

      {/* Product Gallery Section */}
      <section className="w-full py-12 px-4 bg-dairy-cream">
        <ProductGallery />
      </section>

      {/* Farm Info Section */}
      <FarmInfoSection />

      {/* Recipes Section */}
      <section className="w-full py-12 px-4 bg-dairy-cream">
        <RecipesSection />
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Image Slider Section */}
      <ImageSliderSection />

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
    </div>
  );
};

export default HomePage;
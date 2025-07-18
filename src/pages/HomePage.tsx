import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link

import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import AccordionSection from '@/components/AccordionSection';
import ParticleBackground from '@/components/ParticleBackground';
import AnimatedButton from '@/components/AnimatedButton'; // Import AnimatedButton

// Define the hero texts
const heroTexts = [
  { title: "From Our Farms to Your Table", subtitle: "Pure, Fresh, and Healthy." },
  { title: "Experience Dairy the Way Nature Intended", subtitle: "Fresh, Pure, Local." },
  { title: "Quality You Can Taste", subtitle: "Fresh Dairy Products Every Day." },
  { title: "Wholesome Goodness", subtitle: "In Every Sip and Bite." },
  { title: "Bringing You the Freshest Dairy", subtitle: "Straight from ARIB." },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroTexts[currentTextIndex];

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="relative min-h-screen bg-dairy-cream text-dairy-text overflow-hidden">
      <ParticleBackground />

      {/* New Hero Section */}
      <section
        className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] bg-cover bg-center bg-no-repeat text-white overflow-hidden px-4 py-20"
        style={{ backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(9).jpg')` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="container mx-auto text-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTextIndex} // Key is important for AnimatePresence to detect changes
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white font-exo uppercase tracking-wide">
                {currentHero.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                {currentHero.subtitle}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link to="/products">
                  <AnimatedButton
                    className="bg-dairy-blue text-white hover:bg-dairy-darkBlue px-8 py-3 text-lg"
                    soundOnClick="/sounds/click.mp3"
                  >
                    {t('explore_products')}
                  </AnimatedButton>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

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
    </div>
  );
};

export default HomePage;
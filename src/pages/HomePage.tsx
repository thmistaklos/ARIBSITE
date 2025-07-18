import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// import { supabase } from '@/lib/supabase'; // No longer needed for hero content
// import { Loader2 } from 'lucide-react'; // No longer needed for hero content
// import { toast } from 'sonner'; // No longer needed for hero content

import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import AccordionSection from '@/components/AccordionSection';
import ParticleBackground from '@/components/ParticleBackground';

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

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] bg-dairy-blue text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTextIndex} // Key is important for AnimatePresence to detect changes
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              className="title-wrapper"
            >
              <span className="top-title">{t('welcome_to')}</span>
              <h1 className="sweet-title">
                <span data-text={currentHero.title}>
                  {currentHero.title}
                </span>
              </h1>
              <span className="bottom-title">{currentHero.subtitle}</span>
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
      <section className="w-full py-20 px-4 bg-dairy-darkBlue text-white">
        <FactsSection />
      </section>

      {/* FAQ Section */}
      <section className="relative z-20 overflow-hidden pb-8 pt-10 lg:pb-[90px] lg:pt-[120px] bg-gray-800 text-white">
        <AccordionSection />
      </section>
    </div>
  );
};

export default HomePage;
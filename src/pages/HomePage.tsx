import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import ParticleBackground from '@/components/ParticleBackground';
import AccordionSection from '@/components/AccordionSection';
import FloatingStats from '@/components/FloatingStats';
import AnimatedButton from '@/components/AnimatedButton'; // Ensure AnimatedButton is imported
import { Link } from 'react-router-dom'; // Ensure Link is imported

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

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.2 } },
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

      {/* Static Hero Section */}
      <section
        className="relative w-full h-[calc(100vh-160px)] overflow-hidden flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(9).jpg')` }}
      >
        <div className="absolute inset-0 bg-dairy-darkBlue/60"></div> {/* Overlay for text readability */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1 variants={textVariants} initial="hidden" animate="visible" className="text-5xl md:text-7xl font-bold mb-6 text-dairy-cream leading-tight drop-shadow-lg">
            {t('freshness_in_every_drop')}
          </motion.h1>
          <motion.p variants={textVariants} initial="hidden" animate="visible" className="text-xl md:text-2xl mb-8 text-dairy-cream drop-shadow-md">
            {t('experience_pure_taste')}
          </motion.p>
          <motion.div variants={textVariants} initial="hidden" animate="visible">
            <Link to="/products">
              <AnimatedButton
                size="lg"
                className="bg-transparent text-cyan-glow border-2 border-cyan-glow rounded-md font-bold text-base shadow-glow transition-all duration-300 ease-in-out hover:bg-cyan-glow hover:text-black hover:shadow-hover-glow px-6 py-3"
                soundOnClick="/sounds/click.mp3"
              >
                {t('explore_products')}
              </AnimatedButton>
            </Link>
          </motion.div>
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
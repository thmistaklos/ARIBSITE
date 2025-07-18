import React from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/AnimatedButton';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import ParticleBackground from '@/components/ParticleBackground';
import AccordionSection from '@/components/AccordionSection';
import FloatingStats from '@/components/FloatingStats'; // Import the new component

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

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(100vh-160px)] flex flex-col items-center bg-dairy-cream text-dairy-text py-12 px-4 relative overflow-hidden"
    >
      <ParticleBackground />
      <FloatingStats /> {/* Add the FloatingStats component here */}

      <section className="text-center max-w-4xl mx-auto mb-12 relative z-10">
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 text-dairy-darkBlue leading-tight">
          {t('freshness_in_every_drop')}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 text-dairy-text">
          {t('experience_pure_taste')}
        </motion.p>
        <motion.div variants={itemVariants}>
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
      </section>

      {/* Product Gallery Section */}
      <section className="w-full relative z-10">
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
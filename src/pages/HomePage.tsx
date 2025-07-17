import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/AnimatedButton';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import ParticleBackground from '@/components/ParticleBackground';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SiteContentData {
  homepage_hero_title: string;
  homepage_hero_subtitle: string;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [heroContent, setHeroContent] = useState<SiteContentData | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      setLoadingContent(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content_data')
        .eq('section_name', 'homepage_hero')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        toast.error('Failed to load homepage content', { description: error.message });
        setHeroContent(null);
      } else if (data) {
        setHeroContent(data.content_data as SiteContentData);
      } else {
        // Fallback to default translations if no content is found in DB
        setHeroContent({
          homepage_hero_title: t('freshness_in_every_drop'),
          homepage_hero_subtitle: t('experience_pure_taste'),
        });
      }
      setLoadingContent(false);
    };

    fetchHeroContent();
  }, [t]);

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

      <section className="text-center max-w-4xl mx-auto mb-12 relative z-10">
        {loadingContent ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
          </div>
        ) : (
          <>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 text-dairy-darkBlue leading-tight">
              {heroContent?.homepage_hero_title}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 text-dairy-text">
              {heroContent?.homepage_hero_subtitle}
            </motion.p>
          </>
        )}
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
    </motion.div>
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import AccordionSection from '@/components/AccordionSection';
import ParticleBackground from '@/components/ParticleBackground';

interface HomePageContent {
  homepage_hero_title: string;
  homepage_hero_subtitle: string;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [heroContent, setHeroContent] = useState<HomePageContent | null>(null);
  const [loadingHero, setLoadingHero] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      setLoadingHero(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content_data')
        .eq('section_name', 'homepage_hero')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        toast.error('Failed to load homepage hero content', { description: error.message });
      } else if (data) {
        setHeroContent(data.content_data as HomePageContent);
      } else {
        // Fallback to default content if not found
        setHeroContent({
          homepage_hero_title: t('arib_dairy_brand'),
          homepage_hero_subtitle: t('fresh_delicious_dairy'),
        });
      }
      setLoadingHero(false);
    };

    fetchHeroContent();
  }, [t]);

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen bg-dairy-cream text-dairy-text overflow-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] bg-dairy-blue text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          {loadingHero ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="title-wrapper"
            >
              <span className="top-title">{t('welcome_to')}</span>
              <h1 className="sweet-title">
                <span data-text={heroContent?.homepage_hero_title || t('arib_dairy_brand')}>
                  {heroContent?.homepage_hero_title || t('arib_dairy_brand')}
                </span>
              </h1>
              <span className="bottom-title">{heroContent?.homepage_hero_subtitle || t('fresh_delicious_dairy')}</span>
            </motion.div>
          )}
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
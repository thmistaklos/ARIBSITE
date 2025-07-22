import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface HeroItem {
  id: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  subtitle_fr: string;
  image_url: string;
}

const HeroCarousel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeroItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_carousel_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        toast.error('Failed to load hero content', { description: error.message });
      } else {
        setHeroItems(data || []);
      }
      setLoading(false);
    };
    fetchHeroItems();
  }, []);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const getLocalizedText = (item: HeroItem, field: 'title' | 'subtitle') => {
    const lang = i18n.language;
    if (lang === 'ar') return item[`${field}_ar`] || item[`${field}_en`];
    if (lang === 'fr') return item[`${field}_fr`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  if (loading) {
    return (
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-dairy-blue/10">
        <Loader2 className="h-12 w-12 animate-spin text-dairy-blue" />
      </section>
    );
  }

  if (heroItems.length === 0) {
    return (
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-gray-200 text-gray-600">
        <p>No hero content available. Please add slides in the admin panel.</p>
      </section>
    );
  }

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-white px-4 py-20">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroItems[currentIndex].image_url})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={textVariants}
            className="space-y-4 mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white font-exo uppercase tracking-wide">
              {getLocalizedText(heroItems[currentIndex], 'title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
              {getLocalizedText(heroItems[currentIndex], 'subtitle')}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link to="/products">
            <AnimatedButton className="bg-dairy-blue text-white hover:bg-dairy-darkBlue px-8 py-3 text-lg">
              {t('explore_products')}
            </AnimatedButton>
          </Link>
        </motion.div>

        <div className="flex justify-center mt-6 space-x-2">
          {heroItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-dairy-blue' : 'bg-white/50 hover:bg-white/70'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
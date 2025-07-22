import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const getLocalizedText = (item: HeroItem, field: 'title' | 'subtitle') => {
    if (!item) return '';
    const lang = i18n.language;
    if (lang === 'ar') return item[`${field}_ar`] || item[`${field}_en`];
    if (lang === 'fr') return item[`${field}_fr`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? heroItems.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, heroItems.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === heroItems.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, heroItems.length]);

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
    if (heroItems.length === 0 || loading) return;
    const timer = setTimeout(goToNext, 5000); // Auto-advance every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, heroItems.length, loading, goToNext]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  if (loading) {
    return (
      <section className="relative z-10 flex items-center justify-center h-screen bg-dairy-blue/10">
        <Loader2 className="h-12 w-12 animate-spin text-dairy-blue" />
      </section>
    );
  }

  if (heroItems.length === 0) {
    return (
      <section className="relative z-10 flex items-center justify-center h-screen bg-gray-200 text-gray-600">
        <p>No hero content available. Please add slides in the admin panel.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroItems[currentIndex].image_url})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
      
      <div className="relative z-20 flex flex-col items-center justify-center h-full container mx-auto text-center px-4">
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
      </div>

      {/* Navigation Controls */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-dairy-blue' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
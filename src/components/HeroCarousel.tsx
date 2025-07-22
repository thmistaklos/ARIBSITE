import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';

const heroItems = [
  { 
    titleKey: "hero_title_1", 
    subtitleKey: "hero_subtitle_1",
    imageUrl: "https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg"
  },
  { 
    titleKey: "hero_title_2", 
    subtitleKey: "hero_subtitle_2",
    imageUrl: "https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(9).jpg"
  },
  { 
    titleKey: "hero_title_3", 
    subtitleKey: "hero_subtitle_3",
    imageUrl: "https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(6).jpg"
  },
  { 
    titleKey: "hero_title_4", 
    subtitleKey: "hero_subtitle_4",
    imageUrl: "https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(5).jpg"
  },
  { 
    titleKey: "hero_title_5", 
    subtitleKey: "hero_subtitle_5",
    imageUrl: "https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg"
  },
];

const HeroCarousel: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  const currentHeroItem = heroItems[currentIndex];

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-white overflow-hidden px-4 py-20">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentHeroItem.imageUrl})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      
      {/* Overlay */}
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
              {t(currentHeroItem.titleKey)}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
              {t(currentHeroItem.subtitleKey)}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Button */}
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

        {/* Navigation Dots */}
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
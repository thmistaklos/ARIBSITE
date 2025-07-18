import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '@/components/AnimatedButton';

interface Slide {
  id: number;
  imageUrl: string;
  altText: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg',
    altText: 'Fresh milk production',
  },
  {
    id: 2,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(1).jpg',
    altText: 'Healthy dairy products',
  },
  {
    id: 3,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(2).jpg',
    altText: 'Sustainable farming practices',
  },
  {
    id: 4,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(9).jpg',
    altText: 'Dairy farm landscape',
  },
  {
    id: 5,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(8).jpg',
    altText: 'Milk pouring',
  },
  {
    id: 6,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(7).jpg',
    altText: 'Cheese production',
  },
  {
    id: 7,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(6).jpg',
    altText: 'Yogurt and fruits',
  },
  {
    id: 8,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(5).jpg',
    altText: 'Dairy products display',
  },
  {
    id: 9,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(4).jpg',
    altText: 'Fresh butter',
  },
  {
    id: 10,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(3).jpg',
    altText: 'Glass of milk',
  },
  {
    id: 11,
    imageUrl: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(2).jpg',
    altText: 'Dairy cow in field',
  },
];

const HeroSlider: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[currentSlideIndex];

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.2 } },
  };

  return (
    <section className="relative w-full h-[calc(100vh-160px)] overflow-hidden flex items-center justify-center text-center">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-dairy-darkBlue/60"></div> {/* Overlay for text readability */}
        </motion.div>
      </AnimatePresence>

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
  );
};

export default HeroSlider;
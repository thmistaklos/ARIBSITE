import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight, Milk } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  }, [heroItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

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
    const timer = setTimeout(goToNext, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, heroItems.length, loading, goToNext]);

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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Images */}
      {heroItems.map((item, index) => (
        <img
          key={item.id}
          src={item.image_url}
          alt={`Slide ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Hero Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 text-white px-4">
        <h1 className="font-bold text-4xl md:text-6xl">
          {getLocalizedText(heroItems[currentIndex], 'title')}
        </h1>
        <p className="mt-4 text-lg md:text-2xl">
          {getLocalizedText(heroItems[currentIndex], 'subtitle')}
        </p>

        {/* Explore Button */}
        <Link to="/products" className="mt-6">
          <button className="c-button c-button--gooey flex items-center gap-2">
            <Milk className="w-5 h-5" />
            DISCOVER OUR PRODUCTS
            <div className="c-button__blobs">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </Link>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Gooey Filter SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'block', height: 0, width: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default HeroCarousel;
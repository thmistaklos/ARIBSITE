import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '@/components/AnimatedButton';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Import supabase
import { toast } from 'sonner'; // Import toast for notifications

interface Discount {
  id: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  subtitle_fr: string;
  price_text_en: string;
  price_text_ar: string;
  price_text_fr: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
}

const DiscountBanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveDiscount = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('is_active', true)
        .single(); // Fetch only the single active discount

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
        toast.error('Failed to load discount banner', { description: error.message });
        setActiveDiscount(null);
      } else if (data) {
        setActiveDiscount(data);
      } else {
        setActiveDiscount(null); // No active discount found
      }
      setLoading(false);
    };

    fetchActiveDiscount();
  }, []);

  const getLocalizedText = (discount: Discount, keyPrefix: string) => {
    const lang = i18n.language;
    if (lang === 'ar') return (discount as any)[`${keyPrefix}_ar`] || (discount as any)[`${keyPrefix}_en`];
    if (lang === 'fr') return (discount as any)[`${keyPrefix}_fr`] || (discount as any)[`${keyPrefix}_en`];
    return (discount as any)[`${keyPrefix}_en`];
  };

  const bannerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 } },
  };

  const discountVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.5 } },
  };

  const offBadgeVariants = {
    hidden: { opacity: 0, rotate: -90 },
    visible: { opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 150, damping: 10, delay: 0.7 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px] md:h-[400px] lg:h-[500px] bg-dairy-cream">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (!activeDiscount) {
    return null; // Don't render the banner if no active discount is found
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={bannerVariants}
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-end pr-4 md:pr-12 lg:pr-24 overflow-hidden"
      style={{
        backgroundImage: `url('${activeDiscount.image_url || 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//back.jpg'}')`, // Use fetched image or fallback
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 text-right text-white space-y-2 md:space-y-4">
        <motion.h2
          variants={textVariants}
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight"
        >
          {getLocalizedText(activeDiscount, 'title')}
        </motion.h2>
        <motion.p
          variants={discountVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold relative inline-block"
        >
          {getLocalizedText(activeDiscount, 'price_text')}
          <motion.span
            variants={offBadgeVariants}
            className="absolute -top-4 -right-8 md:-top-6 md:-right-10 lg:-top-8 lg:-right-12 bg-white text-green-600 text-xs md:text-sm font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12"
            style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
          >
            {t('banner_off')}
          </motion.span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-6"
        >
          <Link to={activeDiscount.link_url || '/products'}>
            <AnimatedButton className="bg-green-500 text-white hover:bg-green-600 px-6 py-3 text-lg rounded-full shadow-lg">
              {t('shop_now')}
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DiscountBanner;
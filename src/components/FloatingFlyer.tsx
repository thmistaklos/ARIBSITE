import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

const FloatingFlyer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveDiscount = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        toast.error('Failed to load discount flyer', { description: error.message });
        setActiveDiscount(null);
      } else if (data) {
        setActiveDiscount(data);
        // Only show if it hasn't been explicitly closed for this specific discount
        const hasBeenClosed = localStorage.getItem(`floatingFlyerClosed_${data.id}`);
        if (!hasBeenClosed) {
          setIsVisible(true);
        }
      } else {
        setActiveDiscount(null);
        setIsVisible(false);
      }
      setLoading(false);
    };

    fetchActiveDiscount();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (activeDiscount) {
      localStorage.setItem(`floatingFlyerClosed_${activeDiscount.id}`, 'true'); // Mark as closed for this specific discount
    }
  };

  const getLocalizedText = (discount: Discount, keyPrefix: string) => {
    const lang = i18n.language;
    if (lang === 'ar') return (discount as any)[`${keyPrefix}_ar`] || (discount as any)[`${keyPrefix}_en`];
    if (lang === 'fr') return (discount as any)[`${keyPrefix}_fr`] || (discount as any)[`${keyPrefix}_en`];
    return (discount as any)[`${keyPrefix}_en`];
  };

  const flyerVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    exit: { opacity: 0, y: 100, scale: 0.8, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  if (loading) {
    return null; // Or a small loading indicator if desired
  }

  if (!activeDiscount || !isVisible) {
    return null; // Don't render if no active discount or if it's closed
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={flyerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-xl shadow-xl border-2 border-dairy-blue/20 overflow-hidden p-4 md:p-6"
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-dairy-darkBlue hover:text-dairy-blue transition-colors z-10"
            aria-label="Close flyer"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
            {/* Right Image (comes first on small screens due to flex-col-reverse) */}
            <div className="relative md:w-1/2 flex-shrink-0 flex items-center justify-center">
              {activeDiscount.image_url && (
                <img
                  src={activeDiscount.image_url}
                  alt={activeDiscount.title_en}
                  className="max-w-[200px] md:max-w-full h-auto object-contain mx-auto"
                />
              )}
            </div>

            {/* Left Content */}
            <div className="relative z-20 flex flex-col items-center md:items-start md:w-1/2 flex-grow text-center md:text-left">
              <span className="w-16 h-1 mb-4 bg-dairy-darkBlue mx-auto md:mx-0"></span>
              
              <h1 className="flex flex-col text-4xl sm:text-5xl font-extrabold leading-none text-dairy-darkBlue uppercase font-exo">
                {getLocalizedText(activeDiscount, 'title')}
                <span className="text-3xl sm:text-4xl">
                  {getLocalizedText(activeDiscount, 'subtitle')}
                </span>
              </h1>
              
              <p className="text-lg text-dairy-text mt-2">
                {getLocalizedText(activeDiscount, 'price_text')}
              </p>

              <p className="mt-4 text-base font-semibold text-dairy-blue">
                {t('visit_us_text')}
              </p>

              <div className="flex flex-col sm:flex-row mt-6 gap-3 justify-center md:justify-start">
                <a href={activeDiscount.link_url || '/products'} className="w-full sm:w-auto">
                  <AnimatedButton className="w-full bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
                    {t('buy_now')}
                  </AnimatedButton>
                </a>
                <a href={activeDiscount.link_url || '/products'} className="w-full sm:w-auto">
                  <AnimatedButton variant="outline" className="w-full text-dairy-blue border-dairy-blue hover:bg-dairy-blue hover:text-white" soundOnClick="/sounds/click.mp3">
                    {t('read_more')}
                  </AnimatedButton>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingFlyer;
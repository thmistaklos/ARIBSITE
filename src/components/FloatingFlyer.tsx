import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
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
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="card">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close flyer"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="card-content">
              <h2>{getLocalizedText(activeDiscount, 'title')}</h2>
              <p className="subtitle">{getLocalizedText(activeDiscount, 'subtitle')}</p>
              <p className="price">
                <span className="glow">{getLocalizedText(activeDiscount, 'price_text')}</span>
              </p>
              {activeDiscount.image_url && (
                <img
                  src={activeDiscount.image_url}
                  alt={activeDiscount.title_en}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingFlyer;
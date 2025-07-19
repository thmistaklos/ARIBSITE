import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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

const DiscountPopup: React.FC = () => {
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
        toast.error('Failed to load discount flyer for popup', { description: error.message });
        setActiveDiscount(null);
      } else if (data) {
        setActiveDiscount(data);
        setIsVisible(true); // Show popup immediately if active discount found
      } else {
        setActiveDiscount(null);
        setIsVisible(false);
      }
      setLoading(false);
    };

    fetchActiveDiscount();
  }, []); // Run once on mount

  const handleClose = () => {
    setIsVisible(false);
  };

  const getLocalizedText = (discount: Discount, keyPrefix: string) => {
    const lang = i18n.language;
    if (lang === 'ar') return (discount as any)[`${keyPrefix}_ar`] || (discount as any)[`${keyPrefix}_en`];
    if (lang === 'fr') return (discount as any)[`${keyPrefix}_fr`] || (discount as any)[`${keyPrefix}_en`];
    return (discount as any)[`${keyPrefix}_en`];
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.7, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.1 } },
    exit: { opacity: 0, scale: 0.7, y: 50, transition: { duration: 0.2, ease: 'easeOut' } },
  };

  if (loading) {
    return null; // Don't render anything while loading
  }

  return (
    <AnimatePresence>
      {isVisible && activeDiscount && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-[9998]" // High z-index
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose} // Close when clicking outside
          />

          {/* Popup */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4" // Even higher z-index
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="card relative" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside card */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Close discount popup"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="card-content">
                <h2>{getLocalizedText(activeDiscount, 'title')}</h2>
                <p className="subtitle">{getLocalizedText(activeDiscount, 'subtitle')}</p>
                <p className="price">
                  <span className="glow">{getLocalizedText(activeDiscount, 'price_text')}</span>
                </p>
              </div>
              {activeDiscount.image_url && (
                <div className="image-wrapper">
                  <img
                    src={activeDiscount.image_url}
                    alt={activeDiscount.title_en}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DiscountPopup;
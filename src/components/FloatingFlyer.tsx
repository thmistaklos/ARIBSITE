import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';

const FloatingFlyer: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage if the flyer has been closed before
    const hasBeenClosed = localStorage.getItem('floatingFlyerClosed');
    if (!hasBeenClosed) {
      setIsVisible(true); // Show if it hasn't been explicitly closed
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('floatingFlyerClosed', 'true'); // Mark as closed in local storage
  };

  const flyerVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    exit: { opacity: 0, y: 100, scale: 0.8, transition: { duration: 0.3, ease: 'easeOut' } },
  };

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

          <div className="relative flex flex-col md:flex-row items-center gap-4">
            <div className="relative z-20 flex flex-col text-center md:text-left flex-grow">
              <span className="w-16 h-1 mb-4 bg-dairy-darkBlue mx-auto md:mx-0"></span>
              <h1 className="flex flex-col text-4xl sm:text-5xl font-extrabold leading-none text-dairy-darkBlue uppercase font-exo">
                {t('amir')}
                <span className="text-3xl sm:text-4xl">
                  {t('cheese')}
                </span>
              </h1>
              <p className="text-sm text-dairy-text mt-2">
                {t('best_real_cheese')}<br />
                {t('discount_price')}
              </p>
              <div className="flex flex-col sm:flex-row mt-6 gap-3 justify-center md:justify-start">
                <a href="/products" className="w-full sm:w-auto">
                  <AnimatedButton className="w-full bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
                    {t('buy_now')}
                  </AnimatedButton>
                </a>
                <a href="/products" className="w-full sm:w-auto">
                  <AnimatedButton variant="outline" className="w-full text-dairy-blue border-dairy-blue hover:bg-dairy-blue hover:text-white" soundOnClick="/sounds/click.mp3">
                    {t('read_more')}
                  </AnimatedButton>
                </a>
              </div>
            </div>
            <div className="relative hidden md:block md:w-1/3 lg:w-2/5 flex-shrink-0">
              <img
                src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//WhatsApp_Image_2025-07-19_at_18.14.32_93c96c99-removebg-preview.png"
                alt={t('amir_cheese')}
                className="max-w-[150px] md:max-w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingFlyer;
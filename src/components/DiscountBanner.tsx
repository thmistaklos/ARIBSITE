import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '@/components/AnimatedButton';
import { Link } from 'react-router-dom';

const DiscountBanner: React.FC = () => {
  const { t } = useTranslation();

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

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={bannerVariants}
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-end pr-4 md:pr-12 lg:pr-24 overflow-hidden"
      style={{
        backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//2025-07-20_172357.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 text-right text-white space-y-2 md:space-y-4">
        <motion.h2
          variants={textVariants}
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight"
        >
          {t('banner_title')}
        </motion.h2>
        <motion.p
          variants={discountVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold relative inline-block"
        >
          {t('banner_discount')}
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
          <Link to="/products">
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
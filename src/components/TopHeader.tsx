import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TopHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="sticky top-0 z-50 w-full bg-dairy-cream/90 backdrop-blur-sm border-b border-dairy-blue/20 shadow-sm h-16 flex items-center justify-center px-4 md:px-6"
    >
      <Link to="/" className="flex items-center space-x-2">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <img src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//0222-removebg-preview%20(1).png" alt="ARIB DAIRY Logo" className="h-10 w-10 object-contain" />
        </motion.div>
        <span className="text-2xl font-bold text-dairy-darkBlue">{t('arib_dairy')}</span>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <img
            src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//ChatGPT_Image_Jul_17__2025__10_17_07_PM-removebg-preview.png"
            alt="New Logo"
            className="h-14 w-14 object-contain ml-2"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default TopHeader;
"use client";

import React from 'react';
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
      <h1 className="text-2xl font-bold text-dairy-darkBlue">{t('arib_dairy')}</h1>
    </motion.div>
  );
};

export default TopHeader;
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FloatingStats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-20 right-4 z-50 p-4 bg-white rounded-lg shadow-lg border-2 border-dairy-blue/20 text-dairy-darkBlue md:top-24 md:right-6"
    >
      <div className="flex flex-col items-start">
        <div className="text-sm font-medium text-dairy-text">{t('total_page_views')}</div>
        <div className="text-2xl font-bold text-dairy-darkBlue">89,400</div>
        <div className="text-xs text-muted-foreground mt-1">{t('views_increase')}</div>
      </div>
    </motion.div>
  );
};

export default FloatingStats;
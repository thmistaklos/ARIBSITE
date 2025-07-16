import React from 'react';
import { motion } from 'framer-motion';
import { Milk, Factory, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 10, delay: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      className="min-h-[calc(100vh-160px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto max-w-3xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('our_story')}
        </motion.h1>

        <motion.section variants={sectionVariants} className="mb-12 p-6 bg-white rounded-xl shadow-md border border-dairy-blue/20">
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <Milk className="h-16 w-16 text-dairy-blue" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-dairy-darkBlue mb-4 text-center">{t('from_our_farms')}</h2>
          <p className="text-lg leading-relaxed text-center">
            {t('from_our_farms_desc')}
          </p>
        </motion.section>

        <motion.section variants={sectionVariants} className="mb-12 p-6 bg-white rounded-xl shadow-md border border-dairy-blue/20">
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <Factory className="h-16 w-16 text-dairy-blue" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-dairy-darkBlue mb-4 text-center">{t('quality_you_can_taste')}</h2>
          <p className="text-lg leading-relaxed text-center">
            {t('quality_you_can_taste_desc')}
          </p>
        </motion.section>

        <motion.section variants={sectionVariants} className="p-6 bg-white rounded-xl shadow-md border border-dairy-blue/20">
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-dairy-blue" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-dairy-darkBlue mb-4 text-center">{t('committed_to_community')}</h2>
          <p className="text-lg leading-relaxed text-center">
            {t('committed_to_community_desc')}
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutPage;
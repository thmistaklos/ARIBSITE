import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Milk, Leaf, Sprout, Wheat, Award } from 'lucide-react'; // Importing relevant icons

const FarmInfoSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Leaf,
      titleKey: 'organic_non_gmo_title',
      descriptionKey: 'organic_non_gmo_desc',
    },
    {
      icon: Award,
      titleKey: 'best_dairy_products_title',
      descriptionKey: 'best_dairy_products_desc',
    },
    {
      icon: Sprout,
      titleKey: 'healthy_nutritious_title',
      descriptionKey: 'healthy_nutritious_desc',
    },
    {
      icon: Wheat,
      titleKey: 'acres_of_pasture_title',
      descriptionKey: 'acres_of_pasture_desc',
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="w-full py-16 px-4 bg-white text-dairy-text"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Left Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:w-1/2 flex justify-center lg:justify-start"
        >
          <img
            src="https://labartisan.net/demo/gowala/assets/images/about/home-4/01.png"
            alt="Dairy Products"
            className="max-w-full h-auto object-contain"
          />
        </motion.div>

        {/* Right Content Section */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-dairy-darkBlue mb-4"
          >
            {t('natural_taste_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-dairy-text mb-8 max-w-xl"
          >
            {t('natural_taste_subtitle')}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <feature.icon className="h-8 w-8 text-dairy-blue flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-dairy-darkBlue mb-1">{t(feature.titleKey)}</h3>
                  <p className="text-dairy-text text-sm">{t(feature.descriptionKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FarmInfoSection;
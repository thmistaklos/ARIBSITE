import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Leaf, Award, Heart, Droplet, LucideIcon } from 'lucide-react';

// A map of icon names to their corresponding Lucide React components
const FarmInfoIcons: { [key: string]: LucideIcon } = {
  Leaf,
  Award,
  Heart,
  Droplet,
};

interface FactItemProps {
  iconName: string;
  title: string;
  description: string;
}

const FactItem: React.FC<FactItemProps> = ({ iconName, title, description }) => {
  const IconComponent = FarmInfoIcons[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in FarmInfoIcons map. Using a placeholder.`);
    return (
      <motion.div
        className="flex items-start space-x-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex-shrink-0 p-3 rounded-full bg-dairy-blue/10 text-dairy-blue">
          <span className="h-6 w-6 flex items-center justify-center text-red-500">?</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-dairy-darkBlue mb-1">{title}</h3>
          <p className="text-dairy-text text-sm">{description}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex-shrink-0 p-3 rounded-full bg-dairy-blue/10 text-dairy-blue">
        <IconComponent className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-dairy-darkBlue mb-1">{title}</h3>
        <p className="text-dairy-text text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const FarmInfoSection: React.FC = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const factItemsData = [
    {
      iconName: 'Leaf',
      titleKey: 'farm_fact1_title',
      descriptionKey: 'farm_fact1_description',
    },
    {
      iconName: 'Award',
      titleKey: 'farm_fact2_title',
      descriptionKey: 'farm_fact2_description',
    },
    {
      iconName: 'Heart',
      titleKey: 'farm_fact3_title',
      descriptionKey: 'farm_fact3_description',
    },
    {
      iconName: 'Droplet',
      titleKey: 'farm_fact4_title',
      descriptionKey: 'farm_fact4_description',
    },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-16 px-4 bg-white text-dairy-text"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12 max-w-6xl">
        <motion.div
          className="lg:w-1/2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img
            src="https://labartisan.net/demo/gowala/assets/images/about/home-4/01.png"
            alt="ARIB Dairy Products"
            className="max-w-full h-auto object-contain rounded-lg"
            style={{ maxHeight: '500px' }}
          />
        </motion.div>

        <motion.div
          className="lg:w-1/2 text-center lg:text-left space-y-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dairy-darkBlue leading-tight">
            {t('farm_info_title')}
          </h2>
          <p className="text-lg text-dairy-text max-w-xl lg:mx-0 mx-auto">
            {t('farm_info_description')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {factItemsData.map((fact, index) => (
              <FactItem
                key={index}
                iconName={fact.iconName}
                title={t(fact.titleKey)}
                description={t(fact.descriptionKey)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FarmInfoSection;
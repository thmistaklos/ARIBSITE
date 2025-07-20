import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LucideIcons } from '@/utils/lucide-icons';

interface FactItemData {
  iconName: string;
  title_en: string;
  description_en: string;
  title_ar: string;
  description_ar: string;
  title_fr: string;
  description_fr: string;
}

interface FactItemProps {
  iconName: string;
  title: string;
  description: string;
}

const FactItem: React.FC<FactItemProps> = ({ iconName, title, description }) => {
  const IconComponent = LucideIcons[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in LucideIcons map. Using a placeholder.`);
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

interface FarmInfoSectionProps {
  title_en: string;
  title_ar: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  subtitle_fr: string;
  facts: FactItemData[];
}

const FarmInfoSection: React.FC<FarmInfoSectionProps> = ({
  title_en,
  title_ar,
  title_fr,
  subtitle_en,
  subtitle_ar,
  subtitle_fr,
  facts,
}) => {
  const { i18n } = useTranslation();

  const getLocalizedText = (en: string, ar: string, fr: string) => {
    const lang = i18n.language;
    if (lang === 'ar') return ar || en;
    if (lang === 'fr') return fr || en;
    return en;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-16 px-4 bg-white text-dairy-text"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
        <motion.div
          className="lg:w-1/2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img
            src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//!!!!.png"
            alt="Dairy Products"
            className="max-w-full h-auto object-contain"
            style={{ maxHeight: '500px' }}
          />
        </motion.div>

        <motion.div
          className="lg:w-1/2 text-center lg:text-left space-y-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dairy-darkBlue leading-tight">
            {getLocalizedText(title_en, title_ar, title_fr)}
          </h2>
          <p className="text-lg text-dairy-text max-w-xl lg:mx-0 mx-auto">
            {getLocalizedText(subtitle_en, subtitle_ar, subtitle_fr)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {facts.map((fact, index) => (
              <FactItem
                key={index}
                iconName={fact.iconName}
                title={getLocalizedText(fact.title_en, fact.title_ar, fact.title_fr)}
                description={getLocalizedText(fact.description_en, fact.description_ar, fact.description_fr)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FarmInfoSection;
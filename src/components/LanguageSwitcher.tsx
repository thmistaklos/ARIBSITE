import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion'; // Import motion
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'; // Set text direction
  };

  const selectVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    hover: { scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
  };

  return (
    <motion.div
      variants={selectVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="inline-block" // Ensures motion.div wraps the select properly
    >
      <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
        <SelectTrigger className="w-[150px] bg-dairy-cream border-2 border-dairy-blue/30 text-dairy-darkBlue font-semibold shadow-sm hover:border-dairy-blue transition-all duration-200">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="bg-dairy-cream border-2 border-dairy-blue/30 text-dairy-darkBlue shadow-lg">
          <SelectItem value="en" className="flex items-center gap-2">
            <span role="img" aria-label="United Kingdom flag">🇬🇧</span> English
          </SelectItem>
          <SelectItem value="ar" className="flex items-center gap-2">
            <span role="img" aria-label="Saudi Arabia flag">🇸🇦</span> العربية
          </SelectItem>
          <SelectItem value="fr" className="flex items-center gap-2">
            <span role="img" aria-label="France flag">🇫🇷</span> Français
          </SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default LanguageSwitcher;
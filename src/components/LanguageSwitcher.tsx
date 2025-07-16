import React from 'react';
import { useTranslation } from 'react-i18next';
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

  return (
    <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
      <SelectTrigger className="w-[120px] bg-dairy-cream border-dairy-blue/30 text-dairy-darkBlue">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-dairy-cream border-dairy-blue/30">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
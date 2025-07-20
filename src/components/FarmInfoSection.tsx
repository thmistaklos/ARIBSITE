import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, LucideIcon } from 'lucide-react'; // Import LucideIcon type
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LucideIcons } from '@/utils/lucide-icons'; // Import the icon map

interface FarmInfoItem {
  id: string;
  icon_name: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  order_index: number;
}

interface SiteContentData {
  homepage_hero_title: string;
  homepage_hero_subtitle: string;
  farm_info_section_title: string;
  farm_info_section_subtitle: string;
}

const FarmInfoSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [farmInfoItems, setFarmInfoItems] = useState<FarmInfoItem[]>([]);
  const [sectionContent, setSectionContent] = useState<SiteContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);


  useEffect(() => {
    const fetchFarmInfoItems = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('farm_info_items').select('*').order('order_index', { ascending: true });
      if (error) {
        toast.error('Failed to load farm info items', { description: error.message });
      } else {
        setFarmInfoItems(data || []);
      }
      setLoading(false);
    };

    const fetchSectionContent = async () => {
      setContentLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content_data')
        .eq('section_name', 'homepage_hero') // Fetch the homepage_hero section which now contains farm info titles
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to load section content', { description: error.message });
        setSectionContent(null);
      } else if (data) {
        setSectionContent(data.content_data as SiteContentData);
      } else {
        setSectionContent(null);
      }
      setContentLoading(false);
    };

    fetchFarmInfoItems();
    fetchSectionContent();
  }, []);

  const getLocalizedText = (item: FarmInfoItem, keyPrefix: 'title' | 'description') => {
    const lang = i18n.language;
    if (lang === 'ar') return (item as any)[`${keyPrefix}_ar`] || (item as any)[`${keyPrefix}_en`];
    if (lang === 'fr') return (item as any)[`${keyPrefix}_fr`] || (item as any)[`${keyPrefix}_en`];
    return (item as any)[`${keyPrefix}_en`];
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading || contentLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

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
            {sectionContent?.farm_info_section_title || t('natural taste title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-dairy-text mb-8 max-w-xl"
          >
            {sectionContent?.farm_info_section_subtitle || t('natural taste subtitle')}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {farmInfoItems.length === 0 ? (
              <div className="md:col-span-2 text-center text-xl text-dairy-text">
                No farm info items available. Please add some from the admin panel.
              </div>
            ) : (
              farmInfoItems.map((item, index) => {
                const IconComponent = LucideIcons[item.icon_name] as LucideIcon; // Cast to LucideIcon
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    {IconComponent ? (
                      <IconComponent className="h-8 w-8 text-dairy-blue flex-shrink-0" />
                    ) : (
                      <div className="h-8 w-8 text-red-500 flex-shrink-0 flex items-center justify-center">?</div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-dairy-darkBlue mb-1">{getLocalizedText(item, 'title')}</h3>
                      <p className="text-dairy-text text-sm">{getLocalizedText(item, 'description')}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FarmInfoSection;
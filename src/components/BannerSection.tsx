import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LucideIcons } from '@/utils/lucide-icons';

interface FeatureItem {
  icon_name: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
}

interface BannerContent {
  banner_image_url: string | null;
  main_title_en: string;
  main_title_ar: string;
  main_title_fr: string;
  main_paragraph_en: string;
  main_paragraph_ar: string;
  main_paragraph_fr: string;
  feature_items: FeatureItem[];
}

const BannerSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [bannerContent, setBannerContent] = useState<BannerContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannerContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('banner_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to load banner content', { description: error.message });
        setBannerContent(null);
      } else if (data) {
        setBannerContent(data);
      } else {
        setBannerContent(null);
      }
      setLoading(false);
    };

    fetchBannerContent();
  }, []);

  const getLocalizedText = (item: any, keyPrefix: string) => {
    const lang = i18n.language;
    if (lang === 'ar') return item[`${keyPrefix}_ar`] || item[`${keyPrefix}_en`];
    if (lang === 'fr') return item[`${keyPrefix}_fr`] || item[`${keyPrefix}_en`];
    return item[`${keyPrefix}_en`];
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (!bannerContent) {
    return (
      <div className="text-center text-xl text-dairy-text py-12">
        No banner content available. Please add it from the admin panel.
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-16 px-4 bg-dairy-cream text-dairy-text"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12 max-w-6xl">
        <motion.div
          className="lg:w-1/2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {bannerContent.banner_image_url ? (
            <img
              src={bannerContent.banner_image_url}
              alt={getLocalizedText(bannerContent, 'main_title')}
              className="max-w-full h-auto object-contain rounded-lg shadow-lg"
              style={{ maxHeight: '500px' }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
              No Image
            </div>
          )}
        </motion.div>

        <motion.div
          className="lg:w-1/2 text-center lg:text-left space-y-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dairy-darkBlue leading-tight">
            {getLocalizedText(bannerContent, 'main_title')}
          </h2>
          <p className="text-lg text-dairy-text max-w-xl lg:mx-0 mx-auto">
            {getLocalizedText(bannerContent, 'main_paragraph')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {bannerContent.feature_items.map((feature, index) => {
              const IconComponent = LucideIcons[feature.icon_name];
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 p-3 rounded-full bg-dairy-blue/10 text-dairy-blue">
                    {IconComponent ? (
                      <IconComponent className="h-6 w-6" />
                    ) : (
                      <span className="h-6 w-6 flex items-center justify-center text-red-500">?</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dairy-darkBlue mb-1">{getLocalizedText(feature, 'title')}</h3>
                    <p className="text-dairy-text text-sm">{getLocalizedText(feature, 'description')}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BannerSection;
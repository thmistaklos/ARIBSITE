import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LucideIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LucideIcons } from '@/utils/lucide-icons';

interface FarmInfoItemData {
  id: string;
  icon_name: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
}

interface SiteContent {
  title_en: string;
  title_ar: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  subtitle_fr: string;
  image_url: string;
}

interface FactItemProps {
  iconName: string;
  title: string;
  description: string;
}

const FactItem: React.FC<FactItemProps> = ({ iconName, title, description }) => {
  const IconComponent = LucideIcons[iconName] as LucideIcon | undefined;
  return (
    <motion.div
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex-shrink-0 p-3 rounded-full bg-dairy-blue/10 text-dairy-blue">
        {IconComponent ? <IconComponent className="h-6 w-6" /> : <span className="h-6 w-6" />}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-dairy-darkBlue mb-1">{title}</h3>
        <p className="text-dairy-text text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const FarmInfoSection: React.FC = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState<FarmInfoItemData[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const [itemsResponse, contentResponse] = await Promise.all([
        supabase.from('farm_info_items').select('*').order('order_index', { ascending: true }),
        supabase.from('site_content').select('content_data').eq('section_name', 'farm_info_content').single(),
      ]);

      if (itemsResponse.error) {
        toast.error('Failed to load farm info items', { description: itemsResponse.error.message });
      } else {
        setItems(itemsResponse.data || []);
      }

      if (contentResponse.error && contentResponse.error.code !== 'PGRST116') {
        toast.error('Failed to load farm info content', { description: contentResponse.error.message });
      } else {
        setContent(contentResponse.data?.content_data || null);
      }

      setLoading(false);
    };
    fetchAllData();
  }, []);

  const getLocalizedItemText = (item: FarmInfoItemData, field: 'title' | 'description') => {
    const lang = i18n.language;
    if (lang === 'ar') return item[`${field}_ar`] || item[`${field}_en`];
    if (lang === 'fr') return item[`${field}_fr`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const getLocalizedContent = (field: 'title' | 'subtitle') => {
    if (!content) return '';
    const lang = i18n.language;
    return content[`${field}_${lang}`] || content[`${field}_en`];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

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
            src={content?.image_url || "https://labartisan.net/demo/gowala/assets/images/about/home-4/01.png"}
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
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-dairy-darkBlue leading-tight">
                {getLocalizedContent('title') || 'Fresh From Our Farm'}
              </h2>
              <p className="text-lg text-dairy-text max-w-xl lg:mx-0 mx-auto">
                {getLocalizedContent('subtitle') || 'Delivering quality and freshness you can taste in every drop.'}
              </p>
            </>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-dairy-blue" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {items.map((item) => (
                <FactItem
                  key={item.id}
                  iconName={item.icon_name}
                  title={getLocalizedItemText(item, 'title')}
                  description={getLocalizedItemText(item, 'description')}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FarmInfoSection;
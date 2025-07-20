import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

import ProductGallery from '@/components/ProductGallery';
import RecipesSection from '@/components/RecipesSection';
import FactsSection from '@/components/FactsSection';
import AccordionSection from '@/components/AccordionSection';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingFlyer from '@/components/FloatingFlyer';
import DiscountPopup from '@/components/DiscountPopup';
import HeroCarousel from '@/components/HeroCarousel';
import ImageSliderSection from '@/components/ImageSliderSection';
import FarmInfoSection from '@/components/FarmInfoSection';

interface SiteContent {
  homepage_hero_title: string;
  homepage_hero_subtitle: string;
  farm_section_title_en: string;
  farm_section_title_ar: string;
  farm_section_title_fr: string;
  farm_section_subtitle_en: string;
  farm_section_subtitle_ar: string;
  farm_section_subtitle_fr: string;
  farm_fact1_icon: string;
  farm_fact1_title_en: string;
  farm_fact1_description_en: string;
  farm_fact1_title_ar: string;
  farm_fact1_description_ar: string;
  farm_fact1_title_fr: string;
  farm_fact1_description_fr: string;
  farm_fact2_icon: string;
  farm_fact2_title_en: string;
  farm_fact2_description_en: string;
  farm_fact2_title_ar: string;
  farm_fact2_description_ar: string;
  farm_fact2_title_fr: string;
  farm_fact2_description_fr: string;
  farm_fact3_icon: string;
  farm_fact3_title_en: string;
  farm_fact3_description_en: string;
  farm_fact3_title_ar: string;
  farm_fact3_description_ar: string;
  farm_fact3_title_fr: string;
  farm_fact3_description_fr: string;
  farm_fact4_icon: string;
  farm_fact4_title_en: string;
  farm_fact4_description_en: string;
  farm_fact4_title_ar: string;
  farm_fact4_description_ar: string;
  farm_fact4_title_fr: string;
  farm_fact4_description_fr: string;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const fetchSiteContent = async () => {
      setLoadingContent(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'homepage_content')
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to load homepage content', { description: error.message });
        setSiteContent(null);
      } else if (data) {
        setSiteContent(data.value as SiteContent);
      } else {
        // Fallback to default values if no content is found in DB
        setSiteContent({
          homepage_hero_title: t('hero_title_1'), // These will be overridden by HeroCarousel's internal logic
          homepage_hero_subtitle: t('hero_subtitle_1'), // These will be overridden by HeroCarousel's internal logic
          farm_section_title_en: 'From Our Farms to Your Table',
          farm_section_title_ar: 'من مزارعنا إلى مائدتك',
          farm_section_title_fr: 'De nos fermes à votre table',
          farm_section_subtitle_en: 'Discover the journey of our dairy products, from the lush green pastures to your home. We are committed to quality, freshness, and sustainable practices.',
          farm_section_subtitle_ar: 'اكتشف رحلة منتجات الألبان لدينا، من المراعي الخضراء المورقة إلى منزلك. نحن ملتزمون بالجودة والنضارة والممارسات المستدامة.',
          farm_section_subtitle_fr: 'Découvrez le parcours de nos produits laitiers, des pâturages verdoyants à votre domicile. Nous nous engageons pour la qualité, la fraîcheur et les pratiques durables.',
          farm_fact1_icon: 'Leaf',
          farm_fact1_title_en: 'Organic Farming',
          farm_fact1_description_en: 'Our cows graze on organic pastures, ensuring pure and natural milk.',
          farm_fact1_title_ar: 'زراعة عضوية',
          farm_fact1_description_ar: 'ترعى أبقارنا في مراعي عضوية، مما يضمن حليبًا نقيًا وطبيعيًا.',
          farm_fact1_title_fr: 'Agriculture Biologique',
          farm_fact1_description_fr: 'Nos vaches paissent dans des pâturages biologiques, garantissant un lait pur et naturel.',
          farm_fact2_icon: 'Award',
          farm_fact2_title_en: 'Award-Winning Dairy',
          farm_fact2_description_en: 'Recognized for excellence in taste and quality across the region.',
          farm_fact2_title_ar: 'ألبان حائزة على جوائز',
          farm_fact2_description_ar: 'معترف بها للتميز في الذوق والجودة في جميع أنحاء المنطقة.',
          farm_fact2_title_fr: 'Produits Laitiers Primés',
          farm_fact2_description_fr: 'Reconnus pour l\'excellence du goût et de la qualité dans toute la région.',
          farm_fact3_icon: 'Heart',
          farm_fact3_title_en: 'Healthy & Nutritious',
          farm_fact3_description_en: 'Packed with essential vitamins and minerals for a healthy lifestyle.',
          farm_fact3_title_ar: 'صحي ومغذي',
          farm_fact3_description_ar: 'مليء بالفيتامينات والمعادن الأساسية لنمط حياة صحي.',
          farm_fact3_title_fr: 'Sain et Nutritif',
          farm_fact3_description_fr: 'Riche en vitamines et minéraux essentiels pour un mode de vie sain.',
          farm_fact4_icon: 'Droplet',
          farm_fact4_title_en: 'Pure Water Source',
          farm_fact4_description_en: 'Our farms utilize pristine natural water sources for irrigation and livestock.',
          farm_fact4_title_ar: 'مصدر مياه نقي',
          farm_fact4_description_ar: 'تستخدم مزارعنا مصادر مياه طبيعية نقية للري والماشية.',
          farm_fact4_title_fr: 'Source d\'Eau Pure',
          farm_fact4_description_fr: 'Nos fermes utilisent des sources d\'eau naturelles pures pour l\'irrigation et le bétail.',
        });
      }
      setLoadingContent(false);
    };

    fetchSiteContent();
  }, [t]); // Re-fetch if translation function changes (unlikely but good practice)

  if (loadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dairy-cream text-dairy-text">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-dairy-darkBlue"
        >
          Loading content...
        </motion.div>
      </div>
    );
  }

  if (!siteContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dairy-cream text-dairy-text">
        <div className="text-center text-xl text-red-500">
          Failed to load homepage content. Please check your Supabase setup.
        </div>
      </div>
    );
  }

  const farmFactsData = [
    {
      iconName: siteContent.farm_fact1_icon,
      title_en: siteContent.farm_fact1_title_en,
      description_en: siteContent.farm_fact1_description_en,
      title_ar: siteContent.farm_fact1_title_ar,
      description_ar: siteContent.farm_fact1_description_ar,
      title_fr: siteContent.farm_fact1_title_fr,
      description_fr: siteContent.farm_fact1_description_fr,
    },
    {
      iconName: siteContent.farm_fact2_icon,
      title_en: siteContent.farm_fact2_title_en,
      description_en: siteContent.farm_fact2_description_en,
      title_ar: siteContent.farm_fact2_title_ar,
      description_ar: siteContent.farm_fact2_description_ar,
      title_fr: siteContent.farm_fact2_title_fr,
      description_fr: siteContent.farm_fact2_description_fr,
    },
    {
      iconName: siteContent.farm_fact3_icon,
      title_en: siteContent.farm_fact3_title_en,
      description_en: siteContent.farm_fact3_description_en,
      title_ar: siteContent.farm_fact3_title_ar,
      description_ar: siteContent.farm_fact3_description_ar,
      title_fr: siteContent.farm_fact3_title_fr,
      description_fr: siteContent.farm_fact3_description_fr,
    },
    {
      iconName: siteContent.farm_fact4_icon,
      title_en: siteContent.farm_fact4_title_en,
      description_en: siteContent.farm_fact4_description_en,
      title_ar: siteContent.farm_fact4_title_ar,
      description_ar: siteContent.farm_fact4_description_ar,
      title_fr: siteContent.farm_fact4_title_fr,
      description_fr: siteContent.farm_fact4_description_fr,
    },
  ];

  return (
    <div className="relative min-h-screen bg-dairy-cream text-dairy-text overflow-hidden">
      <ParticleBackground />

      {/* Hero Section - Now using HeroCarousel */}
      <HeroCarousel />

      {/* Product Gallery Section */}
      <section className="w-full py-12 px-4 bg-dairy-cream">
        <ProductGallery />
      </section>

      {/* Farm Info Section - New section added here */}
      <FarmInfoSection
        title_en={siteContent.farm_section_title_en}
        title_ar={siteContent.farm_section_title_ar}
        title_fr={siteContent.farm_section_title_fr}
        subtitle_en={siteContent.farm_section_subtitle_en}
        subtitle_ar={siteContent.farm_section_subtitle_ar}
        subtitle_fr={siteContent.farm_section_subtitle_fr}
        facts={farmFactsData}
      />

      {/* Recipes Section */}
      <section className="w-full py-12 px-4 bg-dairy-cream">
        <RecipesSection />
      </section>

      {/* Image Slider Section */}
      <ImageSliderSection />

      {/* Facts Section */}
      <section
        className="w-full py-20 px-4 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg')` }}
      >
        {/* Optional: Add an overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <FactsSection />
      </section>

      {/* FAQ Section */}
      <section className="relative z-20 overflow-hidden pb-8 pt-10 lg:pb-[90px] lg:pt-[120px] bg-dairy-cream text-dairy-text">
        <AccordionSection />
      </section>

      {/* Floating Flyer */}
      <FloatingFlyer />

      {/* Discount Popup */}
      <DiscountPopup />
    </div>
  );
};

export default HomePage;
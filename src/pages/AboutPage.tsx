import React from 'react';
import { motion } from 'framer-motion';
import { Milk, Factory, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Ensure Card components are imported

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

  const teamMemberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' },
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

        {/* New Leadership Section */}
        <motion.section variants={sectionVariants} className="mt-16 text-center">
          <h2 className="text-4xl font-bold text-dairy-darkBlue mb-10">{t('our_leadership')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            <motion.div variants={teamMemberVariants} whileHover="hover" className="w-full max-w-sm">
              <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg h-full flex flex-col">
                <CardHeader className="p-0">
                  <img
                    src="/images/female-gm.png" 
                    alt={t('gm_giplait_group')}
                    className="w-full h-64 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6 text-center flex-grow flex flex-col justify-center">
                  <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">
                    {t('gm_giplait_group')}
                  </CardTitle>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={teamMemberVariants} whileHover="hover" className="w-full max-w-sm">
              <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg h-full flex flex-col">
                <CardHeader className="p-0">
                  <img
                    src="/images/male-gm.png" 
                    alt={t('gm_arib_dairy')}
                    className="w-full h-64 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6 text-center flex-grow flex flex-col justify-center">
                  <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">
                    {t('gm_arib_dairy')}
                  </CardTitle>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutPage;
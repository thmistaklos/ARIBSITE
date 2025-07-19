import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Milk, Heart, Weight, Droplet, Factory, Palette } from 'lucide-react'; // Importing relevant icons
import AnimatedButton from '@/components/AnimatedButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface FactCardProps {
  icon: React.ElementType;
  text: string;
}

const FactCard: React.FC<FactCardProps> = ({ icon: Icon, text }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6 text-center flex flex-col items-center justify-center h-full"
      whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="h-16 w-16 text-blue-500 mb-4" />
      <p className="text-lg font-semibold text-gray-800">{text}</p>
    </motion.div>
  );
};

interface StepCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 p-6 text-center flex flex-col items-center justify-center h-full"
      whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="h-16 w-16 text-yellow-600 mb-4" />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-md text-gray-600">{description}</p>
    </motion.div>
  );
};

const KidsZone: React.FC = () => {
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const funFacts = [
    { icon: Milk, text: t('fact_cow_milk') },
    { icon: Milk, text: t('fact_cheese_age') },
    { icon: Heart, text: t('fact_milk_calcium') },
    { icon: Weight, text: t('fact_milk_to_cheese') },
  ];

  const cheeseMakingSteps = [
    { icon: Milk, title: t('step_milk_collection'), description: t('step_milk_collection_desc') },
    { icon: Droplet, title: t('step_curdling'), description: t('step_curdling_desc') },
    { icon: Factory, title: t('step_shaping_aging'), description: t('step_shaping_aging_desc') },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100 text-gray-800 py-12 px-4"
    >
      <div className="container mx-auto">
        {/* Hero Section */}
        <motion.section
          variants={sectionVariants}
          className="text-center mb-16 bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border-2 border-blue-300"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 font-exo">
            {t('kids_zone_title')} 🎨
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            {t('kids_zone_description')}
          </p>
        </motion.section>

        {/* Fun Facts Section */}
        <motion.section variants={sectionVariants} className="mb-16">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-10 font-exo">
            {t('fun_facts_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {funFacts.map((fact, index) => (
              <FactCard key={index} icon={fact.icon} text={fact.text} />
            ))}
          </div>
        </motion.section>

        {/* Cheese-making Steps Section */}
        <motion.section variants={sectionVariants} className="mb-16">
          <h2 className="text-4xl font-bold text-center text-yellow-600 mb-10 font-exo">
            {t('cheese_making_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cheeseMakingSteps.map((step, index) => (
              <StepCard key={index} icon={step.icon} title={step.title} description={step.description} />
            ))}
          </div>
        </motion.section>

        {/* Coloring Pages Section */}
        <motion.section
          variants={sectionVariants}
          className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border-2 border-yellow-300"
        >
          <h2 className="text-4xl font-bold text-blue-600 mb-8 font-exo">
            {t('coloring_pages_title')}
          </h2>
          <Link to="/downloads/coloring-pages.pdf" target="_blank" rel="noopener noreferrer">
            <AnimatedButton
              className="bg-blue-500 text-white hover:bg-blue-600 px-8 py-4 text-xl rounded-full shadow-lg"
              soundOnClick="/sounds/click.mp3"
            >
              <Palette className="h-6 w-6 mr-3" /> {t('download_coloring_pages')}
            </AnimatedButton>
          </Link>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default KidsZone;
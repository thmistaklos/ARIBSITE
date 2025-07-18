import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Truck, FlaskConical, Store, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FactsSection: React.FC = () => {
  const { t } = useTranslation();

  const facts = [
    { icon: Droplet, textKey: 'fact_milk_production' },
    { icon: Truck, textKey: 'fact_largest_producer' },
    { icon: FlaskConical, textKey: 'fact_quality_tests' },
    { icon: Store, textKey: 'fact_points_of_sale' },
    { icon: Leaf, textKey: 'fact_organic_products' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center">
        {facts.map((fact, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col items-center text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
          >
            <fact.icon className="h-16 w-16 text-white mb-4" />
            <p className="text-lg font-medium text-white">{t(fact.textKey)}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FactsSection;
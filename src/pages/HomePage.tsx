import React from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/AnimatedButton';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <section className="text-center max-w-4xl mx-auto">
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 text-dairy-darkBlue leading-tight">
          Freshness in Every Drop
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 text-dairy-text">
          Experience the pure taste of nature with ARIB DAIRY's finest products.
        </motion.p>
        <motion.div variants={itemVariants} className="relative w-full max-w-lg mx-auto mb-12">
          <img
            src="/images/milk-splash.png" // Placeholder image for milk splash
            alt="Milk Splash"
            className="w-full h-auto rounded-full object-cover shadow-xl"
          />
          <motion.div
            className="absolute inset-0 bg-dairy-blue/30 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.5 }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/products">
            <AnimatedButton
              size="lg"
              className="bg-transparent text-cyan-glow border-2 border-cyan-glow rounded-md font-bold text-base shadow-glow transition-all duration-300 ease-in-out hover:bg-cyan-glow hover:text-black hover:shadow-hover-glow px-6 py-3"
              soundOnClick="/sounds/click.mp3"
            >
              Explore Our Products
            </AnimatedButton>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default HomePage;
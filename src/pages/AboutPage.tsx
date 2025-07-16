import React from 'react';
import { motion } from 'framer-motion';
import { Milk, Factory, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 10, delay: 0.3 } },
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
          Our Story
        </motion.h1>

        <motion.section variants={sectionVariants} className="mb-12 p-6 bg-white rounded-xl shadow-md border border-dairy-blue/20">
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <Milk className="h-16 w-16 text-dairy-blue" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-dairy-darkBlue mb-4 text-center">From Our Farms to Your Table</h2>
          <p className="text-lg leading-relaxed text-center">
            ARIB DAIRY began with a simple dream: to provide the freshest, most wholesome dairy products to families everywhere. Nestled in the heart of lush green pastures, our farms are home to happy, healthy cows, whose well-being is our top priority. We believe that happy cows make the best milk, and that's the secret ingredient in all our products.
          </p>
        </motion.section>

        <motion.section variants={sectionVariants} className="mb-12 p-6 bg-white rounded-xl shadow-md border border-dairy-blue/20">
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <Factory className="h-16 w-16 text-dairy-blue" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-dairy-darkBlue mb-4 text-center">Quality You Can Taste</h2>
          <p className="text-lg leading-relaxed text-center">
            Every product from ARIB DAIRY undergoes rigorous quality checks, from the moment the milk is collected to when it reaches your local store. We combine traditional methods with modern technology to ensure that every carton of milk, every block of butter, and every cup of yogurt meets our high standards of purity and taste.
          </p>
        </motion.section>

        <motion.section variants={sectionVariants} className="p-6 bg-white rounded-xl shadow-md border border-dairy-blue/20">
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-dairy-blue" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-dairy-darkBlue mb-4 text-center">Committed to Community</h2>
          <p className="text-lg leading-relaxed text-center">
            At ARIB DAIRY, we are more than just a dairy brand; we are a part of the community. We are committed to sustainable farming practices, supporting local farmers, and giving back to the neighborhoods that have embraced us. Thank you for choosing ARIB DAIRY – where quality, freshness, and community come first.
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutPage;
import React from 'react';
import { motion } from 'framer-motion';
// Removed useTranslation, ProductGallery, RecipesSection, FactsSection, ParticleBackground, AccordionSection, FloatingStats as they are not part of this new full-screen design

const HomePage: React.FC = () => {
  // Using the letters from "Freshness in Every Drop" without spaces for the interactive boxes
  const phrase = "FRESHNESSINEVERYDROP";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex justify-center items-center bg-[#18191f] overflow-hidden"
    >
      <ul>
        {phrase.split('').map((char, index) => (
          <li key={index}>
            <label>
              <input type="checkbox" />
              <div>{char}</div>
            </label>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default HomePage;
import React from 'react';
import { motion } from 'framer-motion';

const RecipesManagement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Recipes Management</h1>
      <p className="text-dairy-text">Manage the delicious recipes featured on your website. (Add, Edit, Delete recipes)</p>
      {/* Future: Table of recipes, forms for adding/editing */}
    </motion.div>
  );
};

export default RecipesManagement;
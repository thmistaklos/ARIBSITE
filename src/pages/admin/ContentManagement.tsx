import React from 'react';
import { motion } from 'framer-motion';

const ContentManagement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Content Management</h1>
      <p className="text-dairy-text">Update website content like homepage text, banners, and page content.</p>
      {/* Future: Forms for editing content sections */}
    </motion.div>
  );
};

export default ContentManagement;
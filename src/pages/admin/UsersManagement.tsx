import React from 'react';
import { motion } from 'framer-motion';

const UsersManagement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Users Management</h1>
      <p className="text-dairy-text">Manage user accounts and roles. (View list, Assign roles)</p>
      {/* Future: Table of users, user details */}
    </motion.div>
  );
};

export default UsersManagement;
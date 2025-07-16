import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="bg-dairy-darkBlue text-dairy-cream py-8 mt-12"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} ARIB DAIRY. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <motion.a
            href="#"
            whileHover={{ scale: 1.2, color: 'hsl(var(--dairy-blue))' }}
            className="text-dairy-cream hover:text-dairy-blue transition-colors"
          >
            <Facebook size={24} />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.2, color: 'hsl(var(--dairy-blue))' }}
            className="text-dairy-cream hover:text-dairy-blue transition-colors"
          >
            <Instagram size={24} />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.2, color: 'hsl(var(--dairy-blue))' }}
            className="text-dairy-cream hover:text-dairy-blue transition-colors"
          >
            <Twitter size={24} />
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
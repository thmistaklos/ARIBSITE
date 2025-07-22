import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DiscountPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup when the component mounts
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
          onClick={handleClose} // Close on overlay click
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-64 h-80 bg-sky-600 rounded-2xl text-gray-50 flex flex-col justify-end items-center gap-2 p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-50/70 hover:text-gray-50 transition-colors"
              aria-label="Close popup"
            >
              <X className="h-6 w-6" />
            </button>

            <img
              src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//WhatsApp_Image_2025-07-19_at_17.59.08_bb1a699c-removebg-preview.png"
              alt="Amir Cheese"
              className="w-32 h-32 object-contain absolute -top-8"
            />

            <h2 className="font-bold text-2xl">AMIR CHEESE</h2>
            <p className="text-xs uppercase">THE BEST CHEESE IN THE MARKET</p>
            <p className="font-extrabold text-5xl text-yellow-300">50 DA</p>

            <button className="w-full py-2 mt-2 rounded bg-gray-50 text-sky-600 font-semibold hover:bg-sky-500 hover:text-gray-50 transition-colors">
              Shop Now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscountPopup;
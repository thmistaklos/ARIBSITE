import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LucideIcons } from '@/utils/lucide-icons'; // Import the icon map

interface FactItem {
  id: string;
  icon_name: string;
  text_content: string;
  order_index: number;
}

const FactsSection: React.FC = () => {
  const { t } = useTranslation();
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('facts_items').select('*').order('order_index', { ascending: true });
      if (error) {
        toast.error('Failed to load facts', { description: error.message });
      } else {
        setFacts(data || []);
      }
      setLoading(false);
    };

    fetchFacts();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (facts.length === 0) {
    return (
      <div className="text-center text-xl text-white mt-8">
        No facts available. Please add some from the admin panel.
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center">
        {facts.map((fact, index) => {
          const IconComponent = LucideIcons[fact.icon_name]; // Get the icon component dynamically
          return (
            <motion.div
              key={fact.id} // Use fact.id as key
              variants={itemVariants}
              className="flex flex-col items-center text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
            >
              {IconComponent ? (
                <IconComponent className="h-16 w-16 text-white mb-4" />
              ) : (
                <div className="h-16 w-16 text-white mb-4 flex items-center justify-center text-sm">
                  {/* Fallback if icon name is invalid */}
                  <span className="text-red-300">?</span>
                </div>
              )}
              <p className="text-lg font-medium text-white">{fact.text_content}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FactsSection;
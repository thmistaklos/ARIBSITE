import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DistributorCard from '@/components/DistributorCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Distributor {
  id: string;
  name: string;
  location: string; // Changed from 'region' to 'location' to match public display
  email: string;
  phone: string;
  address: string;
  logo_url: string | null;
}

const DistributorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('distributors').select('*').order('name', { ascending: true });
      if (error) {
        toast.error('Failed to load distributors', { description: error.message });
      } else {
        setDistributors(data || []);
      }
      setLoading(false);
    };

    fetchDistributors();
  }, []);

  const filteredDistributors = distributors.filter(distributor =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(100vh-232px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('our_distributors')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 max-w-md mx-auto relative"
        >
          <Input
            type="text"
            placeholder={t('search_distributors_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-dairy-blue/30 bg-white text-dairy-darkBlue focus-visible:ring-dairy-blue focus-visible:ring-offset-0"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dairy-blue" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
          </div>
        ) : filteredDistributors.length === 0 ? (
          <div className="text-center text-xl text-dairy-text">
            {t('no_distributors_found')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredDistributors.map((distributor) => (
              <DistributorCard key={distributor.id} distributor={distributor} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DistributorsPage;
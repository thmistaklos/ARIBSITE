import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DistributorCard from '@/components/DistributorCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Distributor {
  id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  logo: string;
}

const DUMMY_DISTRIBUTORS: Distributor[] = [
  {
    id: '1',
    name: 'Fresh Dairy Supplies Inc.',
    location: 'New York, USA',
    email: 'info@freshdairy.com',
    phone: '+1-212-555-0100',
    logo: 'https://via.placeholder.com/150/ADD8E6/000000?text=Fresh+Dairy',
  },
  {
    id: '2',
    name: 'Global Milk Distributors',
    location: 'London, UK',
    email: 'contact@globalmilk.co.uk',
    phone: '+44-20-7946-0123',
    logo: 'https://via.placeholder.com/150/90EE90/000000?text=Global+Milk',
  },
  {
    id: '3',
    name: 'Al-Nour Foodstuffs',
    location: 'Dubai, UAE',
    email: 'sales@alnour.ae',
    phone: '+971-4-123-4567',
    logo: 'https://via.placeholder.com/150/FFD700/000000?text=Al-Nour',
  },
  {
    id: '4',
    name: 'Euro Dairy Logistics',
    location: 'Berlin, Germany',
    email: 'support@eurodairy.de',
    phone: '+49-30-9876-5432',
    logo: 'https://via.placeholder.com/150/FFB6C1/000000?text=Euro+Dairy',
  },
  {
    id: '5',
    name: 'Asia Pacific Dairy',
    location: 'Sydney, Australia',
    email: 'sales@asiapacificdairy.com.au',
    phone: '+61-2-8765-4321',
    logo: 'https://via.placeholder.com/150/87CEEB/000000?text=Asia+Pacific',
  },
  {
    id: '6',
    name: 'Canadian Dairy Partners',
    location: 'Toronto, Canada',
    email: 'info@canadiandairy.ca',
    phone: '+1-416-111-2222',
    logo: 'https://via.placeholder.com/150/DDA0DD/000000?text=Canadian',
  },
];

const DistributorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistributors = DUMMY_DISTRIBUTORS.filter(distributor =>
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
      className="min-h-[calc(100vh-160px)] bg-dairy-cream text-dairy-text py-12 px-4"
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

        {filteredDistributors.length === 0 ? (
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
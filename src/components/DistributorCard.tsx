import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DistributorCardProps {
  distributor: {
    id: string;
    name: string;
    location: string;
    email: string;
    phone: string;
    logo_url: string | null; // This can now be an image URL or a Google Maps embed URL
  };
}

const DistributorCard: React.FC<DistributorCardProps> = ({ distributor }) => {
  const { t } = useTranslation();

  const isGoogleMapsEmbed = distributor.logo_url?.startsWith('https://www.google.com/maps/embed?');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg h-full flex flex-col">
        <CardHeader className="p-0 flex items-center justify-center h-32 bg-white">
          {distributor.logo_url ? (
            isGoogleMapsEmbed ? (
              <iframe
                src={distributor.logo_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${distributor.name} Location`}
                className="object-cover"
              ></iframe>
            ) : (
              <img
                src={distributor.logo_url}
                alt={`${distributor.name} Logo`}
                className="max-h-24 max-w-[80%] object-contain"
              />
            )
          ) : (
            <div className="max-h-24 max-w-[80%] flex items-center justify-center text-dairy-text/50">
              No Logo
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">{distributor.name}</CardTitle>
            <CardDescription className="text-dairy-text mb-4 flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2 text-dairy-blue" /> {distributor.location}
            </CardDescription>
            <div className="space-y-2 text-dairy-text text-sm">
              <a href={`tel:${distributor.phone}`} className="flex items-center justify-center hover:text-dairy-blue transition-colors">
                <Phone className="h-4 w-4 mr-2 text-dairy-blue" /> {distributor.phone}
              </a>
              <a href={`mailto:${distributor.email}`} className="flex items-center justify-center hover:text-dairy-blue transition-colors">
                <Mail className="h-4 w-4 mr-2 text-dairy-blue" /> {distributor.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DistributorCard;
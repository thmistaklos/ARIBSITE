import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next'; // Corrected '=>' to 'from'
import { Link } from 'react-router-dom'; // Import Link

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    image_url: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg h-full flex flex-col">
        <CardHeader className="p-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">{product.name}</CardTitle>
            <CardDescription className="text-dairy-text mb-4">{product.description}</CardDescription>
            <p className="text-3xl font-bold text-dairy-blue mb-6">{product.price}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to={`/products/${product.id}`}>
              <AnimatedButton className="w-full bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
                {t('view_details')}
              </AnimatedButton>
            </Link>
            <AnimatedButton className="w-full bg-dairy-darkBlue text-dairy-cream hover:bg-dairy-blue" soundOnClick="/sounds/click.mp3">
              {t('add_to_cart')}
            </AnimatedButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
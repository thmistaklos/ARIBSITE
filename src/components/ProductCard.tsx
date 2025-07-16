import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedButton from '@/components/AnimatedButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg">
        <CardHeader className="p-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-6 text-center">
          <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">{product.name}</CardTitle>
          <CardDescription className="text-dairy-text mb-4">{product.description}</CardDescription>
          <p className="text-3xl font-bold text-dairy-blue mb-6">{product.price}</p>
          <AnimatedButton className="w-full bg-dairy-darkBlue text-dairy-cream hover:bg-dairy-blue" soundOnClick="/sounds/click.mp3">
            Add to Cart
          </AnimatedButton>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
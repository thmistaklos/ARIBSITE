import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import AnimatedButton from '@/components/AnimatedButton';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

// This data should ideally come from your Supabase 'products' table
const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Whole Milk',
    description: 'Pure, pasteurized whole milk from grass-fed cows. Rich in calcium and vitamins.',
    price: '$3.99/L',
    image: 'https://via.placeholder.com/400x300/ADD8E6/000000?text=Whole+Milk',
  },
  {
    id: '2',
    name: 'Organic Greek Yogurt',
    description: 'Thick and creamy organic Greek yogurt, perfect for breakfast or a healthy snack.',
    price: '$5.49/500g',
    image: 'https://via.placeholder.com/400x300/90EE90/000000?text=Greek+Yogurt',
  },
  {
    id: '3',
    name: 'Artisan Cheddar Cheese',
    description: 'Aged cheddar cheese with a sharp, nutty flavor. Ideal for cheese boards and cooking.',
    price: '$12.99/block',
    image: 'https://via.placeholder.com/400x300/FFD700/000000?text=Cheddar+Cheese',
  },
  {
    id: '4',
    name: 'Butter (Unsalted)',
    description: 'Premium unsalted butter, churned from fresh cream. Great for baking and cooking.',
    price: '$4.79/250g',
    image: 'https://via.placeholder.com/400x300/FFB6C1/000000?text=Butter',
  },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const product = DUMMY_PRODUCTS.find(p => p.id === id);

  const handleAddToCart = () => {
    toast.success(t('added_to_cart', { product: product?.name || 'item' }));
  };

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-dairy-cream text-dairy-text py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-dairy-darkBlue">{t('product_not_found')}</h1>
          <p className="text-xl text-dairy-text mb-6">{t('product_not_found_desc')}</p>
          <Link to="/products">
            <Button className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_products')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-[calc(100vh-160px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto max-w-5xl bg-white rounded-xl shadow-lg border-2 border-dairy-blue/20 p-6 md:p-10 flex flex-col md:flex-row gap-8">
        <Link to="/products" className="absolute top-6 left-6 flex items-center text-dairy-blue hover:text-dairy-darkBlue transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" /> {t('back_to_products')}
        </Link>

        <motion.div
          className="md:w-1/2 flex-shrink-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md"
          />
        </motion.div>

        <motion.div
          className="md:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dairy-darkBlue mb-4">{product.name}</h1>
          <p className="text-lg text-dairy-text leading-relaxed mb-6">{product.description}</p>
          <p className="text-5xl font-bold text-dairy-blue mb-8">{product.price}</p>
          <AnimatedButton
            onClick={handleAddToCart}
            className="w-full md:w-auto bg-dairy-darkBlue text-dairy-cream hover:bg-dairy-blue px-8 py-3 text-lg"
            soundOnClick="/sounds/click.mp3"
          >
            <ShoppingCart className="mr-3 h-6 w-6" /> {t('add_to_cart')}
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
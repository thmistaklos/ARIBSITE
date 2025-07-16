import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string; // Changed from 'image' to 'image_url'
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
      if (error) {
        toast.error('Failed to load products', { description: error.message });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

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
          Our Delicious Dairy Products
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-xl text-dairy-text">No products available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsPage;
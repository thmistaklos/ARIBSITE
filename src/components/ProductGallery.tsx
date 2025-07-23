import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  show_in_gallery: boolean;
}

const ProductGallery: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('show_in_gallery', true)
        .order('name', { ascending: true });

      if (error) {
        toast.error('Failed to load products for gallery', { description: error.message });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-xl text-dairy-text mt-8">
        No products are currently selected to be shown in the gallery.
      </div>
    );
  }

  const magnifier = 6;
  const gap = '1vmin';
  const transitionDuration = '0.5s';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full flex justify-center py-12"
    >
      {isMobile ? (
        <div className="w-full overflow-x-auto pb-4 pl-4">
          <div className="flex space-x-4">
            {products.map(product => (
              <img
                key={product.id}
                src={product.image_url}
                alt={product.name}
                className="h-48 w-auto object-cover rounded-lg shadow-md flex-shrink-0"
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="container flex items-center justify-center"
          style={{
            width: '80vw',
            height: '50vmin',
            gap: gap,
          }}
        >
          {products.map((product) => (
            <motion.img
              key={product.id}
              src={product.image_url}
              alt={product.name}
              className="h-full object-cover overflow-hidden rounded-lg"
              style={{
                flex: hoveredId === product.id ? magnifier : 1,
                filter: `grayscale(${hoveredId === product.id ? 0 : 1}) brightness(${hoveredId === product.id ? 1.15 : 0.75})`,
                transition: `flex ${transitionDuration}, filter ${transitionDuration}`,
              }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductGallery;
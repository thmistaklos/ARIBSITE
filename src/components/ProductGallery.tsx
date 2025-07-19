import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  show_in_gallery: boolean; // Include the new field
}

const ProductGallery: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Fetch directly from the products table, filtering by show_in_gallery
      const { data, error } = await supabase
        .from('products')
        .select('*') // Select all fields including show_in_gallery
        .eq('show_in_gallery', true) // Filter to only show products marked for gallery
        .order('name', { ascending: true }); // You can change this order if needed

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
        No products are currently selected to be shown in the gallery. Please enable "Show in Gallery" for some products in the admin panel.
      </div>
    );
  }

  const magnifier = 6; // Corresponds to --magnifier in original CSS
  const gap = '1vmin'; // Corresponds to --gap in original CSS
  const transitionDuration = '0.5s'; // Corresponds to --transition in original CSS

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full flex justify-center py-12"
    >
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
            className="h-full object-cover overflow-hidden"
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
    </motion.div>
  );
};

export default ProductGallery;
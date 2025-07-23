import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';

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
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="w-full"
    >
      <div className="relative bg-white rounded-lg shadow-md p-4 text-center transition-all duration-300 hover:shadow-xl group h-full flex flex-col justify-between">
        <Link to={`/products/${product.id}`}>
          <div className="mb-4 h-48 flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="post-content">
            <h4 className="text-lg font-semibold text-dairy-darkBlue mb-2 truncate group-hover:text-dairy-blue">{product.name}</h4>
            <div className="flex justify-center items-center text-yellow-400 mb-1">
              <Star fill="currentColor" className="w-4 h-4" />
              <Star fill="currentColor" className="w-4 h-4" />
              <Star fill="currentColor" className="w-4 h-4" />
              <Star fill="currentColor" className="w-4 h-4" />
              <StarHalf fill="currentColor" className="w-4 h-4" />
              <p className="text-xs text-gray-500 ml-2">(3 Reviews)</p>
            </div>
            <span className="text-xl font-bold text-dairy-blue">{product.price} DA</span>
          </div>
        </Link>
        {/* Example of an offer badge if data were available */}
        {/* <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-50%</div> */}
      </div>
    </motion.div>
  );
};

export default ProductCard;
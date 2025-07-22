import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div
        className="box-border w-[190px] h-[254px] bg-[#D9D9D9]/[0.58] border border-white shadow-[12px_17px_51px_rgba(0,0,0,0.22)] backdrop-blur-[6px] rounded-[17px] text-center cursor-pointer transition-all duration-500 flex flex-col items-center justify-between p-3 select-none font-bolder text-black group-hover:border-black group-hover:scale-105 group-active:scale-95 group-active:rotate-[1.7deg]"
      >
        <div className="w-full h-32 flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-md font-extrabold leading-tight">{product.name}</h3>
            <p className="text-xs font-normal line-clamp-2 my-1">{product.description}</p>
            <p className="text-md font-extrabold">{product.price} DA</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
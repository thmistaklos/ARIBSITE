import { useEffect, useState } from "react";
import "./DiscountPopup.css"; // Include the CSS below

const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true); // Show popup on page load
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="card relative text-center">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-white text-2xl font-bold z-10"
        >
          ×
        </button>

        {/* Title */}
        <p className="heading text-white mt-2">AMIR CHEESE</p>

        {/* Cheese Image */}
        <img
          src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//WhatsApp_Image_2025-07-19_at_17.59.08_bb1a699c-removebg-preview.png"
          alt="Amir Cheese"
          className="w-32 h-32 object-contain mx-auto mt-3"
        />

        {/* Subtitle */}
        <p className="text-white text-xs mt-3">THE BEST CHEESE IN THE MARKET</p>

        {/* Price */}
        <p className="text-yellow-300 font-bold text-xl mt-2">50 DA</p>
      </div>
    </div>
  );
};

export default DiscountPopup;
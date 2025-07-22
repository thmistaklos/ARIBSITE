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
      <div className="card relative" id="card">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-white text-2xl font-bold z-10"
        >
          ×
        </button>

        {/* Content */}
        <div className="content flex flex-col items-center justify-center text-center gap-2">
          {/* Image */}
          <img
            src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//WhatsApp_Image_2025-07-19_at_17.59.08_bb1a699c-removebg-preview.png"
            alt="Amir Cheese"
            className="w-28 h-28 object-contain"
          />

          {/* Title & Subtitle */}
          <span className="text-lg font-bold">AMIR CHEESE</span>
          <span className="text-xs">THE BEST CHEESE IN THE MARKET</span>

          {/* Price */}
          <span className="text-yellow-300 font-extrabold text-xl mt-2">
            50 DA
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscountPopup;
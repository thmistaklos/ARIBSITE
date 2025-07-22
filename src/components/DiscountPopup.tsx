import { useEffect, useState } from "react";
import "./DiscountPopup.css"; // Include CSS below

const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true); // Show popup on page load or refresh
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-8 right-0 text-white text-2xl font-bold"
        >
          ×
        </button>

        {/* Flip Card */}
        <div className="flip-card">
          <div className="flip-card-inner">
            {/* Front Side */}
            <div className="flip-card-front">
              <img
                src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//WhatsApp_Image_2025-07-19_at_17.59.08_bb1a699c-removebg-preview.png"
                alt="Amir Cheese"
                className="w-24 h-24 object-contain mx-auto mb-3"
              />
              <p className="title">AMIR CHEESE</p>
              <p className="text-sm">THE BEST CHEESE IN THE MARKET</p>
            </div>

            {/* Back Side */}
            <div className="flip-card-back">
              <p className="title">50 DA</p>
              <p className="text-sm">Don't miss this deal!</p>
              <button className="mt-3 px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPopup;
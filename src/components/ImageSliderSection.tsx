import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslation } from 'react-i18next';

const images = [
  'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//pngwing.com%20(3).png',
  'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//pngwing.com.png',
  'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//pngwing.com%20(2).png',
  'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//pngwing.com%20(1).png',
];

const ImageSliderSection: React.FC = () => {
  const { t } = useTranslation();
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-12 px-4 bg-dairy-cream text-dairy-text"
    >
      <div className="container mx-auto">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('OUR_CERTIFICATIONS')}
        </motion.h2>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {images.map((src, index) => (
              <div className="embla__slide flex-none min-w-0 flex justify-center items-center px-4" key={index}>
                <img
                  src={src}
                  alt={`Certification ${index + 1}`}
                  className="h-32 w-auto object-contain max-w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ImageSliderSection;
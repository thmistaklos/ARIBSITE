import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BeerSliderProps {
  start?: number;
}

const BeerSlider: React.FC<BeerSliderProps> = ({ start = 50 }) => {
  const { t } = useTranslation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);

  const [rangeValue, setRangeValue] = useState(start);
  const [isReady, setIsReady] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [isLess, setIsLess] = useState(false);

  const move = useCallback(() => {
    if (revealContainerRef.current && handleRef.current && rangeRef.current) {
      const value = parseInt(rangeRef.current.value);
      revealContainerRef.current.style.setProperty('--width', `${value}%`);
      handleRef.current.style.left = `${value}%`;
      rangeRef.current.setAttribute('aria-valuenow', value.toString());
      setRangeValue(value);

      setIsMore(value > 55);
      setIsLess(value < 45);
    }
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const imagesToLoad = [
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74321/original-baltic.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74321/winter.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74321/warmsphere-baltic.jpg',
      ];

      const promises = imagesToLoad.map(src => {
        return new Promise<void>((resolve, reject) => {
          if (!src) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = src;
        });
      });

      try {
        await Promise.all(promises);
        setIsReady(true);
        move(); // Initial positioning after images load
      } catch (error) {
        console.error("Some errors occurred and images are not loaded.", error);
      }
    };

    loadImages();
  }, [move]);

  useEffect(() => {
    const rangeInput = rangeRef.current;
    if (rangeInput) {
      const handleInput = () => move();
      rangeInput.addEventListener('input', handleInput);
      rangeInput.addEventListener('change', handleInput);
      return () => {
        rangeInput.removeEventListener('input', handleInput);
        rangeInput.removeEventListener('change', handleInput);
      };
    }
  }, [move]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`beer-slider ${isReady ? 'beer-ready' : ''} ${isMore ? 'more' : ''} ${isLess ? 'less' : ''}`}
      ref={sliderRef}
    >
      <div className="ctnr ctnr-winter">
        <svg className="winter" width="100%" height="100%" viewBox="0 0 600 361" preserveAspectRatio="xMidYMid slice" aria-labelledby="title1" role="img">
          <title id="title1">Baltic seashore -sepicol</title>
          <image xlinkHref="https://s3-us-west-2.amazonaws.com/s.cdpn.io/74321/winter.jpg" x="0" y="0" width="100%" height="100%"></image>
        </svg>
        <section className="b b2">
          <h2>{t('winter_baltic_sea_title')}</h2>
          <p>{t('winter_baltic_sea_desc')}</p>
        </section>
      </div>
      <div className="beer-reveal" ref={revealContainerRef}>
        <div className="ctnr ctnr-summer">
          <svg width="100%" height="100%" viewBox="0 0 600 361" preserveAspectRatio="xMidYMid slice" aria-labelledby="title2" role="img">
            <title id="title2">Baltic seashore - warmshphere preset applied</title>
            <image xlinkHref="https://s3-us-west-2.amazonaws.com/s.cdpn.io/74321/warmsphere-baltic.jpg" x="0" y="0" width="100%" height="100%"></image>
          </svg>
          <section className="b b1">
            <h2>{t('summer_baltic_sea_title')}</h2>
            <p>{t('summer_baltic_sea_desc')}</p>
          </section>
        </div>
      </div>
      <input
        type="range"
        className="beer-range"
        aria-label="Percent of revealed content"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={rangeValue}
        value={rangeValue}
        min="0"
        max="100"
        ref={rangeRef}
      />
      <span className="beer-handle" ref={handleRef}></span>

      {/* SVG for clipPath - placed here for accessibility within the component */}
      <svg className="absolute w-0 h-0 overflow-hidden">
        <defs>
          <clipPath id="svgPath" clipPathUnits="objectBoundingBox" transform="scale(0.00083 0.0075)">
            <path d="M1397,490H204c263,0,160-32,371-33,191.52-.91,150.49-135.14,225-92C990,475,1144,490,1397,490Z" transform="translate(-178 -350.46)" />
          </clipPath>
        </defs>
      </svg>
    </motion.div>
  );
};

export default BeerSlider;
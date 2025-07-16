import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null); // State to manage open FAQ

  const faqs = [
    {
      id: 'faq1', // Add unique ID for state management
      questionKey: 'faq_q1',
      answerKey: 'faq_a1',
    },
    {
      id: 'faq2',
      questionKey: 'faq_q2',
      answerKey: 'faq_a2',
    },
    {
      id: 'faq3',
      questionKey: 'faq_q3',
      answerKey: 'faq_a3',
    },
    {
      id: 'faq4',
      questionKey: 'faq_q4',
      answerKey: 'faq_a4',
    },
    {
      id: 'faq5',
      questionKey: 'faq_q5',
      answerKey: 'faq_a5',
    },
    {
      id: 'faq6',
      questionKey: 'faq_q6',
      answerKey: 'faq_a6',
    },
    {
      id: 'faq7',
      questionKey: 'faq_q7',
      answerKey: 'faq_a7',
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="relative z-20 overflow-hidden bg-dairy-cream pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-dairy-blue">{t('faq_section_tag')}</span>
              <h2 className="mb-4 text-3xl font-bold text-dairy-darkBlue sm:text-[40px]/[48px]">{t('faq_title')}</h2>
              <p className="text-base text-dairy-text">{t('faq_description')}</p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          {/* Left Column */}
          <div className="w-full px-4 lg:w-1/2">
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                className="mb-8 w-full rounded-lg bg-white p-4 shadow sm:p-8 lg:px-6 xl:px-8 border border-dairy-blue/20"
              >
                <button
                  className="faq-btn flex w-full text-left items-center"
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                >
                  <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-dairy-blue/10 text-dairy-blue">
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="w-full">
                    <h4 className="mt-1 text-lg font-semibold text-dairy-darkBlue">{t(faq.questionKey)}</h4>
                  </div>
                </button>
                {openFaqId === faq.id && (
                  <div className="faq-content pl-[62px]">
                    <p className="py-3 text-base leading-relaxed text-dairy-text">
                      {t(faq.answerKey, {
                        interpolation: { escapeValue: false },
                        careersLink: <Link to="/careers" className="text-dairy-blue underline">{t('careers_page')}</Link>,
                        productsLink: <Link to="/products" className="text-dairy-blue underline">{t('products_page')}</Link>
                      })}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full px-4 lg:w-1/2">
            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                className="mb-8 w-full rounded-lg bg-white p-4 shadow sm:p-8 lg:px-6 xl:px-8 border border-dairy-blue/20"
              >
                <button
                  className="faq-btn flex w-full text-left items-center"
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                >
                  <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-dairy-blue/10 text-dairy-blue">
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="w-full">
                    <h4 className="mt-1 text-lg font-semibold text-dairy-darkBlue">{t(faq.questionKey)}</h4>
                  </div>
                </button>
                {openFaqId === faq.id && (
                  <div className="faq-content pl-[62px]">
                    <p className="py-3 text-base leading-relaxed text-dairy-text">
                      {t(faq.answerKey, {
                        interpolation: { escapeValue: false },
                        careersLink: <Link to="/careers" className="text-dairy-blue underline">{t('careers_page')}</Link>,
                        productsLink: <Link to="/products" className="text-dairy-blue underline">{t('products_page')}</Link>
                      })}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
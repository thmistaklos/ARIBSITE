import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      id: 'faq1',
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
      className="faq-section py-10 px-6 bg-dairy-cream text-dairy-text"
    >
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('faq_title')}
        </motion.h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border border-dairy-blue/20">
              <h3 className="text-xl font-semibold text-dairy-darkBlue mb-3">{t(faq.questionKey)}</h3>
              <p className="text-lg leading-relaxed">
                {t(faq.answerKey, {
                  interpolation: { escapeValue: false }, // Allow HTML in translations for links
                  careersLink: <Link to="/careers" className="text-dairy-blue underline">{t('careers_page')}</Link>,
                  productsLink: <Link to="/products" className="text-dairy-blue underline">{t('products_page')}</Link>
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
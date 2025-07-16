import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

const NewFAQSection: React.FC = () => {
  const { t } = useTranslation();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 'faq1',
      questionKey: 'new_faq_q1',
      answerKey: 'new_faq_a1',
    },
    {
      id: 'faq2',
      questionKey: 'new_faq_q2',
      answerKey: 'new_faq_a2',
    },
    {
      id: 'faq3',
      questionKey: 'new_faq_q3',
      answerKey: 'new_faq_a3',
    },
    {
      id: 'faq4',
      questionKey: 'new_faq_q4',
      answerKey: 'new_faq_a4',
    },
    {
      id: 'faq5',
      questionKey: 'new_faq_q5',
      answerKey: 'new_faq_a5',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-dairy-cream py-10 px-6"
    >
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-dairy-darkBlue lg:text-3xl">{t('new_faq_title')}</h1>

        <hr className="my-6 border-dairy-blue/20" />

        <div>
          {faqs.map((faq) => (
            <div key={faq.id}>
              <button
                className="flex items-center w-full text-left focus:outline-none py-4"
                onClick={() => toggleFaq(faq.id)}
              >
                {openFaqId === faq.id ? (
                  <Minus className="flex-shrink-0 w-6 h-6 text-dairy-blue" />
                ) : (
                  <Plus className="flex-shrink-0 w-6 h-6 text-dairy-blue" />
                )}
                <h1 className="mx-4 text-xl text-dairy-darkBlue">{t(faq.questionKey)}</h1>
              </button>

              {openFaqId === faq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex mt-2 md:mx-10"
                >
                  <span className="border border-dairy-blue"></span>
                  <p className="max-w-3xl px-4 text-dairy-text">
                    {t(faq.answerKey)}
                  </p>
                </motion.div>
              )}
              <hr className="my-8 border-dairy-blue/20" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default NewFAQSection;
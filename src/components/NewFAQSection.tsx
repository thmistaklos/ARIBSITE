import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

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
      questionKey: 'faq_job_application_q',
      answerKey: 'faq_job_application_a',
    },
    {
      id: 'faq2',
      questionKey: 'faq_job_status_q',
      answerKey: 'faq_job_status_a',
    },
    {
      id: 'faq3',
      questionKey: 'faq_training_program_q',
      answerKey: 'faq_training_program_a',
    },
    {
      id: 'faq4',
      questionKey: 'faq_product_feedback_q',
      answerKey: 'faq_product_feedback_a',
    },
    {
      id: 'faq5',
      questionKey: 'faq_brands_products_q',
      answerKey: 'faq_brands_products_a',
    },
    {
      id: 'faq6',
      questionKey: 'faq_factory_visit_q',
      answerKey: 'faq_factory_visit_a',
    },
    {
      id: 'faq7',
      questionKey: 'faq_social_sponsorship_q',
      answerKey: 'faq_social_sponsorship_a',
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
                    {t(faq.answerKey, {
                      interpolation: { escapeValue: false }, // Allow HTML in translations
                      email: 'aribgipliat@gmail.com',
                      phone: '+213 670 106 308',
                      careersLink: <Link to="/careers" className="text-dairy-blue underline">{t('careers_page')}</Link>,
                      productsLink: <Link to="/products" className="text-dairy-blue underline">{t('products_page')}</Link>
                    })}
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
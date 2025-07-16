import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  const faqItems = [
    {
      questionKey: 'faq_q1',
      answerKey: 'faq_a1',
      email: 'aribgipliat@gmail.com',
      phone: null,
    },
    {
      questionKey: 'faq_q2',
      answerKey: 'faq_a2',
      email: 'aribgipliat@gmail.com',
      phone: '+213 670 106 308',
    },
    {
      questionKey: 'faq_q3',
      answerKey: 'faq_a3',
      email: 'aribgipliat@gmail.com',
      phone: null,
    },
    {
      questionKey: 'faq_q4',
      answerKey: 'faq_a4',
      email: 'aribgipliat@gmail.com',
      phone: '+213 670 106 308',
    },
    {
      questionKey: 'faq_q5',
      answerKey: 'faq_a5',
      email: null,
      phone: null,
    },
    {
      questionKey: 'faq_q6',
      answerKey: 'faq_a6',
      email: 'aribgipliat@gmail.com',
      phone: null,
    },
    {
      questionKey: 'faq_q7',
      answerKey: 'faq_a7',
      email: 'aribgipliat@gmail.com',
      phone: null,
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
        <h2 className="text-3xl font-bold text-center mb-8 text-dairy-darkBlue">{t('faq_title')}</h2>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md border border-dairy-blue/20">
              <h3 className="text-xl font-semibold mb-2 text-dairy-darkBlue">{t(item.questionKey)}</h3>
              <p className="text-dairy-text">
                {t(item.answerKey)}
                {item.email && (
                  <>
                    <br />
                    📧 <a href={`mailto:${item.email}`} className="text-dairy-blue hover:underline">{item.email}</a>
                  </>
                )}
                {item.phone && (
                  <>
                    <br />
                    📞 <a href={`tel:${item.phone}`} className="text-dairy-blue hover:underline">{item.phone}</a>
                  </>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
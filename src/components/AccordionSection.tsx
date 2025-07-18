import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface AccordionSectionProps {
  className?: string; // Add className prop
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <section className={cn("relative z-20 overflow-hidden pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]", className)}> {/* Apply className here */}
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-dairy-blue">
                {t('faq_title')}
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dairy-darkBlue sm:text-[40px]/[48px]">
                {t('faq_heading')}
              </h2>
              <p className="text-base text-dairy-text">
                {t('faq_description')}
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header={t('faq_question_1')}
              text={t('faq_answer_1')}
            />
            <AccordionItem
              header={t('faq_question_2')}
              text={t('faq_answer_2')}
            />
            <AccordionItem
              header={t('faq_question_3')}
              text={t('faq_answer_3')}
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header={t('faq_question_4')}
              text={t('faq_answer_4')}
            />
            <AccordionItem
              header={t('faq_question_5')}
              text={t('faq_answer_5')}
            />
            <AccordionItem
              header={t('faq_question_6')}
              text={t('faq_answer_6')}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-[-1]">
        <svg
          width="1440"
          height="886"
          viewBox="0 0 1440 886"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="1308.65"
              y1="1142.58"
              x2="602.827"
              y2="-418.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--dairy-blue))" stopOpacity="0.36" />
              <stop offset="1" stopColor="hsl(var(--dairy-cream))" stopOpacity="0" />
              <stop offset="1" stopColor="hsl(var(--dairy-cream))" stopOpacity="0.096144" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default AccordionSection;

interface AccordionItemProps {
  header: string;
  text: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ header, text }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <div className={cn(
      "mb-8 w-full rounded-lg border border-dairy-blue/20 shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)]",
      active ? "bg-dairy-darkBlue" : "bg-dairy-blue" // Background changes based on active state
    )}>
      <button
        className="flex w-full items-center justify-between p-4 sm:p-8 lg:px-6 xl:px-8 text-left"
        onClick={handleToggle}
      >
        <h4 className="mt-1 text-lg font-semibold text-dairy-cream"> {/* Text color is always cream */}
          {header}
        </h4>
        <div className="flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-dairy-cream/20 text-dairy-cream"> {/* Icon background and color */}
          <svg
            className={cn(
              "fill-dairy-cream stroke-dairy-cream duration-200 ease-in-out",
              active ? "rotate-180" : ""
            )}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>
      </button>

      <div
        className={cn(
          "px-4 pb-4 sm:px-8 lg:px-6 xl:px-8 duration-200 ease-in-out",
          active ? "block" : "hidden"
        )}
      >
        <p className="py-3 text-base leading-relaxed text-dairy-cream"> {/* Text color is always cream */}
          {text}
        </p>
      </div>
    </div>
  );
};
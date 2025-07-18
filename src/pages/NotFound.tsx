import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-10 bg-dairy-blue py-[120px] min-h-[calc(100vh-160px)] flex items-center justify-center"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[400px] text-center">
              <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
                404
              </h2>
              <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
                {t('not_found_heading')}
              </h4>
              <p className="mb-8 text-lg text-white">
                {t('not_found_description')}
              </p>
              <Link
                to="/"
                className="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-white hover:text-dairy-blue"
              >
                {t('go_to_home')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14">
        <div className="h-full w-1/3 bg-gradient-to-t from-white/10 to-transparent"></div>
        <div className="flex h-full w-1/3">
          <div className="h-full w-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
          <div className="h-full w-1/2 bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>
        <div className="h-full w-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
      </div>
    </motion.section>
  );
};

export default NotFound;
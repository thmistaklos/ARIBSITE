import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/products' },
    { name: t('our_distributors'), path: '/distributors' },
    { name: t('recipes'), path: '/recipes' },
    { name: t('our_blog'), path: '/blog' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const navLinkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, color: 'hsl(var(--dairy-darkBlue))' },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="sticky top-16 z-40 w-full bg-dairy-cream/90 backdrop-blur-sm border-b border-dairy-blue/20 shadow-sm"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-dairy-darkBlue" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-dairy-cream p-6">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item, index) => (
                  <Link key={item.name} to={item.path} className="text-lg font-medium text-dairy-darkBlue hover:text-dairy-blue transition-colors">
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 text-right"> {/* Added text-right here */}
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                variants={navLinkVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
              >
                <Link
                  to={item.path}
                  className="text-lg font-medium text-dairy-text hover:text-dairy-darkBlue transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        )}
        <LanguageSwitcher />
      </div>
    </motion.header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(location.pathname);

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/products' },
    { name: t('our_distributors'), path: '/distributors' },
    { name: t('recipes'), path: '/recipes' },
    { name: t('our_blog'), path: '/blog' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const DesktopNav = () => (
    <nav className="animated-nav" onMouseLeave={() => setHoveredPath(location.pathname)}>
      <div className="animated-nav-container">
        {navItems.map((item) => {
          const isActive = item.path === location.pathname;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "animated-nav-btn",
                isActive ? "text-accent-yellow" : "text-white"
              )}
              onMouseEnter={() => setHoveredPath(item.path)}
            >
              <span>{item.name}</span>
              {item.path === hoveredPath && (
                <motion.div
                  className="animated-nav-underline"
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        <div className="ml-4">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6 text-dairy-darkBlue" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-dairy-cream p-6">
        <nav className="flex flex-col space-y-4 mt-8">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="text-lg font-medium text-dairy-darkBlue hover:text-dairy-blue transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-dairy-cream/90 backdrop-blur-sm border-b border-dairy-blue/20 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <img src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//0222-removebg-preview%20(1).png" alt="ARIB DAIRY Logo" className="h-12 w-12 object-contain" />
        </Link>

        {isMobile ? <MobileNav /> : <DesktopNav />}
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, FileText, Settings, LogOut, Truck, BookOpen, Newspaper, HelpCircle, Lightbulb } from 'lucide-react'; // Added Lightbulb for Facts
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Distributors', path: '/admin/distributors', icon: Truck },
  { name: 'Recipes', path: '/admin/recipes', icon: BookOpen },
  { name: 'Blog', path: '/admin/blog', icon: Newspaper },
  { name: 'Content', path: '/admin/content', icon: FileText },
  { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
  { name: 'Facts', path: '/admin/facts', icon: Lightbulb }, // New Facts item
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const renderNavLinks = () => (
    <nav className="flex flex-col space-y-2 px-2 py-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
        return (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-dairy-text transition-all hover:bg-dairy-blue/20 hover:text-dairy-darkBlue",
                    isActive && "bg-dairy-blue text-dairy-cream hover:bg-dairy-blue hover:text-dairy-cream"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </nav>
  );

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="flex h-full flex-col border-r border-dairy-blue/20 bg-dairy-white shadow-lg"
    >
      <div className="flex h-16 items-center justify-center border-b border-dairy-blue/20 px-4">
        <Link to="/admin" className="flex items-center space-x-2">
          <img src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//0222-removebg-preview%20(1).png" alt="ARIB ADMIN Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold text-dairy-darkBlue">ARIB ADMIN</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-4">
                <LayoutDashboard className="h-6 w-6 text-dairy-darkBlue" />
                <span className="sr-only">Toggle dashboard menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-dairy-white p-0">
              <div className="flex h-16 items-center justify-center border-b border-dairy-blue/20">
                <Link to="/admin" className="flex items-center space-x-2">
                  <img src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//0222-removebg-preview%20(1).png" alt="ARIB ADMIN Logo" className="h-8 w-8 object-contain" />
                  <span className="text-xl font-bold text-dairy-darkBlue">ARIB ADMIN</span>
                </Link>
              </div>
              {renderNavLinks()}
            </SheetContent>
          </Sheet>
        ) : (
          renderNavLinks()
        )}
      </div>
      <div className="mt-auto border-t border-dairy-blue/20 p-4">
        <Button variant="ghost" className="w-full justify-start text-dairy-text hover:bg-dairy-blue/20 hover:text-dairy-darkBlue" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
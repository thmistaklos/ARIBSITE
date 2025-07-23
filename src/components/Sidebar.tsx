import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, FileText, Settings, LogOut, Truck, BookOpen, Newspaper, HelpCircle, Lightbulb, Percent, GalleryHorizontal, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Hero Carousel', path: '/admin/herocarousel', icon: GalleryHorizontal },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Distributors', path: '/admin/distributors', icon: Truck },
  { name: 'Recipes', path: '/admin/recipes', icon: BookOpen },
  { name: 'Blog', path: '/admin/blog', icon: Newspaper },
  { name: 'Content', path: '/admin/content', icon: FileText },
  { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
  { name: 'Facts', path: '/admin/facts', icon: Lightbulb },
  { name: 'Farm Info', path: '/admin/farminfo', icon: Leaf },
  { name: 'Discounts', path: '/admin/discounts', icon: Percent },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const SidebarContent: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-dairy-white">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <img src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//0222-removebg-preview%20(1).png" alt="ARIB ADMIN Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold text-dairy-darkBlue">ARIB ADMIN</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-dairy-text transition-all hover:bg-dairy-blue/20",
                  isActive && "bg-dairy-blue text-dairy-cream hover:bg-dairy-blue"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="h-full"
    >
      <SidebarContent />
    </motion.div>
  );
};

export default Sidebar;
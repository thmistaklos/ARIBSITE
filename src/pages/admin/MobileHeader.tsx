import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Link } from 'react-router-dom';

const MobileHeader: React.FC = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-dairy-white px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <img src="https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//0222-removebg-preview%20(1).png" alt="ARIB ADMIN Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold text-dairy-darkBlue">ARIB ADMIN</span>
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
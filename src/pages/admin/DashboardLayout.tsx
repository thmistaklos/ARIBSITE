import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import MobileHeader from './MobileHeader';

const DashboardLayout: React.FC = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-dairy-cream text-dairy-text">
      <div className="hidden border-r bg-dairy-white md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <MobileHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
      <SonnerToaster />
    </div>
  );
};

export default DashboardLayout;
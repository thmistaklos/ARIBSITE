import React from 'react';
import { Outlet } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-dairy-cream text-dairy-text">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel defaultSize={18} minSize={15} maxSize={25} className="hidden md:block">
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={82}>
          <div className="flex flex-col h-full">
            {/* Admin Header can go here if different from public header */}
            <main className="flex-grow p-6">
              <Outlet />
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster />
      <SonnerToaster />
    </div>
  );
};

export default DashboardLayout;
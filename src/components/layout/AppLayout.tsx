'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children?: React.ReactNode;
  currentTab?: string;
  showSearch?: boolean;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentTab = 'studio',
  showSearch = true,
  className
}) => {
  const [activeTab, setActiveTab] = useState(currentTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    console.log('Tab changed to:', tabId);
    // TODO: Implement actual routing logic
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-primary-50 via-white to-cultural-primary/5', className)}>
      <Header
        currentTab={activeTab}
        onTabChange={handleTabChange}
        showSearch={showSearch}
      />
      
      <main className="flex-1 relative isolate">
        {children}
      </main>
      
      {/* Optional Footer */}
      <footer className="mt-auto border-t border-primary-200/50 bg-white/80 backdrop-blur-sm">
        <Container maxWidth="2xl" padding="md">
          <div className="py-8 text-center">
            <p className="text-sm text-primary-600">
              © 2024 DesignVisualz. Powered by Cultural Intelligence AI.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default AppLayout;
export { AppLayout };
export type { AppLayoutProps };
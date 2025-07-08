'use client';

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Eye, 
  Globe, 
  Sofa, 
  Search, 
  Share2, 
  Download, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Container } from '@/components/layout/Container';
import { useTheme, ThemeSelector } from '@/components/cultural/ThemeProvider';

// Navigation tab configuration
const navigationTabs = [
  {
    id: 'studio',
    label: 'Design Studio',
    icon: Palette,
    href: '/studio',
    description: 'Create your perfect event design'
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: Eye,
    href: '/gallery',
    description: 'Browse inspiring designs'
  },
  {
    id: 'cultural',
    label: 'Cultural Guide',
    icon: Globe,
    href: '/cultural',
    description: 'Learn about design traditions'
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Sofa,
    href: '/marketplace',
    description: 'Shop curated products'
  }
];

interface HeaderProps {
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
  showSearch?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  currentTab = 'studio',
  onTabChange,
  showSearch = true,
  className
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentTheme, isTransitioning } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab change
  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  // Handle search
  const handleSearchSubmit = (query: string) => {
    console.log('Search:', query);
    // TODO: Implement search functionality
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-primary-200/50' 
            : 'bg-transparent',
          isTransitioning && 'transition-colors duration-300',
          className
        )}
      >
        <Container maxWidth="2xl" padding="md">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}, ${currentTheme.colorPalette.secondary})`
                  }}
                >
                  DV
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cultural-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-900">
                  Design<span className="text-cultural-primary">Visualz</span>
                </h1>
                <p className="text-xs text-primary-600 -mt-1">
                  Cultural Intelligence AI
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      'group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200',
                      'hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-cultural-primary focus:ring-offset-1',
                      isActive 
                        ? 'bg-cultural-primary/10 text-cultural-primary' 
                        : 'text-primary-600 hover:text-primary-900'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      'group-hover:scale-110',
                      isActive && 'text-cultural-primary'
                    )} />
                    <span className={cn(
                      'font-medium text-sm',
                      isActive && 'font-semibold'
                    )}>
                      {tab.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-cultural-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-3">
              {/* Desktop Search */}
              {showSearch && (
                <div className="hidden md:block">
                  <Input
                    type="search"
                    placeholder="Search designs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit(searchQuery);
                      }
                    }}
                    icon={<Search className="w-4 h-4" />}
                    className="w-64"
                    cultural
                  />
                </div>
              )}

              {/* Theme Selector */}
              <div className="hidden sm:block">
                <ThemeSelector 
                  variant="pills" 
                  showLabels={false}
                  className="scale-90"
                />
              </div>

              {/* Action Buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Share2 className="w-4 h-4" />}
                  className="text-primary-600 hover:text-cultural-primary"
                >
                  Share
                </Button>
                <Button
                  variant="cultural"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                >
                  Export
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors duration-200',
                  'text-primary-600 hover:text-primary-900 hover:bg-primary-50',
                  'focus:outline-none focus:ring-2 focus:ring-cultural-primary focus:ring-offset-1'
                )}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Menu */}
      <div className={cn(
        'fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] transform transition-transform duration-300 lg:hidden',
        'bg-white shadow-2xl',
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary-200">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}, ${currentTheme.colorPalette.secondary})`
                }}
              >
                DV
              </div>
              <div>
                <h2 className="font-bold text-primary-900">DesignVisualz</h2>
                <p className="text-xs text-primary-600">Menu</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-primary-500 hover:text-primary-700 hover:bg-primary-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="p-6 border-b border-primary-100">
              <Input
                type="search"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchQuery);
                    setIsMobileMenuOpen(false);
                  }
                }}
                icon={<Search className="w-4 h-4" />}
                cultural
              />
            </div>
          )}

          {/* Mobile Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      'w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left',
                      'hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-cultural-primary focus:ring-offset-1',
                      isActive 
                        ? 'bg-cultural-primary/10 text-cultural-primary border border-cultural-primary/20' 
                        : 'text-primary-600 hover:text-primary-900'
                    )}
                  >
                    <Icon className={cn(
                      'w-6 h-6 flex-shrink-0',
                      isActive && 'text-cultural-primary'
                    )} />
                    <div className="flex-1">
                      <div className={cn(
                        'font-medium',
                        isActive && 'font-semibold text-cultural-primary'
                      )}>
                        {tab.label}
                      </div>
                      <div className="text-sm text-primary-500">
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Mobile Theme Selector & Actions */}
          <div className="p-6 border-t border-primary-200 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-primary-700 mb-3">Cultural Theme</h3>
              <ThemeSelector variant="dropdown" className="w-full" />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
                className="flex-1"
              >
                Share
              </Button>
              <Button
                variant="cultural"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                className="flex-1"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
export { Header };
export type { HeaderProps };
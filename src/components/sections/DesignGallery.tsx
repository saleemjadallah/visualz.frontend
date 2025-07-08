'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Share2, 
  Download,
  Eye,
  Sparkles,
  ChevronDown,
  X,
  Star,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/layout/Container';
import { CulturalBadge } from '@/components/ui/CulturalBadge';
import { useTheme } from '@/components/cultural/ThemeProvider';
import { cn } from '@/lib/utils';
import { Design, CultureType, EventType, BudgetTier } from '@/lib/types';
import { DesignDetailModal } from '@/components/modals/DesignDetailModal';

interface DesignGalleryProps {
  designs?: Design[];
  onDesignSelect?: (design: Design) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'popular' | 'likes' | 'budget';

// Mock design data for demonstration
const mockDesigns: Design[] = [
  {
    id: '1',
    projectId: 'p1',
    title: 'Zen Garden Wedding',
    description: 'A serene Japanese-inspired wedding celebration with natural materials and minimalist elegance',
    culturalInfluences: ['japanese'],
    designElements: [],
    colorPalette: ['#2c3e50', '#8b7355', '#d4af37', '#f5f5f4'],
    materials: ['bamboo', 'natural stone', 'silk', 'paper'],
    estimatedBudget: { min: 15000, max: 25000, breakdown: [] },
    images: ['/api/placeholder/400/300'],
    aiPrompt: 'Japanese wedding with wabi-sabi principles',
    culturalSensitivityScore: 95,
    likes: 142,
    shares: 23,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    projectId: 'p2',
    title: 'Hygge Birthday Celebration',
    description: 'Cozy Scandinavian birthday party with warm lighting and natural textures',
    culturalInfluences: ['scandinavian'],
    designElements: [],
    colorPalette: ['#4a5568', '#e2e8f0', '#f7fafc', '#d69e2e'],
    materials: ['birch wood', 'wool', 'candles', 'linen'],
    estimatedBudget: { min: 3000, max: 8000, breakdown: [] },
    images: ['/api/placeholder/400/300'],
    aiPrompt: 'Scandinavian hygge birthday celebration',
    culturalSensitivityScore: 92,
    likes: 89,
    shares: 15,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    projectId: 'p3',
    title: 'Bella Figura Corporate Gala',
    description: 'Elegant Italian-inspired corporate event with luxurious materials and sophisticated design',
    culturalInfluences: ['italian'],
    designElements: [],
    colorPalette: ['#8b4513', '#deb887', '#ffd700', '#2c2c2c'],
    materials: ['marble', 'velvet', 'gold leaf', 'crystal'],
    estimatedBudget: { min: 35000, max: 75000, breakdown: [] },
    images: ['/api/placeholder/400/300'],
    aiPrompt: 'Italian corporate gala with bella figura elegance',
    culturalSensitivityScore: 88,
    likes: 256,
    shares: 42,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    projectId: 'p4',
    title: 'French Château Wedding',
    description: 'Sophisticated French wedding with classical elements and refined details',
    culturalInfluences: ['french'],
    designElements: [],
    colorPalette: ['#2d3748', '#e2e8f0', '#d69e2e', '#ffffff'],
    materials: ['antique wood', 'silk', 'crystal', 'gold'],
    estimatedBudget: { min: 45000, max: 85000, breakdown: [] },
    images: ['/api/placeholder/400/300'],
    aiPrompt: 'French château wedding with savoir-vivre',
    culturalSensitivityScore: 91,
    likes: 198,
    shares: 31,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '5',
    projectId: 'p5',
    title: 'Innovation Hub Launch',
    description: 'Bold American-style tech company launch with modern design and innovative elements',
    culturalInfluences: ['american'],
    designElements: [],
    colorPalette: ['#1a202c', '#4299e1', '#e53e3e', '#f7fafc'],
    materials: ['steel', 'glass', 'LED panels', 'tech fabrics'],
    estimatedBudget: { min: 25000, max: 50000, breakdown: [] },
    images: ['/api/placeholder/400/300'],
    aiPrompt: 'American innovation tech launch event',
    culturalSensitivityScore: 85,
    likes: 167,
    shares: 28,
    createdAt: new Date('2024-01-22')
  },
  {
    id: '6',
    projectId: 'p6',
    title: 'Cultural Fusion Celebration',
    description: 'Beautiful blend of Japanese and Italian influences for a multicultural celebration',
    culturalInfluences: ['japanese', 'italian'],
    designElements: [],
    colorPalette: ['#2c3e50', '#8b4513', '#d4af37', '#deb887'],
    materials: ['bamboo', 'marble', 'silk', 'gold'],
    estimatedBudget: { min: 20000, max: 40000, breakdown: [] },
    images: ['/api/placeholder/400/300'],
    aiPrompt: 'Japanese-Italian cultural fusion celebration',
    culturalSensitivityScore: 94,
    likes: 203,
    shares: 35,
    createdAt: new Date('2024-01-25')
  }
];

const DesignGallery: React.FC<DesignGalleryProps> = ({
  designs = mockDesigns,
  onDesignSelect,
  className
}) => {
  const { currentTheme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCultures, setSelectedCultures] = useState<CultureType[]>([]);
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<BudgetTier | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [likedDesigns, setLikedDesigns] = useState<Set<string>>(new Set());
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [bookmarkedDesigns, setBookmarkedDesigns] = useState<Set<string>>(new Set());

  // Filter and sort designs
  const filteredAndSortedDesigns = useMemo(() => {
    let filtered = designs.filter(design => {
      // Text search
      const matchesSearch = !searchQuery || 
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.materials.some(material => material.toLowerCase().includes(searchQuery.toLowerCase()));

      // Culture filter
      const matchesCulture = selectedCultures.length === 0 ||
        selectedCultures.some(culture => design.culturalInfluences.includes(culture));

      // Budget filter
      const matchesBudget = !selectedBudgetTier || (() => {
        const avgBudget = (design.estimatedBudget.min + design.estimatedBudget.max) / 2;
        switch (selectedBudgetTier) {
          case 'modest': return avgBudget <= 5000;
          case 'comfortable': return avgBudget > 5000 && avgBudget <= 15000;
          case 'luxurious': return avgBudget > 15000 && avgBudget <= 50000;
          case 'unlimited': return avgBudget > 50000;
          default: return true;
        }
      })();

      return matchesSearch && matchesCulture && matchesBudget;
    });

    // Sort designs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.shares) - (a.likes + a.shares);
        case 'likes':
          return b.likes - a.likes;
        case 'budget':
          return a.estimatedBudget.min - b.estimatedBudget.min;
        case 'recent':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [designs, searchQuery, selectedCultures, selectedBudgetTier, sortBy]);

  const toggleLike = (designId: string) => {
    setLikedDesigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) {
        newSet.delete(designId);
      } else {
        newSet.add(designId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (designId: string) => {
    setBookmarkedDesigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) {
        newSet.delete(designId);
      } else {
        newSet.add(designId);
      }
      return newSet;
    });
  };

  const toggleCultureFilter = (culture: CultureType) => {
    setSelectedCultures(prev => 
      prev.includes(culture) 
        ? prev.filter(c => c !== culture)
        : [...prev, culture]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCultures([]);
    setSelectedBudgetTier('');
    setSortBy('recent');
  };

  const cultures: { type: CultureType; name: string; flag: string }[] = [
    { type: 'japanese', name: 'Japanese', flag: '🇯🇵' },
    { type: 'scandinavian', name: 'Scandinavian', flag: '🇸🇪' },
    { type: 'italian', name: 'Italian', flag: '🇮🇹' },
    { type: 'french', name: 'French', flag: '🇫🇷' },
    { type: 'american', name: 'American', flag: '🇺🇸' }
  ];

  const budgetTiers = [
    { tier: 'modest' as BudgetTier, label: 'Modest ($500-$2K)', icon: '💰' },
    { tier: 'comfortable' as BudgetTier, label: 'Comfortable ($2K-$8K)', icon: '💎' },
    { tier: 'luxurious' as BudgetTier, label: 'Luxurious ($8K-$25K)', icon: '👑' },
    { tier: 'unlimited' as BudgetTier, label: 'Unlimited ($25K+)', icon: '✨' }
  ];

  return (
    <div className={cn("space-y-8", className)}>
      <Container maxWidth="full" padding="lg">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-cultural-primary/10 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-cultural-primary" />
            <span className="text-sm font-medium text-cultural-primary">AI-Generated Designs</span>
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
            Design Gallery
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Explore culturally-intelligent event designs created by our AI system
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Top Row: Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search designs, materials, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:border-cultural-primary focus:ring-2 focus:ring-cultural-primary/20"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  icon={<Filter />}
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "border-2 border-primary-200",
                    showFilters ? "bg-cultural-primary/10 border-cultural-primary" : ""
                  )}
                >
                  Filters
                </Button>

                <div className="flex bg-primary-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'cultural' : 'ghost'}
                    size="sm"
                    icon={<Grid3X3 />}
                    onClick={() => setViewMode('grid')}
                    className="px-3 py-2"
                  />
                  <Button
                    variant={viewMode === 'list' ? 'cultural' : 'ghost'}
                    size="sm"
                    icon={<List />}
                    onClick={() => setViewMode('list')}
                    className="px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-primary-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cultural Filters */}
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-3">
                        Cultural Influences
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {cultures.map((culture) => (
                          <button
                            key={culture.type}
                            onClick={() => toggleCultureFilter(culture.type)}
                            className={cn(
                              "inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all",
                              selectedCultures.includes(culture.type)
                                ? "bg-cultural-primary text-white"
                                : "bg-primary-100 text-primary-700 hover:bg-cultural-primary/10"
                            )}
                          >
                            <span>{culture.flag}</span>
                            <span>{culture.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Filter */}
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-3">
                        Budget Range
                      </label>
                      <select
                        value={selectedBudgetTier}
                        onChange={(e) => setSelectedBudgetTier(e.target.value as BudgetTier | '')}
                        className="w-full p-2 border border-primary-300 rounded-lg focus:border-cultural-primary focus:ring-2 focus:ring-cultural-primary/20"
                      >
                        <option value="">All Budgets</option>
                        {budgetTiers.map((budget) => (
                          <option key={budget.tier} value={budget.tier}>
                            {budget.icon} {budget.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-3">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="w-full p-2 border border-primary-300 rounded-lg focus:border-cultural-primary focus:ring-2 focus:ring-cultural-primary/20"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="likes">Most Liked</option>
                        <option value="budget">Budget (Low to High)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters & Clear */}
                  {(selectedCultures.length > 0 || selectedBudgetTier || searchQuery) && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-200">
                      <div className="flex flex-wrap gap-2">
                        {selectedCultures.map((culture) => (
                          <span
                            key={culture}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-cultural-primary/10 text-cultural-primary rounded text-sm"
                          >
                            <span>{cultures.find(c => c.type === culture)?.flag}</span>
                            <span>{cultures.find(c => c.type === culture)?.name}</span>
                            <button onClick={() => toggleCultureFilter(culture)}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {selectedBudgetTier && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-cultural-primary/10 text-cultural-primary rounded text-sm">
                            <span>{budgetTiers.find(b => b.tier === selectedBudgetTier)?.icon}</span>
                            <span>{budgetTiers.find(b => b.tier === selectedBudgetTier)?.label}</span>
                            <button onClick={() => setSelectedBudgetTier('')}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-primary-600">
            <span className="font-medium text-primary-900">{filteredAndSortedDesigns.length}</span> designs found
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
          </div>
          <div className="text-sm text-primary-500">
            Sorted by {sortBy === 'recent' ? 'most recent' : sortBy === 'popular' ? 'popularity' : sortBy === 'likes' ? 'likes' : 'budget'}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "flex flex-col space-y-6"
          )}
        >
          {filteredAndSortedDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DesignCard
                design={design}
                viewMode={viewMode}
                isLiked={likedDesigns.has(design.id)}
                onLike={() => toggleLike(design.id)}
                onSelect={() => {
                  setSelectedDesign(design);
                  onDesignSelect?.(design);
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredAndSortedDesigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary-900 mb-2">
              No designs found
            </h3>
            <p className="text-primary-600 mb-6">
              Try adjusting your filters or search terms to find more results
            </p>
            <Button variant="cultural" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Design Detail Modal */}
        {selectedDesign && (
          <DesignDetailModal
            design={selectedDesign}
            isOpen={!!selectedDesign}
            onClose={() => setSelectedDesign(null)}
            isLiked={likedDesigns.has(selectedDesign.id)}
            onLike={() => toggleLike(selectedDesign.id)}
            isBookmarked={bookmarkedDesigns.has(selectedDesign.id)}
            onBookmark={() => toggleBookmark(selectedDesign.id)}
          />
        )}
      </Container>
    </div>
  );
};

// Design Card Component
interface DesignCardProps {
  design: Design;
  viewMode: ViewMode;
  isLiked: boolean;
  onLike: () => void;
  onSelect: () => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  viewMode,
  isLiked,
  onLike,
  onSelect
}) => {
  const getBudgetTier = (budget: { min: number; max: number }): string => {
    const avg = (budget.min + budget.max) / 2;
    if (avg <= 5000) return 'Modest';
    if (avg <= 15000) return 'Comfortable';
    if (avg <= 50000) return 'Luxurious';
    return 'Unlimited';
  };

  const formatBudget = (budget: { min: number; max: number }): string => {
    const format = (num: number) => {
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };
    return `${format(budget.min)} - ${format(budget.max)}`;
  };

  if (viewMode === 'list') {
    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex space-x-6">
          {/* Image */}
          <div className="relative w-48 h-32 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-cultural-primary/20 to-cultural-secondary/30 rounded-lg flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cultural-primary" />
            </div>
            
            {/* Cultural Badge */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {design.culturalInfluences.map((culture, index) => (
                <CulturalBadge key={index} culture={culture} />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-primary-900 group-hover:text-cultural-primary transition-colors">
                {design.title}
              </h3>
              <p className="text-primary-600 text-sm leading-relaxed">
                {design.description}
              </p>
            </div>

            {/* Details */}
            <div className="flex items-center space-x-6 text-sm text-primary-500">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatBudget(design.estimatedBudget)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{design.culturalSensitivityScore}% Cultural Score</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{design.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Materials */}
            <div>
              <span className="text-xs text-primary-500 font-medium">Materials: </span>
              <span className="text-xs text-primary-600">
                {design.materials.join(', ')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "")} />}
              onClick={() => onLike()}
            />
            <span className="text-xs text-primary-500">{design.likes}</span>
            
            <Button
              variant="ghost"
              size="sm"
              icon={<Share2 />}
              onClick={() => {}}
            />
            
            <Button
              variant="cultural"
              size="sm"
              icon={<Eye />}
              onClick={onSelect}
            />
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative aspect-[4/3]">
        <div className="w-full h-full bg-gradient-to-br from-cultural-primary/20 to-cultural-secondary/30 flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-cultural-primary" />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye />}
            onClick={onSelect}
            className="text-white border-white hover:bg-white/20"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Share2 />}
            className="text-white border-white hover:bg-white/20"
          />
        </div>

        {/* Cultural Badges */}
        <div className="absolute top-3 left-3 flex space-x-1">
          {design.culturalInfluences.map((culture, index) => (
            <CulturalBadge key={index} culture={culture} />
          ))}
        </div>

        {/* Budget Tier */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-primary-700">
            {getBudgetTier(design.estimatedBudget)}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-primary-900 group-hover:text-cultural-primary transition-colors mb-1">
            {design.title}
          </h3>
          <p className="text-sm text-primary-600 line-clamp-2">
            {design.description}
          </p>
        </div>

        {/* Color Palette */}
        <div className="flex space-x-1">
          {design.colorPalette.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onLike()}
                className={cn(
                  "flex items-center space-x-1 hover:text-red-500 transition-colors",
                  isLiked ? "text-red-500" : "text-primary-500"
                )}
              >
                <Heart className={cn("w-4 h-4", isLiked ? "fill-current" : "")} />
                <span>{design.likes}</span>
              </button>
            </div>
            <span className="text-primary-400">•</span>
            <span className="text-primary-500">{formatBudget(design.estimatedBudget)}</span>
          </div>
          <div className="flex items-center space-x-1 text-primary-500">
            <Star className="w-3 h-3" />
            <span className="text-xs">{design.culturalSensitivityScore}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DesignGallery;
export { DesignGallery };
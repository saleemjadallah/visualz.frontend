'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Share2, 
  Download, 
  Star, 
  DollarSign,
  Calendar,
  Users,
  Palette,
  Eye,
  MessageCircle,
  Bookmark,
  ExternalLink,
  Copy,
  CheckCircle,
  Globe,
  Sparkles,
  Clock,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CulturalBadge } from '@/components/ui/CulturalBadge';
import { useTheme } from '@/components/cultural/ThemeProvider';
import { cn } from '@/lib/utils';
import { Design } from '@/lib/types';

interface DesignDetailModalProps {
  design: Design;
  isOpen: boolean;
  onClose: () => void;
  isLiked?: boolean;
  onLike?: () => void;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

const DesignDetailModal: React.FC<DesignDetailModalProps> = ({
  design,
  isOpen,
  onClose,
  isLiked = false,
  onLike,
  isBookmarked = false,
  onBookmark
}) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'cultural' | 'budget'>('overview');
  const [copied, setCopied] = useState(false);

  const formatBudget = (budget: { min: number; max: number }): string => {
    const format = (num: number) => {
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };
    return `${format(budget.min)} - ${format(budget.max)}`;
  };

  const getBudgetTier = (budget: { min: number; max: number }): string => {
    const avg = (budget.min + budget.max) / 2;
    if (avg <= 5000) return 'Modest';
    if (avg <= 15000) return 'Comfortable';
    if (avg <= 50000) return 'Luxurious';
    return 'Unlimited';
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + `?design=${design.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'materials', label: 'Materials', icon: <Palette className="w-4 h-4" /> },
    { id: 'cultural', label: 'Cultural Context', icon: <Globe className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget Breakdown', icon: <DollarSign className="w-4 h-4" /> }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary-200">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">{design.title}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex space-x-1">
                    {design.culturalInfluences.map((culture, index) => (
                      <CulturalBadge key={index} culture={culture} />
                    ))}
                  </div>
                  <span className="text-sm text-primary-500">
                    Created {design.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "")} />}
                onClick={onLike}
                className="px-3"
              >
                {design.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Bookmark className={cn("w-4 h-4", isBookmarked ? "fill-cultural-primary text-cultural-primary" : "")} />}
                onClick={onBookmark}
                className="px-3"
              />
              <Button
                variant="ghost"
                size="sm"
                icon={copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                onClick={handleShare}
                className="px-3"
              >
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<X />}
                onClick={onClose}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 h-[calc(90vh-80px)]">
            {/* Left Side - Image and Gallery */}
            <div className="relative bg-gradient-to-br from-cultural-primary/10 to-cultural-secondary/15 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-cultural-primary/20 to-cultural-secondary/30 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-24 h-24 text-cultural-primary" />
                  
                  {/* Overlay Stats */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                      <div className="flex items-center space-x-1 text-cultural-primary">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-bold">{design.culturalSensitivityScore}%</span>
                      </div>
                      <div className="text-xs text-primary-600">Cultural Score</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                      <div className="text-sm font-bold text-primary-900">{getBudgetTier(design.estimatedBudget)}</div>
                      <div className="text-xs text-primary-600">Budget Tier</div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-xs text-primary-600 mb-2">Color Palette</div>
                      <div className="flex space-x-2">
                        {design.colorPalette.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col">
              {/* Tabs */}
              <div className="border-b border-primary-200">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === tab.id
                          ? "border-cultural-primary text-cultural-primary"
                          : "border-transparent text-primary-600 hover:text-primary-900"
                      )}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-900 mb-3">Description</h3>
                          <p className="text-primary-700 leading-relaxed">{design.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Heart className="w-5 h-5 text-red-500" />
                              <span className="font-medium text-primary-900">Popularity</span>
                            </div>
                            <div className="text-2xl font-bold text-primary-900">{design.likes}</div>
                            <div className="text-sm text-primary-600">likes • {design.shares} shares</div>
                          </Card>

                          <Card className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Award className="w-5 h-5 text-cultural-primary" />
                              <span className="font-medium text-primary-900">Quality Score</span>
                            </div>
                            <div className="text-2xl font-bold text-cultural-primary">
                              {design.culturalSensitivityScore}%
                            </div>
                            <div className="text-sm text-primary-600">cultural sensitivity</div>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-primary-900 mb-3">AI Generation Prompt</h3>
                          <Card className="p-4 bg-primary-50">
                            <div className="flex items-start space-x-3">
                              <Sparkles className="w-5 h-5 text-cultural-primary mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-primary-900 mb-1">Original Prompt</div>
                                <p className="text-primary-700 italic">"{design.aiPrompt}"</p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )}

                    {activeTab === 'materials' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-900 mb-4">Selected Materials</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {design.materials.map((material, index) => (
                              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                                <div className="font-medium text-primary-900 capitalize">{material}</div>
                                <div className="text-sm text-primary-600 mt-1">
                                  Premium quality • Culturally appropriate
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-primary-900 mb-4">Color Psychology</h3>
                          <div className="space-y-3">
                            {design.colorPalette.map((color, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <div
                                  className="w-12 h-12 rounded-lg border border-primary-200 shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                                <div>
                                  <div className="font-medium text-primary-900">{color}</div>
                                  <div className="text-sm text-primary-600">
                                    {index === 0 && "Primary accent - creates focal points"}
                                    {index === 1 && "Secondary tone - provides balance"}
                                    {index === 2 && "Supporting color - adds warmth"}
                                    {index === 3 && "Neutral base - ensures harmony"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'cultural' && (
                      <div className="space-y-6">
                        {design.culturalInfluences.map((culture, index) => (
                          <Card key={index} className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <CulturalBadge culture={culture} />
                              <div>
                                <h3 className="text-lg font-semibold text-primary-900 capitalize">
                                  {culture} Influence
                                </h3>
                                <div className="text-sm text-primary-600">
                                  Cultural philosophy integration
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-primary-900 mb-2">Design Principles Applied</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {culture === 'japanese' && ['Wabi-Sabi', 'Minimalism', 'Natural harmony', 'Imperfect beauty'].map((principle, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-sm text-primary-700">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>{principle}</span>
                                    </div>
                                  ))}
                                  {culture === 'scandinavian' && ['Hygge', 'Simplicity', 'Natural materials', 'Cozy atmosphere'].map((principle, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-sm text-primary-700">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>{principle}</span>
                                    </div>
                                  ))}
                                  {culture === 'italian' && ['Bella Figura', 'Luxury', 'Rich textures', 'Sophisticated elegance'].map((principle, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-sm text-primary-700">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>{principle}</span>
                                    </div>
                                  ))}
                                  {culture === 'french' && ['Savoir-Vivre', 'Refinement', 'Classic elegance', 'Artistic flair'].map((principle, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-sm text-primary-700">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>{principle}</span>
                                    </div>
                                  ))}
                                  {culture === 'american' && ['Innovation', 'Bold expression', 'Individual style', 'Modern comfort'].map((principle, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-sm text-primary-700">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>{principle}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-primary-900 mb-2">Cultural Sensitivity</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="w-full bg-primary-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${design.culturalSensitivityScore}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-green-600">
                                    {design.culturalSensitivityScore}%
                                  </span>
                                </div>
                                <p className="text-sm text-primary-600 mt-2">
                                  This design respectfully incorporates authentic cultural elements without appropriation.
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {activeTab === 'budget' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-900 mb-4">Budget Overview</h3>
                          <Card className="p-6 bg-gradient-to-r from-cultural-primary/10 to-cultural-secondary/10">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <div className="text-3xl font-bold text-cultural-primary">
                                  {formatBudget(design.estimatedBudget)}
                                </div>
                                <div className="text-sm text-primary-600">Estimated Range</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-primary-900">
                                  {getBudgetTier(design.estimatedBudget)}
                                </div>
                                <div className="text-sm text-primary-600">Budget Tier</div>
                              </div>
                            </div>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-primary-900 mb-4">Cost Breakdown</h3>
                          <div className="space-y-3">
                            {[
                              { category: 'Venue & Space', percentage: 40, amount: Math.round((design.estimatedBudget.min + design.estimatedBudget.max) / 2 * 0.4) },
                              { category: 'Materials & Decor', percentage: 25, amount: Math.round((design.estimatedBudget.min + design.estimatedBudget.max) / 2 * 0.25) },
                              { category: 'Cultural Elements', percentage: 15, amount: Math.round((design.estimatedBudget.min + design.estimatedBudget.max) / 2 * 0.15) },
                              { category: 'Setup & Service', percentage: 20, amount: Math.round((design.estimatedBudget.min + design.estimatedBudget.max) / 2 * 0.2) }
                            ].map((item, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-primary-900">{item.category}</span>
                                  <span className="text-lg font-bold text-cultural-primary">
                                    ${item.amount.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="flex-1 bg-primary-200 rounded-full h-2">
                                    <div
                                      className="bg-cultural-primary h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-primary-600">{item.percentage}%</span>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <Card className="p-4 bg-amber-50 border-amber-200">
                          <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-amber-900 mb-1">Budget Optimization</div>
                              <p className="text-sm text-amber-800">
                                This budget includes cultural consultation to ensure authentic representation
                                and avoid inappropriate elements.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-primary-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-primary-500">
                    Generated on {design.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="ghost" size="sm" icon={<Download />}>
                      Export
                    </Button>
                    <Button variant="ghost" size="sm" icon={<MessageCircle />}>
                      Feedback
                    </Button>
                    <Button variant="cultural" size="sm" icon={<ExternalLink />}>
                      Start Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DesignDetailModal;
export { DesignDetailModal };
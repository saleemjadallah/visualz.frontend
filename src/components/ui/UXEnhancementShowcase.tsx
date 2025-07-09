import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Sparkles, 
  Shield, 
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { CultureType, LoadingState as LoadingStateType, EmptyState, CulturalSensitivityReview } from '@/lib/types';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorBoundary from './ErrorBoundary';
import CulturalSensitivityReviewComponent from '../cultural/CulturalSensitivityReview';
import { NotificationProvider, useNotifications } from './NotificationSystem';
import Button from './Button';

interface UXEnhancementShowcaseProps {
  culturalContext?: CultureType;
}

const UXEnhancementShowcase: React.FC<UXEnhancementShowcaseProps> = ({
  culturalContext = 'american'
}) => {
  const [activeDemo, setActiveDemo] = useState<string>('loading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  // Sample data for demonstrations
  const [loadingState, setLoadingState] = useState<LoadingStateType>({
    isLoading: true,
    message: 'Generating culturally-aware design...',
    progress: 0,
    stage: 'analyzing'
  });

  const emptyStates: Record<string, EmptyState> = {
    'no-data': {
      title: 'No Designs Yet',
      description: 'Start creating your first culturally-respectful event design',
      actionLabel: 'Create Design',
      actionCallback: () => console.log('Create design clicked'),
      type: 'no-data'
    },
    'no-results': {
      title: 'No Results Found',
      description: 'Try adjusting your cultural preferences or search criteria',
      actionLabel: 'Clear Filters',
      actionCallback: () => console.log('Clear filters clicked'),
      type: 'no-results'
    },
    'error': {
      title: 'Cultural Validation Error',
      description: 'Unable to validate cultural sensitivity. Please try again.',
      actionLabel: 'Retry Validation',
      actionCallback: () => console.log('Retry clicked'),
      type: 'error'
    },
    'coming-soon': {
      title: 'New Cultural Themes Coming Soon',
      description: 'We\'re expanding our cultural database with more authentic designs',
      type: 'coming-soon'
    }
  };

  const sampleReview: CulturalSensitivityReview = {
    id: 'review-1',
    designId: 'design-1',
    culture: culturalContext,
    reviewer: {
      id: 'reviewer-1',
      name: 'Dr. Sarah Chen',
      credentials: ['Cultural Anthropologist', 'Design Consultant'],
      culturalBackground: [culturalContext, 'american']
    },
    status: 'approved',
    score: 87,
    feedback: {
      positive: [
        'Excellent use of authentic color palette',
        'Respectful integration of cultural symbols',
        'Appropriate material choices for the event type'
      ],
      concerns: [
        'Some elements may be too modern for traditional context'
      ],
      suggestions: [
        'Consider adding more natural materials',
        'Incorporate traditional patterns in textile elements'
      ],
      culturalAccuracy: 85,
      respectfulness: 92,
      authenticity: 84
    },
    reviewDate: new Date(),
    culturalElements: [
      {
        element: 'Color Palette',
        appropriate: true,
        feedback: 'Well-chosen traditional colors'
      },
      {
        element: 'Decorative Patterns',
        appropriate: true,
        feedback: 'Authentic and respectful usage'
      },
      {
        element: 'Material Selection',
        appropriate: false,
        feedback: 'Consider more sustainable options'
      }
    ]
  };

  // Demo simulation
  useEffect(() => {
    if (isPlaying && activeDemo === 'loading') {
      const interval = setInterval(() => {
        setDemoProgress(prev => {
          const newProgress = prev + 2;
          
          // Update loading state based on progress
          let stage = 'analyzing';
          let message = 'Analyzing cultural context...';
          
          if (newProgress > 25) {
            stage = 'generating';
            message = 'Generating culturally-aware design...';
          }
          if (newProgress > 50) {
            stage = 'validating';
            message = 'Validating cultural sensitivity...';
          }
          if (newProgress > 75) {
            stage = 'finalizing';
            message = 'Finalizing design with cultural respect...';
          }
          
          setLoadingState(prev => ({
            ...prev,
            progress: newProgress,
            stage,
            message
          }));
          
          if (newProgress >= 100) {
            setIsPlaying(false);
            setLoadingState(prev => ({
              ...prev,
              isLoading: false,
              stage: 'complete'
            }));
          }
          
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, activeDemo]);

  const resetDemo = () => {
    setDemoProgress(0);
    setIsPlaying(false);
    setLoadingState({
      isLoading: true,
      message: 'Generating culturally-aware design...',
      progress: 0,
      stage: 'analyzing'
    });
  };

  const DemoControls = () => (
    <div className="flex gap-2 mb-4">
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsPlaying(!isPlaying)}
        icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        disabled={activeDemo !== 'loading'}
      >
        {isPlaying ? 'Pause' : 'Play'} Demo
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={resetDemo}
        icon={<RotateCcw className="w-4 h-4" />}
      >
        Reset
      </Button>
    </div>
  );

  const NotificationDemo = () => {
    const { addNotification } = useNotifications();
    
    const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
      const messages = {
        success: {
          title: 'Cultural Validation Passed',
          message: 'Your design respects cultural traditions and values',
          duration: 4000
        },
        error: {
          title: 'Cultural Sensitivity Error',
          message: 'Some elements may not be appropriate for this cultural context',
          duration: 6000
        },
        warning: {
          title: 'Cultural Review Needed',
          message: 'Please review the cultural appropriateness of selected elements',
          duration: 5000
        },
        info: {
          title: 'Cultural Tip',
          message: 'Consider traditional materials for authentic representation',
          duration: 4000
        }
      };
      
      addNotification({
        type,
        culturalContext,
        dismissible: true,
        ...messages[type]
      });
    };

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Notification Examples</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showNotification('success')}
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => showNotification('error')}
            icon={<Shield className="w-4 h-4" />}
          >
            Error
          </Button>
          <Button
            variant="cultural"
            size="sm"
            onClick={() => showNotification('warning')}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Warning
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showNotification('info')}
            icon={<Palette className="w-4 h-4" />}
          >
            Info
          </Button>
        </div>
      </div>
    );
  };

  return (
    <NotificationProvider culturalContext={culturalContext}>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Phase 16: Final UX Polish
          </h2>
          <p className="text-gray-600">
            Comprehensive loading states, empty states, error handling, and cultural sensitivity review
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'loading', label: 'Loading States', icon: Sparkles },
              { id: 'empty', label: 'Empty States', icon: Palette },
              { id: 'error', label: 'Error Handling', icon: Shield },
              { id: 'review', label: 'Cultural Review', icon: CheckCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveDemo(id)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  flex items-center gap-2
                  ${activeDemo === id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeDemo === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Loading State Variations
                  </h3>
                  <DemoControls />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Default</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <LoadingState state={loadingState} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Minimal</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <LoadingState 
                        state={loadingState} 
                        variant="minimal" 
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Cultural</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <LoadingState 
                        state={loadingState} 
                        variant="cultural" 
                        culturalContext={culturalContext}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeDemo === 'empty' && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Empty State Variations
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(emptyStates).map(([key, state]) => (
                    <div key={key} className="space-y-3">
                      <h4 className="font-medium text-gray-700 capitalize">
                        {key.replace('-', ' ')}
                      </h4>
                      <EmptyState 
                        state={state} 
                        culturalContext={culturalContext}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeDemo === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Error Handling & Notifications
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Error Boundary</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ErrorBoundary culturalContext={culturalContext}>
                        <div className="text-center py-8">
                          <p className="text-gray-600">
                            Protected content area. Try the notification demo instead.
                          </p>
                        </div>
                      </ErrorBoundary>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Notifications</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <NotificationDemo />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeDemo === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Cultural Sensitivity Review
                  </h3>
                </div>
                
                <CulturalSensitivityReviewComponent
                  review={sampleReview}
                  culturalContext={culturalContext}
                  onApprove={(id) => console.log('Approved:', id)}
                  onRevisionRequest={(id, feedback) => console.log('Revision requested:', id, feedback)}
                  onReject={(id, reason) => console.log('Rejected:', id, reason)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Phase 16 Implementation Complete
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">✅ Completed Features:</h4>
              <ul className="space-y-1">
                <li>• Comprehensive loading states with cultural theming</li>
                <li>• Empty state illustrations and cultural context</li>
                <li>• Error boundary with cultural preservation</li>
                <li>• Notification system with cultural awareness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🛡️ Cultural Features:</h4>
              <ul className="space-y-1">
                <li>• Cultural sensitivity review system</li>
                <li>• Cultural validation with detailed feedback</li>
                <li>• Respectful error handling and messaging</li>
                <li>• Cultural context preservation across all states</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default UXEnhancementShowcase;
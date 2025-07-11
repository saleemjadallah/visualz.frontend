import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileX, 
  Search, 
  AlertCircle, 
  Clock, 
  Plus, 
  Sparkles,
  Palette,
  Globe
} from 'lucide-react';
import { EmptyState as EmptyStateType, CultureType } from '@/lib/types';
import Button from '../../app/components/ui/Button';

interface EmptyStateProps {
  state: EmptyStateType;
  culturalContext?: CultureType;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  state,
  culturalContext = 'modern',
  className = ''
}) => {
  const getIcon = (type: EmptyStateType['type']) => {
    const iconClasses = "w-16 h-16 text-gray-400";
    
    switch (type) {
      case 'no-data':
        return <FileX className={iconClasses} />;
      case 'no-results':
        return <Search className={iconClasses} />;
      case 'error':
        return <AlertCircle className={iconClasses} />;
      case 'coming-soon':
        return <Clock className={iconClasses} />;
      default:
        return <FileX className={iconClasses} />;
    }
  };

  const getCulturalIllustration = (culture: CultureType) => {
    const illustrations = {
      japanese: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-red-500" />
          </div>
        </div>
      ),
      scandinavian: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Palette className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      ),
      italian: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-green-500" />
          </div>
        </div>
      ),
      french: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      ),
      modern: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      ),
      american: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-blue-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      ),
      mexican: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-red-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Palette className="w-8 h-8 text-green-600" />
          </div>
        </div>
      ),
      korean: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      ),
      jewish: (
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      )
    };
    
    return illustrations[culture] || illustrations.modern;
  };

  const getActionIcon = (type: EmptyStateType['type']) => {
    switch (type) {
      case 'no-data':
        return <Plus className="w-4 h-4" />;
      case 'no-results':
        return <Search className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'coming-soon':
        return <Clock className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const getVariantStyles = (type: EmptyStateType['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'coming-soon':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        flex flex-col items-center justify-center 
        p-8 rounded-lg border-2 border-dashed 
        ${getVariantStyles(state.type)}
        ${className}
      `}
    >
      {/* Cultural Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {state.illustrationUrl ? (
          <img
            src={state.illustrationUrl}
            alt="Empty state illustration"
            className="w-24 h-24 object-contain mb-4"
          />
        ) : (
          getCulturalIllustration(culturalContext)
        )}
      </motion.div>

      {/* Main Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6"
      >
        {getIcon(state.type)}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl font-semibold text-gray-900 mb-2 text-center"
      >
        {state.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-gray-600 text-center mb-6 max-w-md"
      >
        {state.description}
      </motion.p>

      {/* Action Button */}
      {state.actionLabel && state.actionCallback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            onClick={state.actionCallback}
            variant={state.type === 'error' ? 'secondary' : 'primary'}
            size="lg"
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            {getActionIcon(state.type)}
            <span className="ml-2">{state.actionLabel}</span>
          </Button>
        </motion.div>
      )}

      {/* Cultural Context Message */}
      {state.type === 'no-data' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 p-4 bg-white rounded-lg border border-gray-200 max-w-md"
        >
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium">Cultural Tip:</span> Each design respects the authentic traditions and aesthetics of your chosen cultural context.
          </p>
        </motion.div>
      )}

      {/* Error Details */}
      {state.type === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 p-4 bg-white rounded-lg border border-red-200 max-w-md"
        >
          <p className="text-sm text-red-600 text-center">
            If this error persists, please check your connection and try again. Our cultural validation system ensures authentic and respectful designs.
          </p>
        </motion.div>
      )}

      {/* Coming Soon Details */}
      {state.type === 'coming-soon' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 p-4 bg-white rounded-lg border border-yellow-200 max-w-md"
        >
          <p className="text-sm text-yellow-700 text-center">
            We're working on expanding our cultural database and design capabilities. Stay tuned for updates!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
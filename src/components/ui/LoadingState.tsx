import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Palette, Eye } from 'lucide-react';
import { LoadingState as LoadingStateType, CultureType } from '@/lib/types';

interface LoadingStateProps {
  state: LoadingStateType;
  culturalContext?: CultureType;
  variant?: 'default' | 'minimal' | 'cultural';
  size?: 'sm' | 'md' | 'lg';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  state,
  culturalContext = 'modern',
  variant = 'default',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getStageIcon = (stage?: string) => {
    switch (stage) {
      case 'analyzing':
        return <Eye className={sizeClasses[size]} />;
      case 'generating':
        return <Sparkles className={sizeClasses[size]} />;
      case 'validating':
        return <Palette className={sizeClasses[size]} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin`} />;
    }
  };

  const getCulturalColors = (culture: CultureType) => {
    const colors = {
      japanese: 'from-red-500 to-pink-500',
      scandinavian: 'from-blue-500 to-cyan-500',
      italian: 'from-green-500 to-yellow-500',
      french: 'from-purple-500 to-blue-500',
      modern: 'from-gray-500 to-blue-500'
    };
    return colors[culture] || colors.modern;
  };

  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {getStageIcon(state.stage)}
        </motion.div>
        {state.message && (
          <span className={`text-gray-600 ${textClasses[size]}`}>
            {state.message}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'cultural') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
        <div className={`relative mb-4`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${getCulturalColors(culturalContext)} rounded-full blur-sm opacity-30`} />
          <motion.div
            className="relative bg-white rounded-full p-3 shadow-lg"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: state.stage === 'generating' ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
          >
            {getStageIcon(state.stage)}
          </motion.div>
        </div>
        
        {state.message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center font-medium text-gray-700 ${textClasses[size]} mb-2`}
          >
            {state.message}
          </motion.p>
        )}
        
        {state.progress !== undefined && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(state.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${getCulturalColors(culturalContext)}`}
                initial={{ width: 0 }}
                animate={{ width: `${state.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <motion.div
        className="mb-4"
        animate={{ 
          rotate: state.stage === 'generating' ? 360 : 0,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity }
        }}
      >
        {getStageIcon(state.stage)}
      </motion.div>
      
      {state.message && (
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-semibold text-gray-900 ${textClasses[size]} mb-2 text-center`}
        >
          {state.message}
        </motion.h3>
      )}
      
      {state.stage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 mb-4 text-center capitalize"
        >
          {state.stage.replace('_', ' ')}...
        </motion.p>
      )}
      
      {state.progress !== undefined && (
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(state.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${state.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
      
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
        >
          <p className="text-sm text-red-600">{state.error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingState;
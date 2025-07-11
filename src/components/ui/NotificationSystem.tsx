import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Sparkles
} from 'lucide-react';
import { NotificationState, CultureType } from '@/lib/types';

interface NotificationSystemProps {
  culturalContext?: CultureType;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  maxNotifications?: number;
}

interface NotificationContextType {
  notifications: NotificationState[];
  addNotification: (notification: Omit<NotificationState, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  culturalContext = 'modern',
  position = 'top-right',
  maxNotifications = 5
}) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationState, 'id' | 'timestamp'>) => {
    const newNotification: NotificationState = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getPositionClasses = (position: string) => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position as keyof typeof positions] || positions['top-right'];
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications
    }}>
      <div className={`fixed ${getPositionClasses(position)} z-50 max-w-sm w-full space-y-2`}>
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
              culturalContext={culturalContext}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

interface NotificationItemProps {
  notification: NotificationState;
  onRemove: (id: string) => void;
  culturalContext: CultureType;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove,
  culturalContext
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, notification.duration! - elapsed);
        setProgress((remaining / notification.duration!) * 100);
        
        if (remaining <= 0) {
          setIsVisible(false);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [notification.duration]);

  const getIcon = (type: NotificationState['type']) => {
    const iconClasses = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClasses} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-500`} />;
      default:
        return <Info className={`${iconClasses} text-blue-500`} />;
    }
  };

  const getBackgroundColor = (type: NotificationState['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getCulturalAccent = (culture: CultureType) => {
    const accents = {
      japanese: 'border-l-red-500',
      scandinavian: 'border-l-blue-500',
      italian: 'border-l-green-500',
      french: 'border-l-purple-500',
      modern: 'border-l-gray-600',
      american: 'border-l-blue-500',
      mexican: 'border-l-green-500',
      korean: 'border-l-blue-500',
      jewish: 'border-l-indigo-500'
    };
    return accents[culture] || accents.modern;
  };

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        ${getBackgroundColor(notification.type)}
        ${getCulturalAccent(notification.culturalContext || culturalContext)}
        border border-l-4 rounded-lg shadow-lg backdrop-blur-sm
        max-w-sm w-full p-4 relative overflow-hidden
      `}
    >
      {/* Progress Bar */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
          <motion.div
            className="h-full bg-current opacity-30"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      {/* Cultural Sparkles */}
      {notification.culturalContext && (
        <div className="absolute top-2 right-8 opacity-20">
          <Sparkles className="w-4 h-4 text-current" />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm leading-5">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1 leading-5">
            {notification.message}
          </p>
          
          {/* Cultural Context */}
          {notification.culturalContext && (
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Cultural Context: {notification.culturalContext.charAt(0).toUpperCase() + notification.culturalContext.slice(1)}
            </p>
          )}
        </div>

        {/* Close Button */}
        {notification.dismissible !== false && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 rounded-full p-1 hover:bg-gray-200 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode } & NotificationSystemProps> = ({
  children,
  ...props
}) => {
  return (
    <>
      {children}
      <NotificationSystem {...props} />
    </>
  );
};

export default NotificationSystem;
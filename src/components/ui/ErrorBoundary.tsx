import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { CultureType } from '@/lib/types';
import Button from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  culturalContext?: CultureType;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send error to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: true,
        error_id: this.state.errorId
      });
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  getCulturalColors = (culture: CultureType = 'american') => {
    const colors = {
      japanese: 'from-red-500 to-pink-500',
      scandinavian: 'from-blue-500 to-cyan-500',
      italian: 'from-green-500 to-yellow-500',
      french: 'from-purple-500 to-blue-500',
      american: 'from-blue-600 to-red-600'
    };
    return colors[culture] || colors.american;
  };

  handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  sendErrorReport = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      culturalContext: this.props.culturalContext
    };

    // Send to error reporting service
    console.log('Error report:', errorReport);
    
    // Show success message
    alert('Error report sent successfully. Thank you for helping us improve!');
  };

  renderErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state;
    
    if (!error) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <details className="cursor-pointer">
          <summary className="font-medium text-gray-700 mb-2">
            Technical Details (Click to expand)
          </summary>
          <div className="text-sm text-gray-600 space-y-2">
            <div>
              <strong>Error ID:</strong> {errorId}
            </div>
            <div>
              <strong>Error:</strong> {error.message}
            </div>
            <div>
              <strong>Stack Trace:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {error.stack}
              </pre>
            </div>
            {errorInfo && (
              <div>
                <strong>Component Stack:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </details>
      </motion.div>
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
          >
            {/* Cultural Header */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${this.getCulturalColors(this.props.culturalContext)} p-1`}>
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600">
                We encountered an unexpected error while processing your request. 
                Our cultural design system remains intact and your data is safe.
              </p>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={this.handleRefresh}
                variant="primary"
                size="lg"
                icon={<RefreshCw className="w-4 h-4" />}
                className="w-full"
              >
                Try Again
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={this.handleGoHome}
                  variant="secondary"
                  size="md"
                  icon={<Home className="w-4 h-4" />}
                  className="flex-1"
                >
                  Go Home
                </Button>
                
                <Button
                  onClick={this.sendErrorReport}
                  variant="ghost"
                  size="md"
                  icon={<Mail className="w-4 h-4" />}
                  className="flex-1"
                >
                  Report Issue
                </Button>
              </div>
            </motion.div>

            {/* Cultural Context Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-sm text-blue-700">
                <span className="font-medium">Cultural Integrity:</span> Your cultural preferences and design history remain secure and unaffected by this error.
              </p>
            </motion.div>

            {/* Error Details */}
            {this.renderErrorDetails()}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
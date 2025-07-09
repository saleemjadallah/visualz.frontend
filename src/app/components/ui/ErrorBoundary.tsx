'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
  culturalTheme?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    // Create error report
    const errorReport = {
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send to error reporting service
    console.log('Error report:', errorReport);
    
    // In a real app, send to your error reporting service
    // Example: Sentry, LogRocket, etc.
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReport={this.handleReportError}
          showErrorDetails={this.props.showErrorDetails}
          culturalTheme={this.props.culturalTheme}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onRetry: () => void;
  onReport: () => void;
  showErrorDetails?: boolean;
  culturalTheme?: boolean;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  onRetry,
  onReport,
  showErrorDetails = false,
  culturalTheme = true,
}) => {
  const containerClass = culturalTheme 
    ? 'bg-cultural-neutral border-cultural-secondary text-cultural-text'
    : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${containerClass}`}>
      <div className={`max-w-md w-full text-center space-y-6 p-8 rounded-lg border ${containerClass}`}>
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-gray-600">
            We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
          </p>
        </div>

        {showErrorDetails && error && (
          <details className="text-left bg-gray-50 p-4 rounded-lg">
            <summary className="cursor-pointer font-semibold text-red-600 mb-2">
              Error Details
            </summary>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="btn-cultural flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-cultural-secondary flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
          
          <button
            onClick={onReport}
            className="btn-cultural-secondary flex items-center justify-center"
          >
            <Bug className="w-4 h-4 mr-2" />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
}) => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(event.reason?.message || 'Unhandled promise rejection');
      setError(error);
      onError?.(error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [onError]);

  if (error) {
    return fallback || (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-red-800">Async Error</h3>
        </div>
        <p className="mt-2 text-red-700">{error.message}</p>
        <button
          onClick={() => setError(null)}
          className="mt-3 btn-cultural-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

interface NetworkErrorBoundaryProps {
  children: ReactNode;
  onNetworkError?: () => void;
}

export const NetworkErrorBoundary: React.FC<NetworkErrorBoundaryProps> = ({
  children,
  onNetworkError,
}) => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      onNetworkError?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onNetworkError]);

  if (isOffline) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-cultural-neutral border border-cultural-secondary rounded-lg">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-cultural-text">You're offline</h2>
            <p className="text-cultural-secondary">
              Please check your internet connection and try again.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="btn-cultural"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface ChunkErrorBoundaryProps {
  children: ReactNode;
}

export const ChunkErrorBoundary: React.FC<ChunkErrorBoundaryProps> = ({ children }) => {
  const [hasChunkError, setHasChunkError] = React.useState(false);

  React.useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.message.includes('Loading chunk')) {
        setHasChunkError(true);
      }
    };

    window.addEventListener('error', handleChunkError);
    return () => window.removeEventListener('error', handleChunkError);
  }, []);

  if (hasChunkError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-cultural-neutral border border-cultural-secondary rounded-lg">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-cultural-text">Update Available</h2>
            <p className="text-cultural-secondary">
              A new version of the application is available. Please refresh to get the latest features.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="btn-cultural"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default ErrorBoundary;
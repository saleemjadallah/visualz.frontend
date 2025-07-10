'use client';

import { useState, useEffect } from 'react';
import { GLTF_MODEL_LIBRARY } from './GLTFModels';

interface ModelStatus {
  url: string;
  status: 'loading' | 'success' | 'error' | 'missing';
  error?: string;
  fileSize?: number;
  lastChecked: Date;
}

interface ModelValidationReport {
  totalModels: number;
  availableModels: number;
  missingModels: number;
  errorModels: number;
  modelStatuses: Record<string, ModelStatus>;
}

export class ModelValidator {
  private static instance: ModelValidator;
  private validationCache: Map<string, ModelStatus> = new Map();
  
  static getInstance(): ModelValidator {
    if (!ModelValidator.instance) {
      ModelValidator.instance = new ModelValidator();
    }
    return ModelValidator.instance;
  }

  async validateModel(category: string, url: string): Promise<ModelStatus> {
    const cached = this.validationCache.get(category);
    const now = new Date();
    
    // Return cached result if less than 5 minutes old
    if (cached && (now.getTime() - cached.lastChecked.getTime()) < 5 * 60 * 1000) {
      return cached;
    }

    const status: ModelStatus = {
      url,
      status: 'loading',
      lastChecked: now
    };

    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        status.status = 'success';
        status.fileSize = contentLength ? parseInt(contentLength) : undefined;
        
        // Validate file size (should be reasonable for web use)
        if (status.fileSize && status.fileSize > 10 * 1024 * 1024) { // 10MB limit
          status.status = 'error';
          status.error = `File too large: ${(status.fileSize / 1024 / 1024).toFixed(1)}MB (max 10MB)`;
        }
      } else if (response.status === 404) {
        status.status = 'missing';
        status.error = 'File not found (404)';
      } else {
        status.status = 'error';
        status.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      status.status = 'error';
      status.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.validationCache.set(category, status);
    return status;
  }

  async validateAllModels(): Promise<ModelValidationReport> {
    const categories = Object.keys(GLTF_MODEL_LIBRARY);
    const validationPromises = categories.map(async (category) => {
      const modelConfig = GLTF_MODEL_LIBRARY[category as keyof typeof GLTF_MODEL_LIBRARY];
      const status = await this.validateModel(category, modelConfig.url);
      return [category, status] as [string, ModelStatus];
    });

    const results = await Promise.all(validationPromises);
    const modelStatuses = Object.fromEntries(results);

    const report: ModelValidationReport = {
      totalModels: categories.length,
      availableModels: results.filter(([, status]) => status.status === 'success').length,
      missingModels: results.filter(([, status]) => status.status === 'missing').length,
      errorModels: results.filter(([, status]) => status.status === 'error').length,
      modelStatuses
    };

    return report;
  }

  clearCache(): void {
    this.validationCache.clear();
  }

  getValidationStatus(category: string): ModelStatus | null {
    return this.validationCache.get(category) || null;
  }
}

// React component for model validation UI
export function ModelValidationPanel() {
  const [report, setReport] = useState<ModelValidationReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const validateModels = async () => {
    setIsValidating(true);
    try {
      const validator = ModelValidator.getInstance();
      const validationReport = await validator.validateAllModels();
      setReport(validationReport);
    } catch (error) {
      console.error('Model validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateModels();
  }, []);

  if (!report) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Validating models...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'missing': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✓';
      case 'missing': return '⚠';
      case 'error': return '✗';
      default: return '○';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Model Status</h3>
        <button
          onClick={validateModels}
          disabled={isValidating}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Refresh'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{report.totalModels}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{report.availableModels}</div>
          <div className="text-xs text-gray-600">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{report.missingModels}</div>
          <div className="text-xs text-gray-600">Missing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{report.errorModels}</div>
          <div className="text-xs text-gray-600">Errors</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(report.availableModels / report.totalModels) * 100}%` }}
        ></div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-800 mb-2"
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {/* Detailed Status */}
      {showDetails && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(report.modelStatuses).map(([category, status]) => (
            <div key={category} className="flex items-center justify-between p-2 rounded border border-gray-200">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getStatusColor(status.status)}`}>
                  {getStatusIcon(status.status)}
                </span>
                <span className="text-sm font-medium">{category}</span>
              </div>
              <div className="text-right">
                {status.fileSize && (
                  <div className="text-xs text-gray-500">
                    {(status.fileSize / 1024).toFixed(0)}KB
                  </div>
                )}
                {status.error && (
                  <div className="text-xs text-red-600 max-w-48 truncate" title={status.error}>
                    {status.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Missing Models Helper */}
      {report.missingModels > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
          <div className="text-sm text-yellow-800">
            <strong>Missing Models:</strong> Place GLB files in the <code>/public/models/</code> directory.
            <br />
            <span className="text-xs">Recommended sources: Sketchfab, Google Poly Archive, Kenney Assets</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for using model validation
export function useModelValidation() {
  const [report, setReport] = useState<ModelValidationReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateModels = async () => {
    setIsValidating(true);
    try {
      const validator = ModelValidator.getInstance();
      const validationReport = await validator.validateAllModels();
      setReport(validationReport);
      return validationReport;
    } catch (error) {
      console.error('Model validation failed:', error);
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  const getModelStatus = (category: string): ModelStatus | null => {
    const validator = ModelValidator.getInstance();
    return validator.getValidationStatus(category);
  };

  return {
    report,
    isValidating,
    validateModels,
    getModelStatus,
    clearCache: () => ModelValidator.getInstance().clearCache()
  };
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  User,
  Star,
  Clock,
  Flag,
  Heart,
  Eye,
  MessageCircle
} from 'lucide-react';
import { CulturalSensitivityReview, CultureType } from '@/lib/types';
import Button from '../ui/Button';

interface CulturalSensitivityReviewProps {
  review: CulturalSensitivityReview;
  onApprove?: (reviewId: string) => void;
  onRevisionRequest?: (reviewId: string, feedback: string) => void;
  onReject?: (reviewId: string, reason: string) => void;
  isInteractive?: boolean;
  culturalContext?: CultureType;
}

const CulturalSensitivityReview: React.FC<CulturalSensitivityReviewProps> = ({
  review,
  onApprove,
  onRevisionRequest,
  onReject,
  isInteractive = true,
  culturalContext = 'american'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approve' | 'revise' | 'reject' | null>(null);

  const getStatusColor = (status: CulturalSensitivityReview['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'needs-revision':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: CulturalSensitivityReview['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <X className="w-5 h-5" />;
      case 'needs-revision':
        return <AlertTriangle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCulturalFlag = (culture: CultureType) => {
    const flags = {
      japanese: '🇯🇵',
      scandinavian: '🇸🇪',
      italian: '🇮🇹',
      french: '🇫🇷',
      american: '🇺🇸'
    };
    return flags[culture] || flags.american;
  };

  const handleAction = (action: 'approve' | 'revise' | 'reject') => {
    setSelectedAction(action);
    
    if (action === 'approve' && onApprove) {
      onApprove(review.id);
    } else if (action === 'revise' || action === 'reject') {
      setShowFeedbackForm(true);
    }
  };

  const handleFeedbackSubmit = () => {
    if (selectedAction === 'revise' && onRevisionRequest) {
      onRevisionRequest(review.id, feedbackText);
    } else if (selectedAction === 'reject' && onReject) {
      onReject(review.id, feedbackText);
    }
    
    setShowFeedbackForm(false);
    setFeedbackText('');
    setSelectedAction(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(review.status)}`}>
              {getStatusIcon(review.status)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cultural Sensitivity Review
              </h3>
              <p className="text-sm text-gray-500">
                {getCulturalFlag(review.culture)} {review.culture.charAt(0).toUpperCase() + review.culture.slice(1)} Culture
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(review.score)}`}>
                {review.score}%
              </div>
              <div className="text-sm text-gray-500">
                Overall Score
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviewer Info */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {review.reviewer.name}
            </div>
            <div className="text-sm text-gray-500">
              {review.reviewer.credentials.join(', ')}
            </div>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {new Date(review.reviewDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Quick Scores */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(review.feedback.culturalAccuracy)}`}>
              {review.feedback.culturalAccuracy}%
            </div>
            <div className="text-sm text-gray-500">Cultural Accuracy</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(review.feedback.respectfulness)}`}>
              {review.feedback.respectfulness}%
            </div>
            <div className="text-sm text-gray-500">Respectfulness</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(review.feedback.authenticity)}`}>
              {review.feedback.authenticity}%
            </div>
            <div className="text-sm text-gray-500">Authenticity</div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            {/* Positive Feedback */}
            {review.feedback.positive.length > 0 && (
              <div className="p-4 bg-green-50 border-b border-gray-200">
                <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Positive Aspects
                </h4>
                <ul className="space-y-1">
                  {review.feedback.positive.map((item, index) => (
                    <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concerns */}
            {review.feedback.concerns.length > 0 && (
              <div className="p-4 bg-red-50 border-b border-gray-200">
                <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Concerns
                </h4>
                <ul className="space-y-1">
                  {review.feedback.concerns.map((item, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {review.feedback.suggestions.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Suggestions
                </h4>
                <ul className="space-y-1">
                  {review.feedback.suggestions.map((item, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                      <Eye className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cultural Elements Review */}
            {review.culturalElements.length > 0 && (
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Cultural Elements Review
                </h4>
                <div className="space-y-2">
                  {review.culturalElements.map((element, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${element.appropriate ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-gray-900">{element.element}</span>
                      </div>
                      <div className="text-sm text-gray-600 max-w-xs">
                        {element.feedback}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {isInteractive && review.status === 'pending' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAction('approve')}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAction('revise')}
              icon={<AlertTriangle className="w-4 h-4" />}
            >
              Request Revision
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('reject')}
              icon={<X className="w-4 h-4" />}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <AnimatePresence>
        {showFeedbackForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 p-4 bg-white"
          >
            <h4 className="font-medium text-gray-900 mb-3">
              {selectedAction === 'revise' ? 'Revision Request' : 'Rejection Reason'}
            </h4>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={`Please provide ${selectedAction === 'revise' ? 'specific suggestions for improvement' : 'detailed reasons for rejection'}...`}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex gap-3 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText.trim()}
              >
                Submit {selectedAction === 'revise' ? 'Revision' : 'Rejection'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedbackText('');
                  setSelectedAction(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CulturalSensitivityReview;
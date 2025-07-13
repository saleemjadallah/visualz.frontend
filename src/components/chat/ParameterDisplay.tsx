import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

interface ExtractedParameters {
  eventType?: string;
  guestCount?: number;
  budget?: string;
  culture?: string;
  style?: string;
  spaceType?: string;
  timeOfDay?: string;
  missing?: string[];
}

interface ParameterDisplayProps {
  parameters: ExtractedParameters;
}

export const ParameterDisplay = ({ parameters }: ParameterDisplayProps) => {
  const parameterLabels: Record<string, string> = {
    eventType: 'Event Type',
    guestCount: 'Guest Count',
    budget: 'Budget Range',
    culture: 'Cultural Theme',
    style: 'Style Preference',
    spaceType: 'Space Type',
    timeOfDay: 'Time of Day'
  };

  const parameterIcons: Record<string, string> = {
    eventType: '🎉',
    guestCount: '👥',
    budget: '💰',
    culture: '🌍',
    style: '🎨',
    spaceType: '🏛️',
    timeOfDay: '⏰'
  };

  const formatValue = (key: string, value: any): string => {
    if (key === 'guestCount') return `${value} guests`;
    if (key === 'budget') return value.replace('-', ' - $').replace('k', ',000').replace('under', 'Under').replace('over', 'Over');
    if (key === 'eventType') return value.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    if (key === 'culture') return value.charAt(0).toUpperCase() + value.slice(1);
    if (key === 'timeOfDay') return value.charAt(0).toUpperCase() + value.slice(1);
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const filledParams = Object.entries(parameters)
    .filter(([key, value]) => value && key !== 'missing')
    .map(([key, value]) => ({ key, value, label: parameterLabels[key] || key }));

  const missingParams = parameters.missing || [];

  if (filledParams.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-purple-900 flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span>Event Details Captured</span>
        </h4>
        {missingParams.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-amber-700">
            <AlertCircle className="h-3 w-3" />
            <span>{missingParams.length} details needed</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {filledParams.map(({ key, value, label }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-2 shadow-sm border border-purple-100"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{parameterIcons[key]}</span>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatValue(key, value)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {missingParams.length > 0 && (
        <div className="mt-3 pt-3 border-t border-purple-200">
          <p className="text-xs text-purple-700">
            Still need: {missingParams.map(param => parameterLabels[param] || param).join(', ')}
          </p>
        </div>
      )}
    </motion.div>
  );
};
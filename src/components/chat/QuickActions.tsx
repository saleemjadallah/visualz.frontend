import { motion } from 'framer-motion';
import { Calendar, Heart, Building2, Users, Camera, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const quickActions = [
    { 
      text: "I want to plan a wedding",
      icon: <Heart className="h-4 w-4" />,
      color: "from-pink-500 to-rose-500"
    },
    { 
      text: "Help me with a birthday party",
      icon: <Calendar className="h-4 w-4" />,
      color: "from-purple-500 to-indigo-500"
    },
    { 
      text: "Corporate event design",
      icon: <Building2 className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      text: "Cultural celebration",
      icon: <Users className="h-4 w-4" />,
      color: "from-orange-500 to-red-500"
    },
    { 
      text: "I have photos of my space",
      icon: <Camera className="h-4 w-4" />,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="border-t bg-gradient-to-b from-gray-50 to-white p-3">
      <div className="flex items-center space-x-2 mb-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <p className="text-xs font-medium text-gray-600">Quick starts</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.text)}
            className="group relative px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-transparent transition-all overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative flex items-center space-x-2">
              <span className={`bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
                {action.icon}
              </span>
              <span className="text-gray-700 group-hover:text-gray-900">
                {action.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
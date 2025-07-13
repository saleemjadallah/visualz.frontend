import { Bot, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: {
    type: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    parameters?: any;
  };
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-3 max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-md ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : isSystem 
                ? 'bg-gradient-to-br from-gray-400 to-gray-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </motion.div>

        {/* Message */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
            : isSystem 
              ? 'bg-yellow-50 text-yellow-900 border border-yellow-200'
              : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Parameter display for assistant messages */}
          {message.parameters && !isUser && Object.keys(message.parameters).length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-xs"
            >
              <div className="bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur-sm">
                <span className="font-medium">Understood:</span> {Object.keys(message.parameters).filter(k => k !== 'missing').length} details
              </div>
            </motion.div>
          )}
          
          <p className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};
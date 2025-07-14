'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import { ParameterDisplay } from './ParameterDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatMessage, 
  ExtractedParameters, 
  ClarificationOption,
  extractParametersFromMessage,
  generateDesign3D,
  getRecentMessages
} from '@/lib/chat-api';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI event designer. Describe your dream event and I'll create a beautiful, culturally-aware design for you. Just tell me what you're envisioning! ✨",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedParams, setExtractedParams] = useState<ExtractedParameters>({});
  const [pendingClarification, setPendingClarification] = useState<ClarificationOption | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string, extractedParamsOverride?: ExtractedParameters) => {
    if (!message.trim() || isProcessing) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Call our AI parameter extraction service
      const result = await extractParametersFromMessage({
        message,
        existingParams: extractedParamsOverride || extractedParams,
        conversationHistory: getRecentMessages(messages, 5)
      });

      if (result.needsClarification) {
        // AI needs clarification
        const clarificationMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.clarificationQuestion || 'I need a bit more information...',
          timestamp: new Date(),
          clarificationOptions: result.clarificationOptions ? [result.clarificationOptions] : undefined
        };

        setMessages(prev => [...prev, clarificationMessage]);
        setPendingClarification(result.clarificationOptions || null);
        setExtractedParams(prev => ({ ...prev, ...result.extractedParams }));
      } else if (result.readyToGenerate) {
        // All parameters collected, generate design
        const confirmMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Perfect! I have everything I need to design your ${result.extractedParams.eventType}. Creating your 3D design now...`,
          timestamp: new Date(),
          parameters: result.extractedParams
        };

        setMessages(prev => [...prev, confirmMessage]);
        setExtractedParams(result.extractedParams);
        
        // Notify main page that generation is starting
        window.dispatchEvent(new Event('generatingDesign'));
        
        // Trigger 3D generation
        await generateDesign(result.extractedParams);
      } else {
        // Continue conversation, more info needed
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.response,
          timestamp: new Date(),
          parameters: result.extractedParams
        };

        setMessages(prev => [...prev, responseMessage]);
        setExtractedParams(prev => ({ ...prev, ...result.extractedParams }));
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    await handleSendMessage(action);
  };

  const handleClarificationResponse = async (response: string, originalMessage: ChatMessage) => {
    // When responding to a clarification, merge the latest params from that message
    // with the user's new response to avoid state race conditions.
    const latestParams = originalMessage.parameters || extractedParams;
    
    setPendingClarification(null);
    
    // Create a new synthetic message that includes the structured response
    // and send that to the backend for the most reliable extraction.
    const messageToSend = `${response}`; 
    
    // We must update the local state immediately with the full context before sending.
    const newExtractedParams = { ...latestParams };

    await handleSendMessage(messageToSend, newExtractedParams);
  };

  const generateDesign = async (parameters: ExtractedParameters) => {
    try {
      // Use existing AI service
      // Map chat parameters to backend format
      const mappedEventType = parameters.eventType?.replace('-', '_') || 'celebration';
      const mappedBudgetRange = parameters.budget?.replace('-', '_').replace('k', '000') || 'medium';
      
      const designResult = await generateDesign3D({
        eventRequirements: {
          event_type: mappedEventType,
          guest_count: parameters.guestCount || 50,
          budget_range: mappedBudgetRange,
          cultural_background: parameters.culture ? [parameters.culture] : [],
          style_preferences: parameters.style ? [parameters.style] : [],
          space_type: parameters.spaceType || 'indoor',
          time_of_day: parameters.timeOfDay || 'evening'
        },
        spaceData: {
          dimensions: { width: 30, depth: 20, height: 10 }, // Default if not specified
          type: parameters.spaceType || 'ballroom'
        }
      });
      
      if (designResult && designResult.scene_data) {
        const successMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `🎉 Your design is ready! I've created a beautiful ${parameters.culture || ''} ${parameters.eventType || 'event'} design that perfectly balances your style preferences with cultural authenticity. Take a look at your 3D space!`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, successMessage]);
        
        // Trigger 3D scene display with the full design result
        window.dispatchEvent(new CustomEvent('showDesign', { 
          detail: designResult 
        }));
      }
    } catch (error) {
      console.error('Design generation error:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Parameter Display */}
        {Object.keys(extractedParams).length > 0 && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ParameterDisplay parameters={extractedParams} />
          </motion.div>
        )}
        
        {/* Clarification Options */}
        {pendingClarification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm"
          >
            <h4 className="font-medium text-blue-900 mb-3">
              {pendingClarification.question}
            </h4>
            <div className="flex flex-wrap gap-2">
              {pendingClarification.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleClarificationResponse(option, messages[messages.length - 1])}
                  className="px-4 py-2 bg-white hover:bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-800 transition-all hover:shadow-md"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-500 p-4"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Describe your event vision..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isProcessing}
            />
            <Sparkles className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isProcessing || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
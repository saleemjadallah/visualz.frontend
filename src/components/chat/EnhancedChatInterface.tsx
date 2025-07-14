'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Zap, Flower, Lightbulb, Package } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import { ParameterDisplay } from './ParameterDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatMessage, 
  ExtractedParameters, 
  ClarificationOption,
  extractParametersFromMessage,
  getRecentMessages
} from '@/lib/chat-api';
import { 
  generateOptimizedParametricDesign,
  generateParametricFurniture,
  generateParametricLighting,
  generateParametricFloral,
  convertChatToParametricRequests
} from '@/lib/parametric-chat-api';

interface GenerationProgress {
  stage: 'idle' | 'extracting' | 'furniture' | 'lighting' | 'floral' | 'rendering' | 'complete';
  percentage: number;
  message: string;
}

export const EnhancedChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI event designer with advanced parametric generation capabilities. Describe your dream event and I'll create a culturally-aware, fully parametric 3D design with furniture, lighting, florals, and more! ✨",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedParams, setExtractedParams] = useState<ExtractedParameters>({});
  const [pendingClarification, setPendingClarification] = useState<ClarificationOption | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    stage: 'idle',
    percentage: 0,
    message: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
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
    setGenerationProgress({ stage: 'extracting', percentage: 10, message: 'Understanding your requirements...' });

    try {
      // Call our AI parameter extraction service
      const result = await extractParametersFromMessage({
        message,
        existingParams: extractedParams,
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
        setGenerationProgress({ stage: 'idle', percentage: 0, message: '' });
        setExtractedParams(prev => ({ ...prev, ...result.extractedParams }));
      } else if (result.readyToGenerate) {
        // All parameters collected, generate parametric design
        const confirmMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Perfect! I have everything I need to design your ${result.extractedParams.eventType}. Let me create a comprehensive parametric design with furniture, lighting, florals, and more...`,
          timestamp: new Date(),
          parameters: result.extractedParams
        };

        setMessages(prev => [...prev, confirmMessage]);
        setExtractedParams(result.extractedParams);
        
        // Trigger full parametric generation
        await generateParametricDesign(result.extractedParams);
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
        setGenerationProgress({ stage: 'idle', percentage: 0, message: '' });
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
      setGenerationProgress({ stage: 'idle', percentage: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    await handleSendMessage(action);
  };

  const handleClarificationResponse = async (response: string) => {
    setPendingClarification(null);
    await handleSendMessage(response);
  };

  const generateParametricDesign = async (parameters: ExtractedParameters) => {
    try {
      // Convert chat parameters to parametric requests
      const { furnitureRequest, lightingRequest, floralRequest } = convertChatToParametricRequests(parameters);
      
      // Stage 1: Generate Furniture
      setGenerationProgress({ stage: 'furniture', percentage: 25, message: 'Generating culturally-authentic furniture...' });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate progress
      
      // Stage 2: Generate Lighting
      setGenerationProgress({ stage: 'lighting', percentage: 50, message: 'Designing ambient lighting system...' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 3: Generate Florals
      setGenerationProgress({ stage: 'floral', percentage: 75, message: 'Creating floral arrangements...' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 4: Render Complete Scene
      setGenerationProgress({ stage: 'rendering', percentage: 90, message: 'Rendering your 3D space...' });
      
      // Use the optimized parametric generation
      const designResult = await generateOptimizedParametricDesign(parameters);
      
      setGenerationProgress({ stage: 'complete', percentage: 100, message: 'Design complete!' });
      
      if (designResult && (designResult.scene_data || designResult.rendered_scene)) {
        const successMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `🎉 Your parametric design is ready! I've created:
          
✅ **Furniture System**: ${designResult.parametric_systems?.furniture?.item_count || 0} pieces optimized for your ${parameters.culture || ''} ${parameters.eventType || 'event'}
✅ **Lighting Design**: ${designResult.parametric_systems?.lighting?.fixture_count || 0} fixtures with ${parameters.timeOfDay || 'evening'} ambiance
✅ **Floral Arrangements**: ${designResult.parametric_systems?.floral?.arrangement_count || 0} culturally-appropriate designs
✅ **Complete 3D Scene**: Ready for interactive exploration

Your design achieves a cultural authenticity score of ${designResult.generation_metadata?.cultural_authenticity_score || 9}/10!`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, successMessage]);
        
        // Trigger 3D scene display with the full parametric design
        window.dispatchEvent(new CustomEvent('showParametricDesign', { 
          detail: {
            ...designResult,
            parametric_generation: true,
            systems_included: ['furniture', 'lighting', 'floral', 'climate', 'av']
          }
        }));
      }
    } catch (error) {
      console.error('Parametric generation error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'I encountered an error during parametric generation. Falling back to standard generation...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setGenerationProgress({ stage: 'idle', percentage: 0, message: '' });
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
        
        {/* Generation Progress */}
        {generationProgress.stage !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {generationProgress.stage === 'furniture' && <Package className="h-5 w-5 text-purple-600 animate-pulse" />}
                {generationProgress.stage === 'lighting' && <Lightbulb className="h-5 w-5 text-yellow-600 animate-pulse" />}
                {generationProgress.stage === 'floral' && <Flower className="h-5 w-5 text-pink-600 animate-pulse" />}
                {generationProgress.stage === 'rendering' && <Zap className="h-5 w-5 text-blue-600 animate-pulse" />}
                <span className="text-sm font-medium text-gray-700">{generationProgress.message}</span>
              </div>
              <span className="text-sm text-gray-500">{generationProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress.percentage}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              />
            </div>
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
                  onClick={() => handleClarificationResponse(option)}
                  className="px-4 py-2 bg-white hover:bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-800 transition-all hover:shadow-md"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {isProcessing && generationProgress.stage === 'extracting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-500 p-4"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI is analyzing your requirements...</span>
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isProcessing}
            />
            <Sparkles className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isProcessing || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Zap className="h-3 w-3" />
          <span>Powered by AI + Parametric Generation</span>
        </div>
      </div>
    </div>
  );
};
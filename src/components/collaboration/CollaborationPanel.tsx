'use client';

import React, { useState } from 'react';
import { useCollaboration } from '@/lib/hooks/useCollaboration';
import { UserIcon, MessageCircle, Lock, Unlock, Wifi, WifiOff } from 'lucide-react';

interface CollaborationPanelProps {
  projectId: string;
  onFurnitureMove?: (furnitureId: string, position: { x: number; y: number }) => void;
  onFurnitureAdd?: (furnitureData: any) => void;
  onFurnitureRemove?: (furnitureId: string) => void;
  onDesignUpdate?: (changes: any) => void;
}

export function CollaborationPanel({
  projectId,
  onFurnitureMove,
  onFurnitureAdd,
  onFurnitureRemove,
  onDesignUpdate
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'locks'>('users');
  const [chatMessage, setChatMessage] = useState('');
  
  const collaboration = useCollaboration(projectId);

  // Set up event callbacks
  React.useEffect(() => {
    collaboration.setEventCallbacks({
      onFurnitureMove,
      onFurnitureAdd,
      onFurnitureRemove,
      onDesignUpdate,
      onUserJoined: (user) => {
        console.log(`${user.username} joined the collaboration`);
      },
      onUserLeft: (userId) => {
        console.log(`User ${userId} left the collaboration`);
      },
      onElementLock: (elementId, userId) => {
        console.log(`Element ${elementId} locked by ${userId}`);
      },
      onElementUnlock: (elementId) => {
        console.log(`Element ${elementId} unlocked`);
      }
    });
  }, [collaboration, onFurnitureMove, onFurnitureAdd, onFurnitureRemove, onDesignUpdate]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      collaboration.sendChatMessage(chatMessage.trim());
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Collaboration</h3>
          <div className="flex items-center space-x-2">
            {collaboration.connected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-500">
              {collaboration.userCount} user{collaboration.userCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Connection Status */}
        {!collaboration.connected && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {collaboration.lastError || 'Disconnected'}
            {collaboration.reconnectAttempts > 0 && (
              <span className="ml-2">
                (Reconnecting... {collaboration.reconnectAttempts}/5)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'chat'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('locks')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'locks'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Locks
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'users' && (
          <div className="p-4 space-y-3">
            {collaboration.users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="relative">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      user.is_active ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm text-gray-500">
                    {user.selected_elements.length > 0 && (
                      <span>{user.selected_elements.length} selected</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {collaboration.users.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <UserIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No users in this session</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {collaboration.chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                    {message.text}
                  </div>
                </div>
              ))}
              
              {collaboration.chatMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-xs">Start a conversation!</p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!collaboration.connected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!collaboration.connected || !chatMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'locks' && (
          <div className="p-4 space-y-3">
            {Object.entries(collaboration.lockedElements).map(([elementId, userId]) => {
              const user = collaboration.users.find(u => u.user_id === userId);
              return (
                <div
                  key={elementId}
                  className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-yellow-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {elementId}
                      </div>
                      <div className="text-xs text-gray-500">
                        Locked by {user?.username || userId}
                      </div>
                    </div>
                  </div>
                  
                  {userId === collaboration.getCurrentUser()?.user_id && (
                    <button
                      onClick={() => collaboration.unlockElement(elementId)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              );
            })}
            
            {Object.keys(collaboration.lockedElements).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Unlock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No locked elements</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
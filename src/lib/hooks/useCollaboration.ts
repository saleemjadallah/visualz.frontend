import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store';

interface CollaborationUser {
  user_id: string;
  username: string;
  joined_at: string;
  is_active: boolean;
  cursor_position?: { x: number; y: number };
  selected_elements: string[];
}

interface CollaborationMessage {
  type: string;
  [key: string]: any;
}

interface CollaborationState {
  connected: boolean;
  users: CollaborationUser[];
  lockedElements: Record<string, string>; // element_id -> user_id
  chatMessages: Array<{
    id: string;
    text: string;
    user_id: string;
    username: string;
    timestamp: string;
  }>;
  sessionId: string | null;
  reconnectAttempts: number;
  lastError: string | null;
}

export function useCollaboration(projectId: string) {
  const { user, token } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<CollaborationState>({
    connected: false,
    users: [],
    lockedElements: {},
    chatMessages: [],
    sessionId: null,
    reconnectAttempts: 0,
    lastError: null
  });

  const [callbacks, setCallbacks] = useState<{
    onUserJoined?: (user: CollaborationUser) => void;
    onUserLeft?: (userId: string) => void;
    onFurnitureMove?: (furnitureId: string, position: { x: number; y: number }) => void;
    onFurnitureAdd?: (furnitureData: any) => void;
    onFurnitureRemove?: (furnitureId: string) => void;
    onCursorUpdate?: (userId: string, position: { x: number; y: number }) => void;
    onSelectionChange?: (userId: string, elements: string[]) => void;
    onElementLock?: (elementId: string, userId: string) => void;
    onElementUnlock?: (elementId: string) => void;
    onDesignUpdate?: (changes: any) => void;
  }>({});

  const connect = useCallback(() => {
    if (!user || !token || !projectId) return;

    // Use environment variable with proper fallback
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://visualz.xyz';
    const wsProtocol = backendUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = backendUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}://${wsHost}/api/ws/collaborate/${projectId}?token=${token}`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ 
          ...prev, 
          connected: true, 
          reconnectAttempts: 0,
          lastError: null 
        }));

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: CollaborationMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setState(prev => ({ 
          ...prev, 
          connected: false,
          lastError: event.reason || 'Connection closed'
        }));
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }

        // Attempt to reconnect unless it was a clean close
        if (event.code !== 1000 && state.reconnectAttempts < 5) {
          const delay = Math.pow(2, state.reconnectAttempts) * 1000; // Exponential backoff
          reconnectTimeoutRef.current = setTimeout(() => {
            setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }));
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          lastError: 'Connection error' 
        }));
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setState(prev => ({ 
        ...prev, 
        lastError: 'Failed to create connection' 
      }));
    }
  }, [user, token, projectId, state.reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      connected: false,
      users: [],
      sessionId: null 
    }));
  }, []);

  const handleMessage = useCallback((message: CollaborationMessage) => {
    switch (message.type) {
      case 'connection_established':
        setState(prev => ({
          ...prev,
          sessionId: message.session_id,
          users: message.room_users || [],
          lockedElements: message.locked_elements || {}
        }));
        break;

      case 'user_joined':
        setState(prev => ({
          ...prev,
          users: [...prev.users, {
            user_id: message.user_id,
            username: message.username,
            joined_at: message.timestamp,
            is_active: true,
            selected_elements: []
          }]
        }));
        callbacks.onUserJoined?.({
          user_id: message.user_id,
          username: message.username,
          joined_at: message.timestamp,
          is_active: true,
          selected_elements: []
        });
        break;

      case 'user_left':
        setState(prev => ({
          ...prev,
          users: prev.users.filter(u => u.user_id !== message.user_id),
          lockedElements: Object.fromEntries(
            Object.entries(prev.lockedElements).filter(([_, userId]) => userId !== message.user_id)
          )
        }));
        callbacks.onUserLeft?.(message.user_id);
        break;

      case 'furniture_moved':
        callbacks.onFurnitureMove?.(message.furniture_id, message.position);
        break;

      case 'furniture_added':
        callbacks.onFurnitureAdd?.(message.furniture_data);
        break;

      case 'furniture_removed':
        callbacks.onFurnitureRemove?.(message.furniture_id);
        break;

      case 'cursor_updated':
        setState(prev => ({
          ...prev,
          users: prev.users.map(user =>
            user.user_id === message.user_id
              ? { ...user, cursor_position: message.cursor_position }
              : user
          )
        }));
        callbacks.onCursorUpdate?.(message.user_id, message.cursor_position);
        break;

      case 'selection_changed':
        setState(prev => ({
          ...prev,
          users: prev.users.map(user =>
            user.user_id === message.user_id
              ? { ...user, selected_elements: message.selected_elements }
              : user
          )
        }));
        callbacks.onSelectionChange?.(message.user_id, message.selected_elements);
        break;

      case 'element_locked':
        setState(prev => ({
          ...prev,
          lockedElements: {
            ...prev.lockedElements,
            [message.element_id]: message.locked_by
          }
        }));
        callbacks.onElementLock?.(message.element_id, message.locked_by);
        break;

      case 'element_unlocked':
        setState(prev => ({
          ...prev,
          lockedElements: Object.fromEntries(
            Object.entries(prev.lockedElements).filter(([id]) => id !== message.element_id)
          )
        }));
        callbacks.onElementUnlock?.(message.element_id);
        break;

      case 'chat_message':
        setState(prev => ({
          ...prev,
          chatMessages: [...prev.chatMessages, message.message]
        }));
        break;

      case 'design_updated':
        callbacks.onDesignUpdate?.(message.design_changes);
        break;

      case 'error':
        console.error('Collaboration error:', message.message);
        setState(prev => ({ ...prev, lastError: message.message }));
        break;
    }
  }, [callbacks]);

  // Connection management
  useEffect(() => {
    if (user && token && projectId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, token, projectId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // API methods
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const moveFurniture = useCallback((furnitureId: string, position: { x: number; y: number }) => {
    sendMessage({
      type: 'furniture_move',
      furniture_id: furnitureId,
      position
    });
  }, [sendMessage]);

  const addFurniture = useCallback((furnitureData: any) => {
    sendMessage({
      type: 'furniture_add',
      furniture_data: furnitureData
    });
  }, [sendMessage]);

  const removeFurniture = useCallback((furnitureId: string) => {
    sendMessage({
      type: 'furniture_remove',
      furniture_id: furnitureId
    });
  }, [sendMessage]);

  const updateCursor = useCallback((position: { x: number; y: number }) => {
    sendMessage({
      type: 'cursor_update',
      cursor_position: position
    });
  }, [sendMessage]);

  const updateSelection = useCallback((elementIds: string[]) => {
    sendMessage({
      type: 'selection_change',
      selected_elements: elementIds
    });
  }, [sendMessage]);

  const lockElement = useCallback((elementId: string) => {
    sendMessage({
      type: 'element_lock',
      element_id: elementId
    });
  }, [sendMessage]);

  const unlockElement = useCallback((elementId: string) => {
    sendMessage({
      type: 'element_unlock',
      element_id: elementId
    });
  }, [sendMessage]);

  const sendChatMessage = useCallback((text: string) => {
    sendMessage({
      type: 'chat_message',
      text
    });
  }, [sendMessage]);

  const updateDesign = useCallback((changes: any) => {
    sendMessage({
      type: 'design_update',
      design_changes: changes
    });
  }, [sendMessage]);

  const setEventCallbacks = useCallback((newCallbacks: typeof callbacks) => {
    setCallbacks(newCallbacks);
  }, []);

  return {
    // State
    connected: state.connected,
    users: state.users,
    lockedElements: state.lockedElements,
    chatMessages: state.chatMessages,
    sessionId: state.sessionId,
    reconnectAttempts: state.reconnectAttempts,
    lastError: state.lastError,

    // Actions
    connect,
    disconnect,
    moveFurniture,
    addFurniture,
    removeFurniture,
    updateCursor,
    updateSelection,
    lockElement,
    unlockElement,
    sendChatMessage,
    updateDesign,
    setEventCallbacks,

    // Computed
    isConnected: state.connected,
    userCount: state.users.length,
    isElementLocked: (elementId: string) => elementId in state.lockedElements,
    getElementLockOwner: (elementId: string) => state.lockedElements[elementId],
    getCurrentUser: () => state.users.find(u => u.user_id === user?.id),
    getOtherUsers: () => state.users.filter(u => u.user_id !== user?.id)
  };
}
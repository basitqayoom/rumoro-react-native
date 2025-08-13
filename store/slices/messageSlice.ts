import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversation: string | null;
  typingIndicators: TypingIndicator[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  typingIndicators: [],
  isLoading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    updateConversation: (state, action: PayloadAction<{ id: string; updates: Partial<Conversation> }>) => {
      const { id, updates } = action.payload;
      state.conversations = state.conversations.map(conv =>
        conv.id === id ? { ...conv, ...updates } : conv
      );
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);
      
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload;
        conversation.updatedAt = action.payload.createdAt;
      }
    },
    markAsRead: (state, action: PayloadAction<{ conversationId: string; messageIds: string[] }>) => {
      const { conversationId, messageIds } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map(msg =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        );
      }
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
    },
    setTyping: (state, action: PayloadAction<TypingIndicator>) => {
      const { conversationId, userId, isTyping } = action.payload;
      state.typingIndicators = state.typingIndicators.filter(
        t => !(t.conversationId === conversationId && t.userId === userId)
      );
      if (isTyping) {
        state.typingIndicators.push(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setMessages,
  addMessage,
  markAsRead,
  setActiveConversation,
  setTyping,
  setLoading,
  setError,
} = messageSlice.actions;

export default messageSlice.reducer;
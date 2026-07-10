/**
 * useChat.js
 *
 * Core chatbot state management hook.
 * Manages conversation history, screens, booking data, and localStorage persistence.
 * All side effects are isolated here — UI components remain pure.
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'trakjobs_chatbot_session';
const MAX_MESSAGES = 100;

// ─── Message Factory ──────────────────────────────────────────────────────────

let msgCounter = Date.now();

export function createMessage({ type, text, options, meta }) {
  return {
    id: `msg-${++msgCounter}`,
    type,           // 'bot' | 'user' | 'system'
    text,
    options,        // QuickAction buttons: [{ label, value, icon? }]
    meta,           // arbitrary extra data (e.g., cards, booking summary)
    timestamp: new Date().toISOString(),
  };
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_BOOKING = {
  categoryId: null,
  categorySlug: null,
  categoryName: null,
  subCategoryId: null,
  subCategorySlug: null,
  subCategoryName: null,
  location: '',
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

const INITIAL_STATE = {
  screen: 'welcome',        // welcome | booking | browse | faq | support
  messages: [],
  bookingStep: null,        // which step of booking flow we're on
  bookingData: { ...INITIAL_BOOKING },
  isTyping: false,
  isLoading: false,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload].slice(-MAX_MESSAGES),
      };

    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'SET_BOOKING_STEP':
      return { ...state, bookingStep: action.payload };

    case 'UPDATE_BOOKING_DATA':
      return {
        ...state,
        bookingData: { ...state.bookingData, ...action.payload },
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'RESET':
      return {
        ...INITIAL_STATE,
        messages: [
          createMessage({
            type: 'bot',
            text: 'Chat restarted. How can I help you today? 👋',
            options: WELCOME_OPTIONS,
          }),
        ],
      };

    case 'HYDRATE':
      return { ...INITIAL_STATE, ...action.payload };

    default:
      return state;
  }
}

// ─── Welcome Options ──────────────────────────────────────────────────────────

export const WELCOME_OPTIONS = [
  { label: '📅 Book a Service', value: 'BOOK_SERVICE' },
  { label: '🔍 Browse Services', value: 'BROWSE_SERVICES' },
  { label: '💬 Get a Quote', value: 'GET_QUOTE' },
  { label: '❓ FAQs', value: 'FAQS' },
  { label: '📞 Contact Support', value: 'CONTACT_SUPPORT' },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChat() {
  const [state, dispatch] = useReducer(reducer, null, () => {
    // Hydrate from localStorage on first render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore messages, not in-progress booking or screen
        if (parsed.messages && Array.isArray(parsed.messages)) {
          return {
            ...INITIAL_STATE,
            messages: parsed.messages.slice(-MAX_MESSAGES),
          };
        }
      }
    } catch (_) {
      // Silently fall back to initial state on parse errors
    }
    return INITIAL_STATE;
  });

  const typingTimerRef = useRef(null);

  // ─── Persist messages to localStorage ─────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages: state.messages }),
      );
    } catch (_) {
      // Quota exceeded or private browsing — fail silently
    }
  }, [state.messages]);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const addMessage = useCallback((msgProps) => {
    dispatch({ type: 'ADD_MESSAGE', payload: createMessage(msgProps) });
  }, []);

  /**
   * Simulates the bot "typing" before responding.
   * Clears any existing typing timer to avoid race conditions.
   */
  const botReply = useCallback(
    (msgProps, delayMs = 650) => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      dispatch({ type: 'SET_TYPING', payload: true });
      typingTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_TYPING', payload: false });
        dispatch({ type: 'ADD_MESSAGE', payload: createMessage({ type: 'bot', ...msgProps }) });
      }, delayMs);
    },
    [],
  );

  const userSay = useCallback((text) => {
    dispatch({ type: 'ADD_MESSAGE', payload: createMessage({ type: 'user', text }) });
  }, []);

  const setScreen = useCallback((screen) => {
    dispatch({ type: 'SET_SCREEN', payload: screen });
  }, []);

  const setBookingStep = useCallback((step) => {
    dispatch({ type: 'SET_BOOKING_STEP', payload: step });
  }, []);

  const updateBookingData = useCallback((data) => {
    dispatch({ type: 'UPDATE_BOOKING_DATA', payload: data });
  }, []);

  const setLoading = useCallback((val) => {
    dispatch({ type: 'SET_LOADING', payload: val });
  }, []);

  const setError = useCallback((msg) => {
    dispatch({ type: 'SET_ERROR', payload: msg });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    addMessage,
    botReply,
    userSay,
    setScreen,
    setBookingStep,
    updateBookingData,
    setLoading,
    setError,
    reset,
  };
}

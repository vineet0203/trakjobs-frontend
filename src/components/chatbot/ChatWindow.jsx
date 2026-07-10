/**
 * ChatWindow.jsx
 *
 * The main chat window containing:
 *  - Premium header with back/reset actions
 *  - Scrollable message list
 *  - Typing indicator
 *  - Text input bar
 *
 * All conversation logic lives in the conversation engine below.
 * This component is purely responsible for rendering.
 */

import React, { memo, useCallback, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useConversationEngine } from './hooks/useConversationEngine';
import { useChat } from './hooks/useChat';

// ─── Icons ────────────────────────────────────────────────────────────────────

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <path d="M9 17s1 1 3 1 3-1 3-1" />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Typing Indicator ─────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <div className="cb-typing-row">
    <div className="cb-msg-avatar" style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>
      TJ
    </div>
    <div className="cb-typing-bubble">
      <div className="cb-typing-dot" />
      <div className="cb-typing-dot" />
      <div className="cb-typing-dot" />
    </div>
  </div>
);

// ─── Header ───────────────────────────────────────────────────────────────────

const ChatHeader = memo(function ChatHeader({ screen, onBack, onReset, onClose }) {
  const showBack = screen !== 'welcome';
  return (
    <div className="trakjobs-chat-header">
      <div className="trakjobs-chat-header-left">
        {showBack ? (
          <button className="cb-back-btn" onClick={onBack} type="button" aria-label="Go back">
            <BackIcon /> Back
          </button>
        ) : (
          <>
            <div className="trakjobs-chat-header-avatar">
              <BotIcon />
            </div>
            <div className="trakjobs-chat-header-info">
              <span className="trakjobs-chat-header-name">TrakJobs Assistant</span>
              <span className="trakjobs-chat-header-status">
                <span className="trakjobs-chat-header-status-dot" />
                Online
              </span>
            </div>
          </>
        )}
      </div>

      <div className="trakjobs-chat-header-actions">
        <button
          className="trakjobs-chat-icon-btn"
          onClick={onReset}
          type="button"
          aria-label="Restart chat"
          title="Restart chat"
        >
          <ResetIcon />
        </button>
        <button
          className="trakjobs-chat-icon-btn"
          onClick={onClose}
          type="button"
          aria-label="Close chat"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
});

// ─── Main ChatWindow ──────────────────────────────────────────────────────────

const ChatWindow = memo(function ChatWindow({ onClose }) {
  const chatHook = useChat();
  const { state, reset } = chatHook;
  const { handleQuickAction, handleUserText, handleBack } = useConversationEngine(chatHook);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(timer);
  }, [state.messages, state.isTyping]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleReset = useCallback(() => {
    if (window.confirm('Restart the conversation?')) {
      reset();
    }
  }, [reset]);

  return (
    <>
      <ChatHeader
        screen={state.screen}
        onBack={handleBack}
        onReset={handleReset}
        onClose={handleClose}
      />

      {/* Messages */}
      <div className="trakjobs-chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {state.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onQuickAction={handleQuickAction}
          />
        ))}

        {state.isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleUserText}
        disabled={state.isLoading || state.isTyping}
        placeholder={state.screen === 'booking' ? 'Type your answer…' : 'Ask me anything…'}
      />
    </>
  );
});

export default ChatWindow;

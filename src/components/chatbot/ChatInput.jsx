/**
 * ChatInput.jsx
 *
 * The text input bar at the bottom of the chat window.
 * Supports free-text entry and send-on-Enter.
 */

import React, { memo, useCallback, useRef, useState } from 'react';

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChatInput = memo(function ChatInput({ onSend, disabled = false, placeholder }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e) => {
      // Send on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Auto-resize textarea
  const handleChange = useCallback((e) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 90)}px`;
  }, []);

  return (
    <div className="trakjobs-chat-footer">
      <div className="trakjobs-chat-input-row">
        <textarea
          ref={textareaRef}
          className="trakjobs-chat-input"
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type a message…'}
          disabled={disabled}
          aria-label="Chat message"
        />
        <button
          className="trakjobs-chat-send-btn"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          aria-label="Send message"
          type="button"
        >
          <SendIcon />
        </button>
      </div>
      <div className="trakjobs-chat-footer-hint">
        Powered by TrakJobs
      </div>
    </div>
  );
});

export default ChatInput;

/**
 * Chatbot.jsx
 *
 * The root floating chatbot widget for the TrakJobs landing page.
 *
 * This is the ONLY import required in LandingPage.jsx:
 *   <Chatbot />
 *
 * Features:
 *  - Floating launcher pill (bottom-right)
 *  - Animated open/close
 *  - Lazy-loads the chat window (zero perf impact when closed)
 *  - Fully isolated from existing UI
 *  - Keyboard accessible (Escape to close)
 */

import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import './styles/Chatbot.css';

// ─── Lazy-load the heavy chat window ─────────────────────────────────────────
const ChatWindow = lazy(() => import('./ChatWindow'));

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Fallback while chat window lazy-loads ─────────────────────────────────────

function ChatFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#f8fafc',
      }}
    >
      <div className="cb-spinner" style={{ borderTopColor: '#0f2744', borderColor: 'rgba(15,39,68,0.2)' }} />
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false); // prevent re-mounting
  const [animClass, setAnimClass] = useState('');
  const windowRef = useRef(null);
  const isClosingRef = useRef(false);

  // ── Open / Close ──────────────────────────────────────────────────────────
  const openChat = useCallback(() => {
    if (isOpen || isClosingRef.current) return;
    setHasOpened(true);
    setIsOpen(true);
    setAnimClass('cb-opening');
  }, [isOpen]);

  const closeChat = useCallback(() => {
    if (!isOpen || isClosingRef.current) return;
    isClosingRef.current = true;
    setAnimClass('cb-closing');
    setTimeout(() => {
      setIsOpen(false);
      setAnimClass('');
      isClosingRef.current = false;
    }, 220);
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);

  // ── Keyboard: Escape to close ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) closeChat();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeChat]);

  // ── Click-outside to close ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (windowRef.current && !windowRef.current.contains(e.target)) {
        // Only close if click is not on the launcher button
        const launcher = document.getElementById('trakjobs-chat-launcher-btn');
        if (launcher && launcher.contains(e.target)) return;
        closeChat();
      }
    };
    // Small delay so the open click doesn't immediately trigger this
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handler);
    };
  }, [isOpen, closeChat]);

  return (
    <>
      {/* ── Chat Window ──────────────────────────────────────────────────── */}
      {(isOpen || hasOpened) && (
        <div
          ref={windowRef}
          className={`trakjobs-chat-window ${animClass}`}
          style={{ display: isOpen ? 'flex' : 'none', flexDirection: 'column' }}
          role="dialog"
          aria-label="TrakJobs Chat Assistant"
          aria-modal="true"
        >
          <Suspense fallback={<ChatFallback />}>
            <ChatWindow onClose={closeChat} />
          </Suspense>
        </div>
      )}

      {/* ── Launcher Button ───────────────────────────────────────────────── */}
      <div className="trakjobs-chat-launcher" aria-label="Open chat" id="trakjobs-chat-launcher-btn">
        <button
          className="trakjobs-chat-launcher-pill"
          onClick={toggleChat}
          aria-expanded={isOpen}
          aria-controls="trakjobs-chat-window"
          type="button"
        >
          <div className="trakjobs-chat-launcher-icon" style={{ position: 'relative' }}>
            {isOpen ? <CloseIcon /> : <ChatIcon />}
            {!isOpen && <span className="trakjobs-chat-notif-dot" />}
          </div>
          {!isOpen && (
            <div className="trakjobs-chat-launcher-label">
              <span className="trakjobs-chat-launcher-title">Book a Service</span>
              <span className="trakjobs-chat-launcher-sub">We're online now</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
}

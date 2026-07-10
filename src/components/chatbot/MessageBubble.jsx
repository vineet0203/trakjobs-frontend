/**
 * MessageBubble.jsx
 *
 * Renders a single message row: bot or user bubble, timestamp,
 * quick-action buttons, and rich content (cards, summary, etc.).
 */

import React, { memo } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return '';
  }
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const BotAvatar = () => (
  <div className="cb-msg-avatar">TJ</div>
);

// ─── Rich Content Renderers ───────────────────────────────────────────────────

/**
 * Renders a list of selectable cards (e.g. service categories or sub-categories).
 */
function CardList({ items, onSelect }) {
  return (
    <div className="cb-cards">
      {items.map((item) => (
        <button
          key={item.id ?? item.label}
          className="cb-card"
          onClick={() => onSelect(item)}
          type="button"
        >
          <div className="cb-card-title">
            {item.icon && <span className="cb-card-icon">{item.icon}</span>}
            {item.label}
          </div>
          {item.sub && <div className="cb-card-sub">{item.sub}</div>}
        </button>
      ))}
    </div>
  );
}

/**
 * Renders the booking confirmation summary card.
 */
function BookingSummary({ data }) {
  const rows = [
    { label: 'Service', value: data.subCategoryName || data.categoryName },
    { label: 'Location', value: data.location },
    { label: 'Date', value: data.date },
    { label: 'Time', value: data.time },
    { label: 'Name', value: data.name },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    data.notes ? { label: 'Notes', value: data.notes } : null,
  ].filter(Boolean);

  return (
    <div className="cb-summary">
      <div className="cb-summary-title">📋 Booking Summary</div>
      {rows.map(({ label, value }) => (
        <div key={label} className="cb-summary-row">
          <span className="cb-summary-label">{label}:</span>
          <span className="cb-summary-value">{value || '—'}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders a success confirmation block.
 */
function SuccessBlock({ matchedProviders, isNewCustomer }) {
  return (
    <div className="cb-success">
      <div className="cb-success-icon">✅</div>
      <div className="cb-success-title">Booking Submitted!</div>
      <div className="cb-success-body">
        {matchedProviders > 0
          ? `${matchedProviders} provider${matchedProviders > 1 ? 's' : ''} notified. You'll receive quotes shortly.`
          : 'Your request has been received. A provider will be assigned to you soon.'}
        {isNewCustomer && (
          <div style={{ marginTop: 7 }}>
            📧 Check your email to set up your TrakJobs account and track your booking.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders a support links list.
 */
function SupportList({ items }) {
  return (
    <div className="cb-support-list">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="cb-support-item"
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          <div
            className="cb-support-icon"
            style={{ background: item.bgColor || '#f1f5f9' }}
          >
            {item.icon}
          </div>
          <div className="cb-support-text">
            <div className="cb-support-label">{item.label}</div>
            {item.sub && <div className="cb-support-sub">{item.sub}</div>}
          </div>
          <span style={{ color: 'var(--cb-text-light)', fontSize: 14 }}>›</span>
        </a>
      ))}
    </div>
  );
}

/**
 * Renders an error bubble.
 */
function ErrorBubble({ text }) {
  return <div className="cb-error-bubble">⚠️ {text}</div>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MessageBubble = memo(function MessageBubble({ message, onQuickAction }) {
  const isBot = message.type === 'bot';
  const meta = message.meta ?? {};

  return (
    <div className={`cb-msg-row ${isBot ? 'cb-bot-row' : 'cb-user-row'}`}>
      {/* Bot avatar (only on bot messages) */}
      {isBot && <BotAvatar />}

      <div className="cb-msg-content">
        {/* Primary text bubble */}
        {message.text && (
          <div className={`cb-bubble ${isBot ? 'cb-bot-bubble' : 'cb-user-bubble'}`}>
            {message.text}
          </div>
        )}

        {/* Rich content: card list */}
        {meta.type === 'cards' && (
          <CardList items={meta.items} onSelect={(item) => onQuickAction(item.value, item.label)} />
        )}

        {/* Rich content: booking summary */}
        {meta.type === 'summary' && <BookingSummary data={meta.data} />}

        {/* Rich content: success */}
        {meta.type === 'success' && (
          <SuccessBlock
            matchedProviders={meta.matchedProviders}
            isNewCustomer={meta.isNewCustomer}
          />
        )}

        {/* Rich content: support list */}
        {meta.type === 'support' && <SupportList items={meta.items} />}

        {/* Rich content: error */}
        {meta.type === 'error' && <ErrorBubble text={meta.text} />}

        {/* Quick-action option buttons */}
        {message.options && message.options.length > 0 && (
          <div className="cb-quick-actions">
            {message.options.map((opt) => (
              <button
                key={opt.value}
                className={`cb-quick-btn ${opt.primary ? 'cb-btn-primary' : ''}`}
                onClick={() => onQuickAction(opt.value, opt.label)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="cb-msg-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
});

export default MessageBubble;

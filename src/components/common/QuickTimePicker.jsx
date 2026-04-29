import React, { useState, useRef, useEffect } from 'react';
import { Clock3 } from 'lucide-react';
import './CustomDatePicker.css';

// Generate time slots every 30 minutes
const TIME_SLOTS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const value = `${hh}:${mm}`;
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? 'AM' : 'PM';
    const label = `${String(hour12).padStart(2, '0')}:${mm} ${ampm}`;
    TIME_SLOTS.push({ value, label });
  }
}

const QuickTimePicker = ({
  value,
  onChange,
  label,
  required = false,
  error = false,
  helperText,
  name,
  onBlur,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  // Display label
  const displayValue = (() => {
    if (!value) return '';
    const slot = TIME_SLOTS.find((s) => s.value === value);
    if (slot) return slot.label;
    // fallback: convert HH:mm to 12h
    const [hStr, mStr] = value.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr || '00';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${String(hour12).padStart(2, '0')}:${m} ${ampm}`;
  })();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onBlur]);

  // Scroll selected into view when opened
  useEffect(() => {
    if (open && listRef.current && value) {
      const active = listRef.current.querySelector('[data-active="true"]');
      if (active) {
        active.scrollIntoView({ block: 'center' });
      }
    }
  }, [open, value]);

  const handleSelect = (slot) => {
    onChange?.(slot.value);
    setOpen(false);
    onBlur?.();
  };

  return (
    <div
      className="custom-time-input-wrapper"
      ref={wrapperRef}
      style={{ position: 'relative' }}
    >
      {label && (
        <div className="custom-time-input-label-row">
          <label className="custom-time-input-label" htmlFor={name}>
            {label}
          </label>
          {required && <span className="custom-time-input-required">*</span>}
        </div>
      )}

      {/* Trigger */}
      <div
        className={`custom-time-input-shell ${error ? 'has-error' : ''}`}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen((p) => !p)}
        id={name}
      >
        <div className="custom-time-input" style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 14px', fontSize: '0.95rem', color: displayValue ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.42)' }}>
          {displayValue || 'Select time'}
        </div>
        <Clock3 size={18} className="custom-time-input-icon" />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            minWidth: 160,
            maxHeight: 220,
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #d7deea',
            borderRadius: 10,
            boxShadow: '0 8px 28px rgba(17,34,68,0.14)',
            zIndex: 9999,
            padding: '4px 0',
          }}
        >
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot.value === value;
            return (
              <div
                key={slot.value}
                data-active={isSelected}
                onClick={() => handleSelect(slot)}
                style={{
                  padding: '7px 16px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  background: isSelected ? '#3574bb' : 'transparent',
                  color: isSelected ? '#fff' : 'rgba(0,0,0,0.82)',
                  fontWeight: isSelected ? 600 : 400,
                  borderRadius: 6,
                  margin: '1px 4px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#eaf1fb';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {slot.label}
              </div>
            );
          })}
        </div>
      )}

      {error && helperText ? (
        <div className="custom-time-input-helper">{helperText}</div>
      ) : null}
    </div>
  );
};

export default QuickTimePicker;

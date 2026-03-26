import React from 'react';
import { Clock3 } from 'lucide-react';
import './CustomDatePicker.css';

const CustomTimeInput = ({
  value,
  onChange,
  placeholder = 'Select time',
  min,
  max,
  disabled = false,
  error = false,
  helperText,
  label,
  required = false,
  name,
  onBlur,
}) => {
  return (
    <div className="custom-time-input-wrapper">
      {label && (
        <div className="custom-time-input-label-row">
          <label className="custom-time-input-label" htmlFor={name}>
            {label}
          </label>
          {required && <span className="custom-time-input-required">*</span>}
        </div>
      )}

      <div className={`custom-time-input-shell ${error ? 'has-error' : ''}`}>
        <input
          id={name}
          type="time"
          name={name}
          value={value || ''}
          onChange={(event) => onChange?.(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          className="custom-time-input"
          step={300}
        />
        <Clock3 size={18} className="custom-time-input-icon" />
      </div>

      {error && helperText ? <div className="custom-time-input-helper">{helperText}</div> : null}
    </div>
  );
};

export default CustomTimeInput;

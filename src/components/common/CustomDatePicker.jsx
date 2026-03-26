import React, { forwardRef, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';

const toDateObject = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }

  return null;
};

const DateInput = forwardRef(function DateInput(
  { value, onClick, onChange, placeholder, disabled, hasError, onBlur, name },
  ref,
) {
  return (
    <div className={`custom-date-picker-input-shell ${hasError ? 'has-error' : ''}`}>
      <input
        ref={ref}
        type="text"
        name={name}
        value={value || ''}
        onClick={onClick}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="custom-date-picker-input"
        autoComplete="off"
      />
      <CalendarDays size={18} className="custom-date-picker-icon" />
    </div>
  );
});

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText,
  label,
  required = false,
  name,
  onBlur,
}) => {
  const selectedDate = useMemo(() => toDateObject(value), [value]);
  const minDateObject = useMemo(() => toDateObject(minDate), [minDate]);
  const maxDateObject = useMemo(() => toDateObject(maxDate), [maxDate]);

  const handleDateChange = (date) => {
    if (!date || !isValid(date)) {
      onChange?.('');
      return;
    }

    onChange?.(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="custom-date-picker-wrapper">
      {label && (
        <div className="custom-date-picker-label-row">
          <label className="custom-date-picker-label" htmlFor={name}>
            {label}
          </label>
          {required && <span className="custom-date-picker-required">*</span>}
        </div>
      )}

      <DatePicker
        id={name}
        selected={selectedDate}
        onChange={handleDateChange}
        onBlur={onBlur}
        minDate={minDateObject}
        maxDate={maxDateObject}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        disabled={disabled}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        calendarClassName="custom-date-picker-calendar"
        popperClassName="custom-date-picker-popper"
        customInput={<DateInput hasError={error} name={name} />}
      />

      {error && helperText ? <div className="custom-date-picker-helper">{helperText}</div> : null}
    </div>
  );
};

export default CustomDatePicker;

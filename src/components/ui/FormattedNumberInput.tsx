'use client';

import React, { useEffect, useState, useRef } from 'react';

export function formatWithCommas(val: string | number | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  const str = String(val).trim();
  if (str === '') return '';

  // Remove existing commas
  const clean = str.replace(/,/g, '');
  if (clean === '') return '';

  const parts = clean.split('.');
  const intPart = parts[0];
  const decimalPart = parts.length > 1 ? parts.slice(1).join('') : null;

  // Preserve leading minus if any
  const isNegative = intPart.startsWith('-');
  const unsignedInt = isNegative ? intPart.slice(1) : intPart;

  // Insert commas every 3 digits
  const formattedInt = unsignedInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const result = (isNegative ? '-' : '') + formattedInt;

  if (decimalPart !== null) {
    return `${result}.${decimalPart}`;
  }
  return result;
}

export function stripCommas(val: string | number | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  return String(val).replace(/,/g, '').trim();
}

export interface FormattedNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string | number | undefined | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeValue?: (rawValue: string) => void;
  allowDecimals?: boolean;
}

export const FormattedNumberInput = React.forwardRef<HTMLInputElement, FormattedNumberInputProps>(
  (
    {
      value,
      onChange,
      onChangeValue,
      allowDecimals = true,
      style,
      placeholder = '0',
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [displayVal, setDisplayVal] = useState<string>(() => formatWithCommas(value));

    // Synchronize displayValue with incoming value prop if changed externally
    useEffect(() => {
      const rawExternal = stripCommas(value);
      const rawCurrent = stripCommas(displayVal);
      if (rawExternal !== rawCurrent) {
        setDisplayVal(formatWithCommas(value));
      }
    }, [value, displayVal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const inputVal = target.value;
      const cursor = target.selectionStart || 0;

      // Count non-comma characters before the cursor
      const nonCommasBefore = inputVal.slice(0, cursor).replace(/,/g, '').length;

      // Filter characters: allow digits, period (if allowed), minus
      let raw = inputVal.replace(allowDecimals ? /[^\d.-]/g : /[^\d-]/g, '');

      // Ensure at most one minus at start
      if (raw.includes('-')) {
        const isNeg = raw.startsWith('-');
        raw = (isNeg ? '-' : '') + raw.replace(/-/g, '');
      }

      // Ensure at most one decimal point
      if (allowDecimals && raw.includes('.')) {
        const parts = raw.split('.');
        raw = parts[0] + '.' + parts.slice(1).join('');
      }

      const formatted = formatWithCommas(raw);
      setDisplayVal(formatted);

      // Notify parent
      onChangeValue?.(raw);

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name: e.target.name,
            value: raw,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      // Restore cursor position seamlessly
      requestAnimationFrame(() => {
        if (!target) return;
        let newCursor = 0;
        let nonCommasCount = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (formatted[i] !== ',') {
            nonCommasCount++;
          }
          if (nonCommasCount === nonCommasBefore) {
            newCursor = i + 1;
            break;
          }
        }
        // If typing at the end
        if (nonCommasBefore >= stripCommas(formatted).length) {
          newCursor = formatted.length;
        }
        target.setSelectionRange(newCursor, newCursor);
      });
    };

    return (
      <input
        ref={(el) => {
          inputRef.current = el;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={displayVal}
        onChange={handleChange}
        onWheel={(e) => (e.target as HTMLElement).blur()}
        style={{
          ...style,
        }}
        {...rest}
      />
    );
  }
);

FormattedNumberInput.displayName = 'FormattedNumberInput';
export default FormattedNumberInput;

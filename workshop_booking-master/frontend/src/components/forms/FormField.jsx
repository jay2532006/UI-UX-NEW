import React from 'react';

/**
 * Reusable form field wrapper with label, error message, and helper text.
 * Ensures every input has an explicit <label> (WCAG requirement).
 *
 * @param {string} label - Field label text
 * @param {string} id - Associates label with input (required for a11y)
 * @param {string} error - Error message (shown when truthy)
 * @param {string} helperText - Helper/description text below the field
 * @param {boolean} required - Show required indicator
 * @param {React.ReactNode} children - The input/select/textarea element
 */
export default function FormField({
  label,
  id,
  error,
  helperText,
  required = false,
  children,
  className = '',
}) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-fossee-dark mb-1.5"
        >
          {label}
          {required && (
            <>
              <span className="text-fossee-danger ml-0.5" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
      )}

      {/* Clone children to inject aria attributes */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          id,
          'aria-required': required || undefined,
          'aria-invalid': !!error || undefined,
          'aria-describedby': describedBy,
        });
      })}

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-fossee-danger">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="mt-1 text-xs text-fossee-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

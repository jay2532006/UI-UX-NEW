import React from 'react';

/**
 * Button component with multiple variants
 * @param {string} variant - primary, secondary, danger, ghost
 * @param {boolean} fullWidth - full width button
 * @param {boolean} disabled - disabled state
 * @param {function} onClick - click handler
 * @param {string} children - button text
 */
export default function Button({
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...props
}) {
  const baseClasses =
    'min-h-[44px] px-4 py-2 rounded-xl font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fossee-blue disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-fossee-blue text-white hover:bg-blue-900 active:scale-95',
    secondary:
      'border-2 border-fossee-blue text-fossee-blue hover:bg-fossee-light',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:scale-95',
    ghost:
      'text-fossee-blue underline hover:no-underline',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </button>
  );
}

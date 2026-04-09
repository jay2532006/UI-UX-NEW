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
    'min-h-[44px] px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fossee-blue disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:translate-y-[1px]';

  const variants = {
    primary:
      'bg-gradient-to-r from-fossee-blue to-blue-900 text-white hover:brightness-110 active:scale-[0.99] border border-blue-950/20',
    secondary:
      'border-2 border-fossee-blue text-fossee-blue bg-white hover:bg-blue-50',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 text-white hover:brightness-110 active:scale-[0.99] border border-red-900/20',
    ghost:
      'text-fossee-blue hover:bg-blue-50 no-underline',
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

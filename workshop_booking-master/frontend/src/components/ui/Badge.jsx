import React from 'react';

/**
 * Badge component for status/label indicators
 * @param {string} variant - badge style (default, success, error, warning)
 * @param {string} children - badge text
 */
export default function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    default: 'bg-gray-200 text-gray-900',
    success: 'bg-green-100 text-green-900',
    error: 'bg-red-100 text-red-900',
    warning: 'bg-amber-100 text-amber-900',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

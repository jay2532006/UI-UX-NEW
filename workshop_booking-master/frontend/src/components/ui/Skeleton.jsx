import React from 'react';

/**
 * Skeleton loader component — matches content shape for zero layout shift.
 * MASTER_PROMPT Section 13.4: "Skeleton loaders that match content shape"
 *
 * @param {'text'|'circle'|'card'|'workshop-card'|'rect'} variant
 * @param {string} className - Additional classes
 * @param {number} lines - Number of text lines (for variant='text')
 */
export default function Skeleton({ variant = 'rect', className = '', lines = 3 }) {
  const shimmer =
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded';

  if (variant === 'circle') {
    return <div className={`${shimmer} w-10 h-10 rounded-full ${className}`} aria-hidden="true" />;
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${shimmer} h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`rounded-2xl border border-gray-200 bg-white p-5 space-y-3 ${className}`}
        aria-hidden="true"
      >
        <div className={`${shimmer} h-5 w-2/3`} />
        <div className={`${shimmer} h-4 w-1/2`} />
        <div className={`${shimmer} h-4 w-full`} />
      </div>
    );
  }

  if (variant === 'workshop-card') {
    return (
      <div
        className={`rounded-2xl border border-gray-200 bg-white p-5 space-y-3 ${className}`}
        aria-hidden="true"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className={`${shimmer} h-5 w-3/4`} />
            <div className={`${shimmer} h-4 w-1/2`} />
          </div>
          <div className={`${shimmer} h-6 w-20 rounded-full`} />
        </div>
        <div className="flex gap-2 mt-3">
          <div className={`${shimmer} h-7 w-24 rounded-md`} />
          <div className={`${shimmer} h-7 w-32 rounded-full`} />
        </div>
      </div>
    );
  }

  // Default: rectangle
  return <div className={`${shimmer} h-20 w-full ${className}`} aria-hidden="true" />;
}

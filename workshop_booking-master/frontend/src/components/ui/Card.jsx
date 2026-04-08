import React from 'react';

/**
 * Card component - a reusable container for content
 * @param {string} title - card title
 * @param {string} subtitle - card subtitle
 * @param {string} badge - badge text in top right
 * @param {function} onClick - click handler
 * @param {React.ReactNode} children - card content
 */
export default function Card({
  title,
  subtitle,
  badge,
  onClick,
  children,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl shadow-sm bg-white p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          {title && <h3 className="font-semibold text-lg text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        {badge && (
          <span className="whitespace-nowrap bg-fossee-orange text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children && <div className="text-gray-700">{children}</div>}
    </div>
  );
}

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
      className={`rounded-2xl border border-slate-200/70 shadow-sm bg-white/95 p-4 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          {title && <h3 className="font-bold text-lg tracking-tight text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
        {badge && (
          <span className="whitespace-nowrap bg-fossee-orange/15 text-fossee-orange-dark text-xs font-semibold px-2.5 py-1 rounded-full border border-fossee-orange/30">
            {badge}
          </span>
        )}
      </div>
      {children && <div className="text-slate-700">{children}</div>}
    </div>
  );
}

import React from 'react';

/**
 * Card component — base container with MASTER_PROMPT shadow levels and spacing.
 * Hover lift animation: translate-y: -2px, shadow-card → shadow-hover.
 *
 * @param {string} title - card title
 * @param {string} subtitle - card subtitle
 * @param {string} badge - badge text in top right
 * @param {function} onClick - click handler (makes card interactive)
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
  const interactive = !!onClick;

  return (
    <div
      className={`
        rounded-2xl border border-fossee-border bg-fossee-card
        p-5 md:p-6 shadow-card
        transition-all duration-200 ease-out
        ${interactive ? 'cursor-pointer hover:shadow-hover hover:-translate-y-0.5 hover:border-fossee-primary/30 active:translate-y-0' : ''}
        ${className}
      `}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {(title || badge) && (
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1 min-w-0">
            {title && <h3 className="font-bold text-lg tracking-tight text-fossee-dark truncate">{title}</h3>}
            {subtitle && <p className="text-sm text-fossee-muted mt-0.5">{subtitle}</p>}
          </div>
          {badge && (
            <span className="whitespace-nowrap bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 flex-shrink-0">
              {badge}
            </span>
          )}
        </div>
      )}
      {children && <div className="text-gray-700">{children}</div>}
    </div>
  );
}


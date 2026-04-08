import React from 'react';

/**
 * EmptyState component - shown when there's no data to display
 * @param {string} message - empty state message
 * @param {string} icon - lucide icon name or element
 * @param {React.ReactNode} action - optional CTA button/link
 */
export default function EmptyState({ message, icon: Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="mb-4 text-gray-400">
          {typeof Icon === 'string' ? (
            <div className="text-5xl">{Icon}</div>
          ) : (
            <Icon size={48} />
          )}
        </div>
      )}
      <p className="text-gray-600 mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

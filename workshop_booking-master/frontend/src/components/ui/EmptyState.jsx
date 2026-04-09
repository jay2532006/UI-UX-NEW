import React from 'react';

/**
 * EmptyState component
 * @param {string} message - message to display
 * @param {React.Component|string} Icon - Lucide icon component OR emoji string
 * @param {React.ReactNode} action - optional CTA element (e.g. a Button)
 */
export default function EmptyState({ message, Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
      {Icon && (
        <div className="text-4xl text-gray-300">
          {typeof Icon === 'string' ? (
            // String emoji passthrough
            <span role="img" aria-hidden="true">{Icon}</span>
          ) : (
            // Lucide component
            <Icon size={48} strokeWidth={1.2} />
          )}
        </div>
      )}
      <p className="text-gray-500 font-medium">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast notification component
 * @param {string} type - success, error, info
 * @param {string} message - toast message
 * @param {function} onClose - callback to close toast
 * @param {number} duration - auto-dismiss duration in ms (0 = no auto-dismiss)
 */
export default function Toast({ type = 'info', message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div
      className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 border rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${colors[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

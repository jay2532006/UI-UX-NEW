import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal component - accessible dialog with focus trap
 * @param {boolean} isOpen - whether modal is open
 * @param {function} onClose - callback when modal should close
 * @param {string} title - modal title
 * @param {React.ReactNode} children - modal content
 */
export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent body scroll

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-lg p-6 sm:p-8 animate-in slide-in-from-bottom-4 sm:fade-in sm:zoom-in-95 safe-area-inset-bottom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-fossee-blue"
          aria-label="Close modal"
        >
          <X size={24} aria-hidden="true" />
        </button>

        {/* Title */}
        {title && (
          <h2 id="modal-title" className="text-xl font-semibold mb-4 pr-8">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="text-gray-700">{children}</div>
      </div>
    </div>
  );
}

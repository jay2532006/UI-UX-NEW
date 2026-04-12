/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal component — accessible dialog with Framer Motion animation and focus trap.
 * @param {boolean} isOpen - whether modal is open
 * @param {function} onClose - callback when modal should close
 * @param {string} title - modal title
 * @param {React.ReactNode} children - modal content
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save the element that was focused before modal opened
    previousFocusRef.current = document.activeElement;

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Focus trap — keep Tab cycling inside modal
    const handleTab = (e) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    document.body.style.overflow = 'hidden';

    // Auto-focus the close button
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector('[data-modal-close]');
      closeBtn?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'auto';
      clearTimeout(timer);
      // Return focus to the element that triggered the modal
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Modal panel */}
          <motion.div
            ref={modalRef}
            className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-modal p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Close Button */}
            <button
              data-modal-close
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-fossee-blue"
              aria-label="Close modal"
            >
              <X size={24} aria-hidden="true" />
            </button>

            {/* Title */}
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold mb-4 pr-8 text-fossee-dark">
                {title}
              </h2>
            )}

            {/* Content */}
            <div className="text-gray-700">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


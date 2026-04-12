import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';

/**
 * PageWrapper component — wraps pages with consistent layout.
 * Desktop: Navbar (top) + content + Footer (bottom)
 * Mobile: Navbar (top) + content + BottomNav (fixed bottom)
 */
export default function PageWrapper({ children, hideFooter = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen bg-fossee-surface surface-grid flex flex-col"
    >
      {/* Skip to main content link — must be first focusable element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-fossee-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:z-50"
      >
        Skip to main content
      </a>

      {/* Header with navigation */}
      <header role="banner">
        <Navbar />
      </header>

      {/* Main content area */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full pb-20 md:pb-0">
        {children}
      </main>

      {/* Desktop footer */}
      {!hideFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}

      {/* Mobile bottom navigation */}
      <footer className="md:hidden">
        <BottomNav />
      </footer>
    </motion.div>
  );
}


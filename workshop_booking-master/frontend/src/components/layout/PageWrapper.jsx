import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

/**
 * PageWrapper component - wraps pages with consistent layout
 * Adds Navbar (desktop) + BottomNav (mobile) + proper padding
 */
export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-fossee-light surface-grid flex flex-col">
      {/* Skip to main content link - must be first focusable element */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-fossee-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:z-50"
      >
        Skip to main content
      </a>
      
      {/* Header with navigation */}
      <header role="banner">
        <Navbar />
      </header>
      
      {/* Main content area */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Mobile navigation footer */}
      <footer className="md:hidden">
        <BottomNav />
      </footer>
    </div>
  );
}

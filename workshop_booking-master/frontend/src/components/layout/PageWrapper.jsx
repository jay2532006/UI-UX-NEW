import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

/**
 * PageWrapper component - wraps pages with consistent layout
 * Adds Navbar (desktop) + BottomNav (mobile) + proper padding
 */
export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-fossee-light flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pb-16 md:pb-0">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

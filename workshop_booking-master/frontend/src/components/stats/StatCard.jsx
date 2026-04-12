/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';

/**
 * StatCard — animated counter card with IntersectionObserver count-up.
 * MASTER_PROMPT Section 13.6: "Animated stat counters on the landing page"
 *
 * @param {string} label - Stat label
 * @param {number} value - Target number to count up to
 * @param {string} color - Tailwind text color class (e.g. 'text-fossee-primary')
 * @param {string} bgColor - Tailwind bg class for the card
 * @param {React.ReactNode} icon - Optional icon element
 */
export default function StatCard({ label, value = 0, color = 'text-fossee-primary', bgColor = '', icon }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(value);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const animateCount = (target) => {
    const duration = 1500; // ms
    const start = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-fossee-border p-5 md:p-6 shadow-card text-center ${bgColor}`}
    >
      {icon && (
        <div className="mb-2 flex justify-center" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className={`text-4xl md:text-5xl font-black tracking-tight ${color}`}>
        {displayValue.toLocaleString()}
      </div>
      <div className="text-sm font-medium text-fossee-muted mt-1.5">{label}</div>
    </div>
  );
}

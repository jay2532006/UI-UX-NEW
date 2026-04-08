import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BarChart3, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * BottomNav component - mobile navigation (hidden on desktop)
 */
export default function BottomNav() {
  const location = useLocation();
  const { role } = useAuth();

  // Determine home path based on role
  const homePath = role === 'instructor' ? '/instructor/dashboard' : '/dashboard';

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: homePath, icon: Home, label: 'Home', ariaLabel: 'Go to Dashboard' },
    { path: '/workshop-types', icon: BookOpen, label: 'Workshops', ariaLabel: 'Browse Workshops' },
    { path: '/statistics', icon: BarChart3, label: 'Stats', ariaLabel: 'View Statistics' },
    { path: '/profile', icon: User, label: 'Profile', ariaLabel: 'View Profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex justify-around items-center h-16 safe-area-inset-bottom z-40"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {navLinks.map(({ path, icon: Icon, label, ariaLabel }) => (
        <Link
          key={path}
          to={path}
          className="flex flex-col items-center gap-1 py-2 px-3 flex-1 justify-center relative group"
          aria-label={ariaLabel}
          aria-current={isActive(path) ? 'page' : undefined}
        >
          <Icon size={24} className={isActive(path) ? 'text-fossee-blue' : 'text-gray-600'} />
          <span className="text-xs font-medium">{label}</span>
          {isActive(path) && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-fossee-orange rounded-full"></div>
          )}
        </Link>
      ))}
    </nav>
  );
}

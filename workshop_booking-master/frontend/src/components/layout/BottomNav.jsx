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
      className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around items-center h-16 safe-area-inset-bottom z-40 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {navLinks.map((item) => {
        const NavIcon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 py-2 px-3 mx-1 flex-1 justify-center relative rounded-xl transition-colors ${isActive(item.path) ? 'bg-fossee-light text-fossee-blue' : 'text-slate-600 hover:bg-slate-100'}`}
            aria-label={item.ariaLabel}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <NavIcon size={22} className={isActive(item.path) ? 'text-fossee-blue' : 'text-slate-600'} />
            <span className="text-[11px] font-semibold tracking-wide">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute -top-[1px] left-2 right-2 h-1 bg-fossee-orange rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

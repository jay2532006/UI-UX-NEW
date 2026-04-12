import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, LogOut, BarChart3, BookOpen, PlusCircle, User, Home } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Navbar component — responsive with hamburger menu drawer on mobile.
 * Desktop: horizontal nav bar. Mobile: slide-in drawer.
 */
export default function Navbar() {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const closeMobile = () => setMobileOpen(false);

  // Build nav links based on role
  const navLinks = [];

  if (role === 'coordinator') {
    navLinks.push(
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/propose', label: 'Propose', icon: PlusCircle },
      { path: '/my-workshops', label: 'My Workshops', icon: BookOpen },
    );
  }
  if (role === 'instructor') {
    navLinks.push(
      { path: '/instructor/dashboard', label: 'Dashboard', icon: Home },
    );
  }
  navLinks.push(
    { path: '/workshop-types', label: 'Workshops', icon: BookOpen },
    { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  );

  return (
    <>
      <nav
        className="glass-nav text-white h-16 flex items-center px-4 md:px-6 border-b border-white/15 shadow-lg relative z-40"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to={role === 'instructor' ? '/instructor/dashboard' : (role ? '/dashboard' : '/')}
          className="font-extrabold tracking-tight text-lg"
          aria-label="FOSSEE Workshop Portal — Go to home"
        >
          FOSSEE Portal
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex flex-1 gap-1 ml-8">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-white/15 text-white'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop user area */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <>
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                {user.first_name} ({role})
              </span>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive('/profile')
                    ? 'bg-white/15 text-white'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                Profile
              </Link>
            </>
          )}
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/15 text-sm">
            <LogOut size={16} className="mr-1" /> Logout
          </Button>
        </div>

        {/* Mobile hamburger — visible only below md */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30" aria-hidden="true">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-16 right-0 bottom-0 w-72 bg-fossee-dark z-30 transform transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation menu"
        role="navigation"
      >
        <div className="p-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-white/10 my-3" />

          {user && (
            <Link
              to="/profile"
              onClick={closeMobile}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
            >
              <User size={18} />
              Profile
            </Link>
          )}

          <button
            onClick={() => { closeMobile(); handleLogout(); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-white/10 hover:text-red-200 w-full text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

/**
 * Navbar component - desktop navigation (hidden on mobile)
 */
export default function Navbar() {
  const { user, logout, role } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <nav 
      className="hidden md:flex glass-nav text-white h-16 items-center px-6 border-b border-white/15 shadow-lg"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link 
        to={role === 'instructor' ? '/instructor/dashboard' : '/dashboard'} 
        className="font-extrabold tracking-tight text-lg"
        aria-label="FOSSEE Workshop Portal - Go to home"
      >
        FOSSEE Portal
      </Link>

      {/* Nav Links */}
      <div className="flex-1 flex gap-3 ml-8">
        {role === 'coordinator' && (
          <>
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
              aria-current={isActive('/dashboard') ? 'page' : undefined}
            >
              Dashboard
            </Link>
            <Link to="/propose" className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/propose') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
              Propose
            </Link>
            <Link to="/my-workshops" className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/my-workshops') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
              My Workshops
            </Link>
          </>
        )}
        {role === 'instructor' && (
          <>
            <Link to="/instructor/dashboard" className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/instructor/dashboard') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
              Dashboard
            </Link>
          </>
        )}
        <Link to="/workshop-types" className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/workshop-types') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
          Workshops
        </Link>
        <Link to="/statistics" className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/statistics') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
          Stats
        </Link>
      </div>

      {/* User Profile & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
              {user.first_name} ({role})
            </span>
            <Link to="/profile" className={`px-3 py-1.5 rounded-lg transition-colors ${isActive('/profile') ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
              Profile
            </Link>
          </>
        )}
        <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/15">
          Logout
        </Button>
      </div>
    </nav>
  );
}

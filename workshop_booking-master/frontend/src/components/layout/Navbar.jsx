import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

/**
 * Navbar component - desktop navigation (hidden on mobile)
 */
export default function Navbar() {
  const { user, logout, role } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <nav className="hidden md:flex bg-fossee-blue text-white h-16 items-center px-6 shadow-md">
      {/* Logo */}
      <Link to={role === 'instructor' ? '/instructor/dashboard' : '/dashboard'} className="font-bold text-lg">
        FOSSEE
      </Link>

      {/* Nav Links */}
      <div className="flex-1 flex gap-8 ml-8">
        {role === 'coordinator' && (
          <>
            <Link
              to="/dashboard"
              className="hover:text-fossee-light transition-colors"
              aria-current="page"
            >
              Dashboard
            </Link>
            <Link to="/propose" className="hover:text-fossee-light transition-colors">
              Propose
            </Link>
            <Link to="/my-workshops" className="hover:text-fossee-light transition-colors">
              My Workshops
            </Link>
          </>
        )}
        {role === 'instructor' && (
          <>
            <Link to="/instructor/dashboard" className="hover:text-fossee-light transition-colors">
              Dashboard
            </Link>
          </>
        )}
        <Link to="/workshop-types" className="hover:text-fossee-light transition-colors">
          Workshops
        </Link>
        <Link to="/statistics" className="hover:text-fossee-light transition-colors">
          Stats
        </Link>
      </div>

      {/* User Profile & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm">
              {user.first_name} ({role})
            </span>
            <Link to="/profile" className="hover:text-fossee-light">
              Profile
            </Link>
          </>
        )}
        <Button variant="ghost" onClick={handleLogout} className="text-white">
          Logout
        </Button>
      </div>
    </nav>
  );
}

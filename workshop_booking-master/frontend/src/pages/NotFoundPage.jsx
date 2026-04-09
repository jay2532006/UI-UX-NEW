import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function NotFoundPage() {
  const { isAuthenticated, role } = useAuth();

  // Smart "home" link based on auth state and role
  const homePath = !isAuthenticated
    ? '/login'
    : role === 'instructor'
    ? '/instructor/dashboard'
    : '/dashboard';

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | FOSSEE Workshop Booking</title>
        <meta
          name="description"
          content="The page you are looking for does not exist. Return to the main dashboard or explore our workshops."
        />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-fossee-light p-4">
        <div className="text-center max-w-sm">
          <div className="text-8xl font-black text-fossee-blue mb-2">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or you may not have permission to view it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={homePath}
              className="inline-block px-6 py-3 bg-fossee-blue text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/statistics"
              className="inline-block px-6 py-3 border-2 border-fossee-blue text-fossee-blue rounded-xl font-semibold hover:bg-fossee-light transition-colors"
            >
              View Statistics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

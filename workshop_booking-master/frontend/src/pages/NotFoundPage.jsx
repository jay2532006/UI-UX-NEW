import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | FOSSEE Workshop Booking</title>
        <meta name="description" content="The page you are looking for does not exist. Return to the main dashboard or explore our workshops." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-fossee-light p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-fossee-blue mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Page not found</p>
          <Link
            to="/statistics"
            className="inline-block px-6 py-3 bg-fossee-blue text-white rounded-lg hover:bg-blue-900"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/ui/Spinner';
import { useAuth } from './hooks/useAuth';

// Auth Pages - lazy loaded
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));

// Coordinator Pages - lazy loaded
const CoordinatorDashboard = React.lazy(() => import('./pages/coordinator/CoordinatorDashboard'));
const ProposeWorkshopPage = React.lazy(() => import('./pages/coordinator/ProposeWorkshopPage'));
const WorkshopStatusPage = React.lazy(() => import('./pages/coordinator/WorkshopStatusPage'));

// Instructor Pages - lazy loaded
const InstructorDashboard = React.lazy(() => import('./pages/instructor/InstructorDashboard'));
const WorkshopManagePage = React.lazy(() => import('./pages/instructor/WorkshopManagePage'));

// Shared Pages - lazy loaded
const WorkshopTypesPage = React.lazy(() => import('./pages/shared/WorkshopTypesPage'));
const WorkshopDetailPage = React.lazy(() => import('./pages/shared/WorkshopDetailPage'));
const ProfilePage = React.lazy(() => import('./pages/shared/ProfilePage'));
const StatisticsPage = React.lazy(() => import('./pages/shared/StatisticsPage'));

// Other Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-fossee-light">
    <Spinner />
  </div>
);

/**
 * Root redirect — sends users to the right place based on auth state + role
 */
function RootRedirect() {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth-based redirect (for '/home') */}
        <Route path="/home" element={<RootRedirect />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />

        {/* Coordinator Routes */}
        <Route path="/dashboard" element={<ProtectedRoute Component={CoordinatorDashboard} requiredRoles={['coordinator']} />} />
        <Route path="/propose" element={<ProtectedRoute Component={ProposeWorkshopPage} requiredRoles={['coordinator']} />} />
        <Route path="/my-workshops" element={<ProtectedRoute Component={WorkshopStatusPage} requiredRoles={['coordinator']} />} />

        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={<ProtectedRoute Component={InstructorDashboard} requiredRoles={['instructor']} />} />
        <Route path="/instructor/workshops/:id" element={<ProtectedRoute Component={WorkshopManagePage} requiredRoles={['instructor']} />} />

        {/* Shared Auth Routes */}
        <Route path="/workshop-types" element={<ProtectedRoute Component={WorkshopTypesPage} />} />
        <Route path="/workshop/:id" element={<ProtectedRoute Component={WorkshopDetailPage} />} />
        <Route path="/profile" element={<ProtectedRoute Component={ProfilePage} />} />

        {/* Catch-all */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
          <Router>
            <AuthProvider>
              <ToastProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <AnimatedRoutes />
                </Suspense>
              </ToastProvider>
            </AuthProvider>
          </Router>
        </GoogleOAuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

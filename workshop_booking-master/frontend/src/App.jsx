import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/ui/Spinner';

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
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-fossee-light">
    <Spinner />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />

                {/* Coordinator Routes */}
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute Component={CoordinatorDashboard} requiredRoles={['coordinator']} />}
                />
                <Route
                  path="/propose"
                  element={<ProtectedRoute Component={ProposeWorkshopPage} requiredRoles={['coordinator']} />}
                />
                <Route
                  path="/my-workshops"
                  element={<ProtectedRoute Component={WorkshopStatusPage} requiredRoles={['coordinator']} />}
                />

                {/* Instructor Routes */}
                <Route
                  path="/instructor/dashboard"
                  element={<ProtectedRoute Component={InstructorDashboard} requiredRoles={['instructor']} />}
                />
                <Route
                  path="/instructor/workshops/:id"
                  element={<ProtectedRoute Component={WorkshopManagePage} requiredRoles={['instructor']} />}
                />

                {/* Shared Auth Routes */}
                <Route
                  path="/workshop-types"
                  element={<ProtectedRoute Component={WorkshopTypesPage} />}
                />
                <Route
                  path="/workshop/:id"
                  element={<ProtectedRoute Component={WorkshopDetailPage} />}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute Component={ProfilePage} />}
                />

                {/* Catch-all */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

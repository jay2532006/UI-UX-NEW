import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      // Route based on role returned by the auth context after login
      const destination = result.role === 'instructor'
        ? '/instructor/dashboard'
        : '/dashboard';
      navigate(destination, { replace: true });
    } else {
      setToast({
        type: 'error',
        message: result.error || 'Login failed',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login — FOSSEE Workshop Booking</title>
        <meta name="description" content="Login to the FOSSEE Workshop Booking Portal. Access your workshops, proposals, and workshop management tools." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-fossee-light p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-fossee-blue mb-2">FOSSEE</div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-600 mt-2">Workshop Booking Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none transition-colors"
                required
                disabled={loading}
                autoComplete="username"
                aria-required="true"
                aria-describedby="username-help"
              />
              <p id="username-help" className="text-xs text-gray-500 mt-1">Enter your registered email address or username</p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none transition-colors"
                required
                disabled={loading}
                autoComplete="current-password"
                aria-required="true"
                aria-describedby="password-help"
              />
              <p id="password-help" className="text-xs text-gray-500 mt-1">Enter your account password</p>
            </div>

            {/* Forgot Password Link — points to Django's built-in password reset */}
            <div className="text-right">
              <a
                href="/reset/password_reset/"
                className="text-sm text-fossee-blue hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-fossee-blue font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}

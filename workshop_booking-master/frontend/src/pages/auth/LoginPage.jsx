/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import FormField from '../../components/forms/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      const destination = result.role === 'instructor'
        ? '/instructor/dashboard'
        : '/dashboard';
      navigate(destination, { replace: true });
    } else {
      addToast('error', result.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    if (result.success) {
      const destination = result.role === 'instructor' ? '/instructor/dashboard' : '/dashboard';
      navigate(destination, { replace: true });
    } else {
      addToast('error', result.error || 'Google Login failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login — FOSSEE Workshop Booking</title>
        <meta name="description" content="Login to the FOSSEE Workshop Booking Portal. Access your workshops, proposals, and management tools." />
        <meta property="og:title" content="Login — FOSSEE Workshop Booking" />
        <meta property="og:description" content="Sign in to manage your FOSSEE workshops." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-fossee-surface p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-4xl font-bold text-fossee-primary mb-2 block hover:opacity-90 transition-opacity">
              FOSSEE
            </Link>
            <h1 className="text-2xl font-semibold text-fossee-dark">Welcome Back</h1>
            <p className="text-sm text-fossee-muted mt-2">Workshop Booking Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-1">
            <FormField
              label="Email or Username"
              id="username"
              required
              helperText="Enter your registered email address or username"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-[52px] px-4 rounded-xl border-2 border-fossee-border focus:border-fossee-primary focus:outline-none transition-colors bg-white"
                required
                disabled={loading}
                autoComplete="username"
              />
            </FormField>

            <FormField
              label="Password"
              id="password"
              required
              helperText="Enter your account password"
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-[52px] px-4 pr-12 rounded-xl border-2 border-fossee-border focus:border-fossee-primary focus:outline-none transition-colors bg-white"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-fossee-muted hover:text-fossee-dark transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-fossee-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>

            {/* Forgot Password Link */}
            <div className="text-right pb-2">
              <a
                href="/reset/password_reset/"
                className="text-sm text-fossee-primary hover:underline"
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
            
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-fossee-surface text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => addToast('error', 'Google Sign-In failed')}
                useOneTap
              />
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-fossee-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-fossee-primary font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

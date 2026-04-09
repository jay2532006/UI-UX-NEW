import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

const INDIAN_STATES = [
  { value: 'IN-AP', label: 'Andhra Pradesh' },
  { value: 'IN-AR', label: 'Arunachal Pradesh' },
  { value: 'IN-AS', label: 'Assam' },
  { value: 'IN-BR', label: 'Bihar' },
  { value: 'IN-CT', label: 'Chhattisgarh' },
  { value: 'IN-GA', label: 'Goa' },
  { value: 'IN-GJ', label: 'Gujarat' },
  { value: 'IN-HR', label: 'Haryana' },
  { value: 'IN-HP', label: 'Himachal Pradesh' },
  { value: 'IN-JK', label: 'Jammu and Kashmir' },
  { value: 'IN-JH', label: 'Jharkhand' },
  { value: 'IN-KA', label: 'Karnataka' },
  { value: 'IN-KL', label: 'Kerala' },
  { value: 'IN-MP', label: 'Madhya Pradesh' },
  { value: 'IN-MH', label: 'Maharashtra' },
  { value: 'IN-MN', label: 'Manipur' },
  { value: 'IN-ML', label: 'Meghalaya' },
  { value: 'IN-MZ', label: 'Mizoram' },
  { value: 'IN-NL', label: 'Nagaland' },
  { value: 'IN-OR', label: 'Odisha' },
  { value: 'IN-PB', label: 'Punjab' },
  { value: 'IN-RJ', label: 'Rajasthan' },
  { value: 'IN-SK', label: 'Sikkim' },
  { value: 'IN-TN', label: 'Tamil Nadu' },
  { value: 'IN-TG', label: 'Telangana' },
  { value: 'IN-TR', label: 'Tripura' },
  { value: 'IN-UT', label: 'Uttarakhand' },
  { value: 'IN-UP', label: 'Uttar Pradesh' },
  { value: 'IN-WB', label: 'West Bengal' },
  { value: 'IN-AN', label: 'Andaman and Nicobar Islands' },
  { value: 'IN-CH', label: 'Chandigarh' },
  { value: 'IN-DN', label: 'Dadra and Nagar Haveli' },
  { value: 'IN-DD', label: 'Daman and Diu' },
  { value: 'IN-DL', label: 'Delhi' },
  { value: 'IN-LD', label: 'Lakshadweep' },
  { value: 'IN-PY', label: 'Puducherry' },
];

const DEPARTMENTS = [
  { value: 'computer engineering', label: 'Computer Science & Engineering' },
  { value: 'information technology', label: 'Information Technology' },
  { value: 'civil engineering', label: 'Civil Engineering' },
  { value: 'electrical engineering', label: 'Electrical Engineering' },
  { value: 'mechanical engineering', label: 'Mechanical Engineering' },
  { value: 'chemical engineering', label: 'Chemical Engineering' },
  { value: 'aerospace engineering', label: 'Aerospace Engineering' },
  { value: 'biosciences and bioengineering', label: 'Biosciences and BioEngineering' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'energy science and engineering', label: 'Energy Science and Engineering' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    institute: '',
    department: '',
    phone_number: '',
    position: 'coordinator',
    state: '',
    title: '',
    location: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.username || !formData.password) {
        setToast({ type: 'error', message: 'Please fill all required fields' });
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setToast({ type: 'error', message: 'Passwords do not match' });
        return;
      }
    } else if (step === 2) {
      if (!formData.title || !formData.first_name || !formData.institute || !formData.department || !formData.phone_number) {
        setToast({ type: 'error', message: 'Please fill all required fields' });
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.state) {
      setToast({ type: 'error', message: 'Please provide location and state' });
      return;
    }

    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      setToast({
        type: 'success',
        message: 'Registration successful! Check your email to verify your account.',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setToast({
        type: 'error',
        message: result.error || 'Registration failed',
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Create Account — FOSSEE Workshop Booking</title>
        <meta name="description" content="Register for the FOSSEE Workshop Booking Portal. Create an account to propose, manage, or attend workshops." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-fossee-light p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-fossee-blue mb-2">FOSSEE</div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Account</h1>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i <= step ? 'bg-fossee-orange' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Email & Password */}
          {step === 1 && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                >
                  <option value="">Select title...</option>
                  <option value="Professor">Prof.</option>
                  <option value="Doctor">Dr.</option>
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Miss">Ms.</option>
                  <option value="Shriman">Shri</option>
                  <option value="Shrimati">Smt</option>
                  <option value="Kumari">Ku</option>
                </select>
              </div>
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="institute" className="block text-sm font-medium text-gray-700 mb-1">
                  Institute
                </label>
                <input
                  id="institute"
                  type="text"
                  name="institute"
                  value={formData.institute}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                >
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="position"
                      value="coordinator"
                      checked={formData.position === 'coordinator'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Coordinator</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="position"
                      value="instructor"
                      checked={formData.position === 'instructor'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Instructor</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Location & T&C */}
          {step === 3 && (
            <>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  City / Location
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="E.g. Mumbai"
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none mb-4"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  required
                >
                  <option value="">Select a state...</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-fossee-light p-4 rounded-xl text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                <p className="text-xs mb-2">
                  By registering, you agree to follow the FOSSEE Workshop guidelines and ethical standards. You must provide accurate information and will be responsible for maintaining the confidentiality of your account.
                </p>
                <p className="text-xs">
                  For more details, visit the workshop guidelines page.
                </p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1"
                />
                <span className="text-sm">I agree to the Terms & Conditions</span>
              </label>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="secondary" onClick={handleBack} fullWidth disabled={loading}>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button variant="primary" onClick={handleNext} fullWidth disabled={loading}>
                Next
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-fossee-blue font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={toast.type === 'success' ? 3000 : 0}
        />
      )}
    </div>
    </>
  );
}

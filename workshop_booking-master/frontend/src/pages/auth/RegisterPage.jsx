/* eslint-disable */
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import FormField from '../../components/forms/FormField';
import { INDIAN_STATES, DEPARTMENTS, TITLES, POSITIONS } from '../../utils/constants';
import { validateEmail, validatePassword, validatePhone, getPasswordStrength, PASSWORD_STRENGTH_CONFIG } from '../../utils/validators';

export default function RegisterPage() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: '', username: '', password: '', confirm_password: '',
    first_name: '', last_name: '', institute: '', department: '',
    phone_number: '', position: 'coordinator', state: '', title: '', location: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate on blur
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') error = validateEmail(value).message;
    if (name === 'password') error = validatePassword(value).message;
    if (name === 'phone_number' && value) error = validatePhone(value).message;
    if (name === 'confirm_password' && value && value !== formData.password) error = 'Passwords do not match';
    if (['first_name', 'institute', 'department', 'title'].includes(name) && !value) error = 'This field is required';

    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
  }, [formData.password]);

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthConfig = PASSWORD_STRENGTH_CONFIG[passwordStrength];

  const handleNext = () => {
    if (step === 1) {
      const newErrors = {};
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email).valid) newErrors.email = validateEmail(formData.email).message;
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!validatePassword(formData.password).valid) newErrors.password = validatePassword(formData.password).message;
      if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';

      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    }
    if (step === 2) {
      const newErrors = {};
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.institute) newErrors.institute = 'Institute is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
      else if (!validatePhone(formData.phone_number).valid) newErrors.phone_number = validatePhone(formData.phone_number).message;

      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.state) {
      addToast('error', 'Please provide location and state');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      addToast('success', 'Registration successful! Redirecting to login...');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } else {
      addToast('error', result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const inputClass = 'w-full h-[52px] px-4 rounded-xl border-2 border-fossee-border focus:border-fossee-primary focus:outline-none transition-colors bg-white';

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <>
      <Helmet>
        <title>Create Account — FOSSEE Workshop Booking</title>
        <meta name="description" content="Register for the FOSSEE Workshop Booking Portal to propose or conduct workshops." />
        <meta property="og:title" content="Register — FOSSEE Workshop Booking" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-fossee-surface p-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="text-4xl font-bold text-fossee-primary mb-2 block">FOSSEE</Link>
            <h1 className="text-2xl font-semibold text-fossee-dark">Create Account</h1>

            {/* Step indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-fossee-primary w-8' : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-fossee-muted mt-2">Step {step} of 3</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Credentials */}
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-1">
                  <FormField label="Email" id="email" required error={errors.email}>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} placeholder="your@email.com" className={inputClass} />
                  </FormField>
                  <FormField label="Username" id="username" required error={errors.username}>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} onBlur={handleBlur} placeholder="Choose a username" className={inputClass} />
                  </FormField>
                  <FormField label="Password" id="password" required error={errors.password}>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} onBlur={handleBlur} placeholder="At least 8 characters" className={inputClass} />
                  </FormField>
                  {/* Password strength bar */}
                  {formData.password && (
                    <div className="px-1 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${strengthConfig.color}`}
                            style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'fair' ? '66%' : '100%' }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${strengthConfig.textColor}`}>{strengthConfig.label}</span>
                      </div>
                    </div>
                  )}
                  <FormField label="Confirm Password" id="confirm_password" required error={errors.confirm_password}>
                    <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} onBlur={handleBlur} placeholder="Re-enter password" className={inputClass} />
                  </FormField>
                </motion.div>
              )}

              {/* Step 2: Profile */}
              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-1">
                  <FormField label="Title" id="title" required error={errors.title}>
                    <select name="title" value={formData.title} onChange={handleInputChange} onBlur={handleBlur} className={inputClass}>
                      <option value="">Select title...</option>
                      {TITLES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="First Name" id="first_name" required error={errors.first_name}>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} onBlur={handleBlur} className={inputClass} />
                    </FormField>
                    <FormField label="Last Name" id="last_name">
                      <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className={inputClass} />
                    </FormField>
                  </div>
                  <FormField label="Institute" id="institute" required error={errors.institute}>
                    <input type="text" name="institute" value={formData.institute} onChange={handleInputChange} onBlur={handleBlur} className={inputClass} />
                  </FormField>
                  <FormField label="Department" id="department" required error={errors.department}>
                    <select name="department" value={formData.department} onChange={handleInputChange} onBlur={handleBlur} className={inputClass}>
                      <option value="">Select department...</option>
                      {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Phone Number" id="phone_number" required error={errors.phone_number} helperText="10-digit mobile number">
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} onBlur={handleBlur} className={inputClass} />
                  </FormField>

                  {/* Position — radio cards with icons */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-fossee-dark mb-2">Position</label>
                    <div className="grid grid-cols-2 gap-3">
                      {POSITIONS.map((pos) => (
                        <label
                          key={pos.value}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.position === pos.value
                              ? 'border-fossee-primary bg-blue-50'
                              : 'border-fossee-border hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="position"
                            value={pos.value}
                            checked={formData.position === pos.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          {pos.value === 'coordinator' ? <UserCircle size={20} className="text-fossee-primary" /> : <BookOpen size={20} className="text-fossee-accent" />}
                          <div>
                            <div className="text-sm font-semibold text-fossee-dark">{pos.label}</div>
                            <div className="text-xs text-fossee-muted">{pos.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location & T&C */}
              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-1">
                  <FormField label="City / Location" id="location" required>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="E.g. Mumbai" className={inputClass} />
                  </FormField>
                  <FormField label="State" id="state" required>
                    <select name="state" value={formData.state} onChange={handleInputChange} className={inputClass}>
                      <option value="">Select a state...</option>
                      {INDIAN_STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </FormField>

                  {/* Inline T&C */}
                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 max-h-[180px] overflow-y-auto border border-fossee-border">
                    <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                    <p className="text-xs mb-2">By registering, you agree to follow the FOSSEE Workshop guidelines and ethical standards. You must provide accurate information and will be responsible for maintaining the confidentiality of your account.</p>
                    <p className="text-xs">For more details, visit the workshop guidelines page.</p>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer py-2">
                    <input type="checkbox" required className="mt-1 accent-fossee-primary" />
                    <span className="text-sm text-fossee-dark">I agree to the Terms & Conditions</span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-4">
              {step > 1 && (
                <Button variant="secondary" onClick={() => setStep((prev) => prev - 1)} fullWidth disabled={loading} type="button">
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button variant="primary" onClick={handleNext} fullWidth disabled={loading} type="button">
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

          <div className="mt-4 text-center text-sm text-fossee-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-fossee-primary font-semibold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}

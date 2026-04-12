/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, BookOpen, CalendarDays, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import client from '../../api/client';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { dateFromNow } from '../../utils/formatDate';

export default function ProposeWorkshopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const preselectedType = location.state?.preselectedType || null;

  const [formData, setFormData] = useState({
    workshop_type: preselectedType,
    date: '',
    tnc_accepted: false,
  });

  useEffect(() => { if (preselectedType) setStep(2); }, [preselectedType]);

  const fetchTypes = useCallback(async () => {
    try {
      const res = await client.get('/workshop-types/');
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setWorkshopTypes(data);
    } catch {
      addToast('error', 'Failed to load workshop types');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

  const selectedType = workshopTypes.find((t) => t.id === formData.workshop_type);
  const minDate = dateFromNow(7);

  const handleSubmit = async () => {
    if (!formData.tnc_accepted) {
      addToast('error', 'Please accept the Terms & Conditions');
      return;
    }
    setSubmitting(true);
    try {
      await client.post('/workshops/propose/', {
        workshop_type: formData.workshop_type,
        proposed_workshop_date: formData.date,
        terms_accepted: formData.tnc_accepted,
      });

      // 🎉 Confetti celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#1A56DB', '#0E9F6E', '#E3A008'],
      });

      addToast('success', 'Workshop proposed successfully! 🎉');
      setTimeout(() => navigate('/my-workshops'), 2000);
    } catch (err) {
      addToast('error', err.response?.data?.error || 'Failed to propose workshop');
    } finally {
      setSubmitting(false);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <>
      <Helmet>
        <title>Propose Workshop — FOSSEE</title>
        <meta name="description" content="Propose a new workshop at your institution through the FOSSEE portal." />
      </Helmet>
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fossee-dark">
              Propose a Workshop
            </h1>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { num: 1, label: 'Choose Type' },
                { num: 2, label: 'Pick Date' },
                { num: 3, label: 'Confirm' },
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step >= s.num ? 'bg-fossee-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s.num ? <CheckCircle size={16} /> : s.num}
                    </div>
                    <span className={`text-sm font-medium hidden sm:inline ${step >= s.num ? 'text-fossee-dark' : 'text-fossee-muted'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-fossee-primary' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Workshop Type */}
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-fossee-dark mb-4">Choose Workshop Type</h2>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="card" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workshopTypes.map((type) => (
                      <button
                        key={type.id}
                        className={`text-left rounded-2xl border-2 p-5 transition-all ${
                          formData.workshop_type === type.id
                            ? 'border-fossee-primary bg-blue-50 shadow-hover'
                            : 'border-fossee-border bg-fossee-card hover:border-gray-300 hover:shadow-card'
                        }`}
                        onClick={() => setFormData((p) => ({ ...p, workshop_type: type.id }))}
                      >
                        <div className="flex items-start gap-3">
                          <BookOpen size={20} className="text-fossee-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-bold text-fossee-dark">{type.name}</h3>
                            {type.duration && <p className="text-xs text-fossee-muted mt-1">Duration: {type.duration}</p>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => formData.workshop_type ? setStep(2) : addToast('error', 'Please select a workshop type')}
                    disabled={!formData.workshop_type}
                  >
                    Next <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pick Date */}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-fossee-dark mb-2">Pick a Date</h2>
                <p className="text-sm text-fossee-muted mb-4">
                  Minimum 7 days from today. Selected type: <strong>{selectedType?.name}</strong>
                </p>

                <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 shadow-card">
                  <label htmlFor="propose-date" className="block text-sm font-medium text-fossee-dark mb-2">
                    <CalendarDays size={16} className="inline mr-1" /> Workshop Date
                  </label>
                  <input
                    id="propose-date"
                    type="date"
                    min={minDate}
                    value={formData.date}
                    onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                    className="w-full h-[52px] px-4 rounded-xl border-2 border-fossee-border focus:border-fossee-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button
                    variant="primary"
                    onClick={() => formData.date ? setStep(3) : addToast('error', 'Please pick a date')}
                    disabled={!formData.date}
                  >
                    Next <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-fossee-dark mb-4">Review & Confirm</h2>

                {/* Summary */}
                <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 shadow-card space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-fossee-muted">Workshop Type</span>
                    <span className="font-semibold text-fossee-dark">{selectedType?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fossee-muted">Date</span>
                    <span className="font-semibold text-fossee-dark">{formData.date}</span>
                  </div>
                  {selectedType?.duration && (
                    <div className="flex justify-between text-sm">
                      <span className="text-fossee-muted">Duration</span>
                      <span className="font-semibold text-fossee-dark">{selectedType.duration}</span>
                    </div>
                  )}
                </div>

                {/* Inline T&C */}
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 max-h-[160px] overflow-y-auto border border-fossee-border mb-3">
                  <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                  <p className="text-xs mb-1">• The workshop must be conducted on the proposed date.</p>
                  <p className="text-xs mb-1">• Cancellations must be communicated at least 48 hours in advance.</p>
                  <p className="text-xs mb-1">• Participants should be provided with all necessary resources.</p>
                  <p className="text-xs">• The coordinator is responsible for logistics and attendance tracking.</p>
                </div>

                <label className="flex items-start gap-2 cursor-pointer py-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.tnc_accepted}
                    onChange={(e) => setFormData((p) => ({ ...p, tnc_accepted: e.target.checked }))}
                    className="mt-0.5 accent-fossee-primary"
                    required
                  />
                  <span className="text-sm text-fossee-dark">
                    I accept the Terms & Conditions for conducting this workshop
                  </span>
                </label>

                <div className="flex gap-3 justify-end">
                  <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitting || !formData.tnc_accepted}
                  >
                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageWrapper>
    </>
  );
}

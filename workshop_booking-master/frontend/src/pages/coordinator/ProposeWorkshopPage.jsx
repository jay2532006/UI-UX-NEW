import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';

export default function ProposeWorkshopPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTncModal, setShowTncModal] = useState(false);
  
  const [formData, setFormData] = useState({
    workshop_type: null,
    date: '',
    tnc_accepted: false,
  });

  // Fetch workshop types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await client.get('/workshop-types/');
        setWorkshopTypes(response.data.results || []);
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Failed to load workshop types',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  // Calculate minimum date (today + 7 days)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const handleSelectType = (typeId) => {
    setFormData((prev) => ({ ...prev, workshop_type: typeId }));
    setStep(2);
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, date: e.target.value }));
  };

  const selectedType = workshopTypes.find((t) => t.id === formData.workshop_type);

  const handleProceedToTnc = () => {
    if (!formData.date) {
      setToast({
        type: 'error',
        message: 'Please select a date',
      });
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!formData.tnc_accepted) {
      setToast({
        type: 'error',
        message: 'Please accept the terms and conditions',
      });
      return;
    }

    setSubmitting(true);
    try {
      await client.post('/workshops/', {
        workshop_type: formData.workshop_type,
        date: formData.date,
        tnc_accepted: true,
      });
      setToast({
        type: 'success',
        message: 'Workshop proposed successfully!',
      });
      setTimeout(() => navigate('/my-workshops'), 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to propose workshop',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Propose a Workshop — FOSSEE Booking Portal</title>
        <meta name="description" content="Propose a new workshop with FOSSEE. Select workshop type, choose dates, and review terms and conditions." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">Propose a Workshop</h1>
          <p className="text-gray-600 text-sm mt-1">Step {step} of 3</p>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-fossee-blue h-1 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Workshop Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Workshop Type</h2>
            {loading ? (
              <Spinner />
            ) : (
              <div className="space-y-3">
                {workshopTypes.map((type) => (
                  <Card
                    key={type.id}
                    title={type.name}
                    subtitle={type.course_type || 'Workshop'}
                    onClick={() => handleSelectType(type.id)}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm text-gray-600 mt-2">{type.description}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && selectedType && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="mb-4"
            >
              ← Back to Types
            </Button>

            <h2 className="text-lg font-semibold">Selected: {selectedType.name}</h2>

            <Card className="bg-fossee-light">
              <p className="text-sm mb-3">{selectedType.description}</p>
            </Card>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Date
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                min={getMinDate()}
                className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 7 days from today
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                fullWidth
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleProceedToTnc}
                fullWidth
                disabled={!formData.date}
              >
                Review & Accept
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & T&C */}
        {step === 3 && selectedType && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setStep(2)}
              className="mb-4"
            >
              ← Back to Date
            </Button>

            <h2 className="text-lg font-semibold">Review & Accept T&C</h2>

            {/* Summary */}
            <Card className="bg-fossee-light">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Workshop Type:</span>
                  <span>{selectedType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Proposed Date:</span>
                  <span>{new Date(formData.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            {/* T&C Modal Preview */}
            <Card
              className="cursor-pointer hover:shadow-md"
              title="Terms & Conditions"
              onClick={() => setShowTncModal(true)}
            >
              <p className="text-sm text-gray-600 mt-2">
                Click to read the full terms and conditions
              </p>
            </Card>

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.tnc_accepted}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tnc_accepted: e.target.checked }))
                }
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                I have read and accept the terms and conditions above
              </span>
            </label>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep(2)}
                fullWidth
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                fullWidth
                disabled={submitting || !formData.tnc_accepted}
              >
                {submitting ? 'Proposing...' : 'Propose Workshop'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* T&C Modal */}
      <Modal
        isOpen={showTncModal}
        onClose={() => setShowTncModal(false)}
        title="Terms & Conditions"
      >
        <div className="text-sm text-gray-700 space-y-3 max-h-[400px] overflow-y-auto">
          <p>
            By proposing a workshop, you agree to adhere to the FOSSEE Workshop guidelines and policies.
          </p>
          <p>
            <strong>Coordination:</strong> You commit to coordinating the workshop effectively and communicating with the assigned instructor.
          </p>
          <p>
            <strong>Accuracy:</strong> All provided information must be accurate and truthful.
          </p>
          <p>
            <strong>Flexibility:</strong> You agree to be flexible with dates if necessary and to notify instructors promptly of any changes.
          </p>
          <p>
            <strong>Feedback:</strong> You will provide feedback after the workshop to help us improve future sessions.
          </p>
          <p className="text-xs text-gray-500">
            For the complete guidelines, visit the FOSSEE website.
          </p>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </PageWrapper>
    </>
  );
}

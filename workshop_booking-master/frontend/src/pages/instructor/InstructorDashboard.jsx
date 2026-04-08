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
import EmptyState from '../../components/ui/EmptyState';
import WorkshopCard from '../../components/workshop/WorkshopCard';
import { CheckCircle2, X } from 'lucide-react';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionModal, setActionModal] = useState({ show: false, action: null, workshopId: null });

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await client.get('/workshops/');
        setWorkshops(response.data.results || []);
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Failed to load workshops',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const pendingWorkshops = workshops.filter((w) => w.status === 0);
  const acceptedWorkshops = workshops.filter((w) => w.status === 1);

  const handleAccept = async () => {
    try {
      await client.post(`/workshops/${actionModal.workshopId}/accept/`);
      setWorkshops((prev) =>
        prev.map((w) =>
          w.id === actionModal.workshopId ? { ...w, status: 1 } : w
        )
      );
      setToast({
        type: 'success',
        message: 'Workshop accepted!',
      });
      setActionModal({ show: false, action: null, workshopId: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to accept workshop',
      });
    }
  };

  const handleReject = async () => {
    try {
      await client.post(`/workshops/${actionModal.workshopId}/reject/`);
      setWorkshops((prev) =>
        prev.map((w) =>
          w.id === actionModal.workshopId ? { ...w, status: 2 } : w
        )
      );
      setToast({
        type: 'success',
        message: 'Workshop rejected',
      });
      setActionModal({ show: false, action: null, workshopId: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to reject workshop',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Instructor Dashboard — FOSSEE Workshop Booking</title>
        <meta name="description" content="Manage workshop requests, accept or reject proposals, and view upcoming workshops scheduled for instruction." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Review and manage workshop requests</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Pending Requests - MOST URGENT */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {pendingWorkshops.length}
                  </span>
                  Pending Requests
                </h2>
                <p className="text-sm text-gray-600 mt-1">Workshops waiting for your approval</p>
              </div>

              {pendingWorkshops.length === 0 ? (
                <EmptyState
                  message="No pending workshop requests"
                  Icon="✅"
                />
              ) : (
                <div className="space-y-3">
                  {pendingWorkshops.map((workshop) => (
                    <Card
                      key={workshop.id}
                      title={workshop.workshop_type?.name || 'Workshop'}
                      subtitle={`Proposed by ${workshop.coordinator?.first_name}`}
                    >
                      <div className="space-y-3 mt-3">
                        <div className="text-sm text-gray-600">
                          <p>
                            <strong>Proposed Date:</strong> {new Date(workshop.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Institute:</strong> {workshop.coordinator?.profile?.institute}
                          </p>
                          <p>
                            <strong>Contact:</strong> {workshop.coordinator?.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={() =>
                              setActionModal({
                                show: true,
                                action: 'accept',
                                workshopId: workshop.id,
                              })
                            }
                            className="flex-1 flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={16} /> Accept
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              setActionModal({
                                show: true,
                                action: 'reject',
                                workshopId: workshop.id,
                              })
                            }
                            className="flex-1 flex items-center justify-center gap-1"
                          >
                            <X size={16} /> Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Workshops */}
            <div className="space-y-4 border-t pt-6">
              <div>
                <h2 className="text-xl font-semibold">Upcoming Workshops ({acceptedWorkshops.length})</h2>
                <p className="text-sm text-gray-600 mt-1">Workshops you have accepted</p>
              </div>

              {acceptedWorkshops.length === 0 ? (
                <EmptyState message="No accepted workshops yet" Icon="📅" />
              ) : (
                <div className="space-y-3">
                  {acceptedWorkshops.map((workshop) => (
                    <WorkshopCard
                      key={workshop.id}
                      workshop={workshop}
                      onTap={() => navigate(`/instructor/workshops/${workshop.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirm Action Modal */}
      <Modal
        isOpen={actionModal.show}
        onClose={() => setActionModal({ show: false, action: null, workshopId: null })}
        title={actionModal.action === 'accept' ? 'Accept Workshop?' : 'Reject Workshop?'}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {actionModal.action === 'accept'
              ? 'You will be assigned as the instructor for this workshop.'
              : 'The coordinator will be notified of the rejection.'}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setActionModal({ show: false, action: null, workshopId: null })}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant={actionModal.action === 'accept' ? 'primary' : 'danger'}
              onClick={actionModal.action === 'accept' ? handleAccept : handleReject}
              fullWidth
            >
              {actionModal.action === 'accept' ? 'Accept' : 'Reject'}
            </Button>
          </div>
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

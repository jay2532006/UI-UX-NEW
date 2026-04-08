import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import WorkshopStatusBadge from '../../components/workshop/WorkshopStatusBadge';
import CommentThread from '../../components/workshop/CommentThread';
import { Trash2, Calendar } from 'lucide-react';

export default function WorkshopManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showChangeDate, setShowChangeDate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await client.get(`/workshops/${id}/`);
        setWorkshop(response.data);
        setNewDate(response.data.date);
        // Fetch comments if endpoint exists
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Failed to load workshop details',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [id]);

  const handleChangeDate = async () => {
    if (!newDate) {
      setToast({ type: 'error', message: 'Please select a date' });
      return;
    }
    try {
      const response = await client.post(`/workshops/${id}/change-date/`, {
        date: newDate,
      });
      setWorkshop(response.data);
      setShowChangeDate(false);
      setToast({
        type: 'success',
        message: 'Workshop date updated',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to update date',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await client.delete(`/workshops/${id}/`);
      setToast({
        type: 'success',
        message: 'Workshop deleted',
      });
      setTimeout(() => navigate('/instructor/dashboard'), 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to delete workshop',
      });
    }
    setShowDeleteModal(false);
  };

  const handleAddComment = async (text) => {
    try {
      await client.post(`/workshops/${id}/comments/`, { text });
      setToast({
        type: 'success',
        message: 'Comment added',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to add comment',
      });
    }
  };

  if (loading) return <PageWrapper><Spinner /></PageWrapper>;
  if (!workshop) return <PageWrapper><div className="text-center py-12">Workshop not found</div></PageWrapper>;

  return (
    <>
      <Helmet>
        <title>Manage Workshop — FOSSEE Portal</title>
        <meta name="description" content="Update workshop details, change dates, manage comments, and coordinate with workshop coordinators." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="mt-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{workshop.workshop_type?.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <WorkshopStatusBadge status={workshop.status} />
            <span className="text-sm text-gray-600">{workshop.id}</span>
          </div>
        </div>

        {/* Workshop Details */}
        <Card className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Date</p>
              <p className="font-semibold">{new Date(workshop.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Coordinator</p>
              <p className="font-semibold">{workshop.coordinator?.first_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Institute</p>
              <p className="text-sm">{workshop.coordinator?.profile?.institute}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <p className="text-sm">{['PENDING', 'ACCEPTED', 'REJECTED', 'DELETED'][workshop.status]}</p>
            </div>
          </div>

          {workshop.workshop_type?.description && (
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 uppercase mb-2">Description</p>
              <p className="text-sm text-gray-700">{workshop.workshop_type.description}</p>
            </div>
          )}
        </Card>

        {/* Actions - Only if Accepted */}
        {workshop.status === 1 && (
          <div className="space-y-3">
            <Button
              variant="secondary"
              onClick={() => setShowChangeDate(true)}
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <Calendar size={16} /> Change Date
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Delete Workshop
            </Button>
          </div>
        )}

        {/* Comments Section */}
        <CommentThread
          comments={comments}
          canComment={workshop.status === 1}
          onAddComment={handleAddComment}
        />
      </div>

      {/* Change Date Modal */}
      <Modal
        isOpen={showChangeDate}
        onClose={() => setShowChangeDate(false)}
        title="Change Workshop Date"
      >
        <div className="space-y-4">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowChangeDate(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleChangeDate}
              fullWidth
            >
              Update Date
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Workshop?"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this workshop? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              fullWidth
            >
              Delete
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

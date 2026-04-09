import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import client from '../../api/client';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import WorkshopStatusBadge from '../../components/workshop/WorkshopStatusBadge';
import CommentThread from '../../components/workshop/CommentThread';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import { CalendarDays, User, Building2, MapPin } from 'lucide-react';

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await client.get(`/workshops/${id}/`);
        setWorkshop(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        setToast({
          type: 'error',
          message: error.response?.status === 404
            ? 'Workshop not found'
            : 'Failed to load workshop details',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [id]);

  const handleAddComment = async (text) => {
    try {
      const response = await client.post(`/workshops/${id}/comments/`, {
        comment: text,
      });
      setComments((prev) => [...prev, response.data]);
      setToast({ type: 'success', message: 'Comment added' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to add comment' });
    }
  };

  const workshopType = workshop?.workshop_type_detail;
  const wsName = workshopType?.name || 'Workshop';

  return (
    <>
      <Helmet>
        <title>{wsName ? `${wsName} — FOSSEE Workshop` : 'Workshop Details — FOSSEE'}</title>
        <meta name="description" content="View detailed information about this workshop including schedule, instructor, and registration details." />
      </Helmet>
      <PageWrapper>
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          {/* Back */}
          <div className="mt-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
              ← Back
            </Button>
          </div>

          {loading ? (
            <Spinner />
          ) : !workshop ? (
            <Card>
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg font-medium">Workshop not found</p>
                <p className="text-sm mt-1">This workshop may have been removed or the link is invalid.</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">{wsName}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <WorkshopStatusBadge status={workshop.status} />
                  {workshop.uid && (
                    <span className="text-xs text-gray-400 font-mono">#{workshop.uid}</span>
                  )}
                </div>
              </div>

              {/* Key Details */}
              <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3">
                    <CalendarDays size={20} className="text-fossee-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Scheduled Date</p>
                      <p className="font-semibold">
                        {new Date(workshop.date).toLocaleDateString('en-IN', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User size={20} className="text-fossee-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Coordinator</p>
                      <p className="font-semibold">{workshop.coordinator_name || '—'}</p>
                      {workshop.coordinator_email && (
                        <a
                          href={`mailto:${workshop.coordinator_email}`}
                          className="text-sm text-fossee-blue hover:underline"
                        >
                          {workshop.coordinator_email}
                        </a>
                      )}
                    </div>
                  </div>

                  {workshop.instructor_name && (
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Instructor</p>
                        <p className="font-semibold">{workshop.instructor_name}</p>
                      </div>
                    </div>
                  )}

                  {workshopType?.duration && (
                    <div className="flex items-start gap-3">
                      <CalendarDays size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                        <p className="font-semibold">{workshopType.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Workshop Type Description */}
              {workshopType?.description && (
                <Card title="About This Workshop">
                  <p className="text-gray-700 mt-3 leading-relaxed">{workshopType.description}</p>
                </Card>
              )}

              {/* Terms & Conditions */}
              {workshopType?.terms_and_conditions && (
                <Card title="Terms & Conditions">
                  <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-line">
                    {workshopType.terms_and_conditions}
                  </p>
                </Card>
              )}

              {/* Attachments */}
              {workshopType?.attachments?.length > 0 && (
                <Card title="Attachments">
                  <ul className="mt-3 space-y-2">
                    {workshopType.attachments.map((att) => (
                      <li key={att.id}>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fossee-blue hover:underline text-sm flex items-center gap-1"
                        >
                          📎 Attachment {att.id}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Instructor: manage actions */}
              {role === 'instructor' && (
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/instructor/workshops/${id}`)}
                    fullWidth
                  >
                    Manage Workshop
                  </Button>
                </div>
              )}

              {/* Comments */}
              <CommentThread
                comments={comments}
                canComment={workshop.status === 1}
                onAddComment={handleAddComment}
              />
            </>
          )}
        </div>

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

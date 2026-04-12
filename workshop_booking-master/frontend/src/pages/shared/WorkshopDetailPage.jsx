/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Building2, UserCircle, MessageSquare, Send, Lock } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import WorkshopTimeline from '../../components/workshop/WorkshopTimeline';
import WorkshopStatusBadge from '../../components/workshop/WorkshopStatusBadge';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { formatDateLong } from '../../utils/formatDate';
import client from '../../api/client';

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const { addToast } = useToast();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const fetchWorkshop = useCallback(async () => {
    try {
      const res = await client.get(`/workshops/${id}/`);
      setWorkshop(res.data);
    } catch {
      addToast('error', 'Failed to load workshop details');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => { fetchWorkshop(); }, [fetchWorkshop]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await client.post(`/workshops/${id}/comments/`, { comment: comment.trim() });
      setComment('');
      addToast('success', 'Comment posted');
      fetchWorkshop();
    } catch {
      addToast('error', 'Failed to post comment');
    } finally {
      setSending(false);
    }
  };

  const typeName = workshop?.workshop_type?.name || workshop?.workshop_type_detail?.name || 'Workshop';

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-4">
          <Skeleton variant="text" lines={2} />
          <Skeleton variant="card" />
          <Skeleton variant="text" lines={4} />
        </div>
      </PageWrapper>
    );
  }

  if (!workshop) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 text-center text-fossee-muted">
          Workshop not found.
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <Helmet>
        <title>{typeName} — Workshop Detail — FOSSEE</title>
        <meta name="description" content={`Workshop details for ${typeName}`} />
      </Helmet>
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fossee-dark">
                  {typeName}
                </h1>
                <p className="text-fossee-muted text-sm mt-1">Workshop #{workshop.id}</p>
              </div>
              <WorkshopStatusBadge status={workshop.status} />
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <WorkshopTimeline status={workshop.status} />
            </div>

            {/* Content Grid: Main + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Details Card */}
                <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 md:p-6 shadow-card space-y-4">
                  <h2 className="text-lg font-bold text-fossee-dark">Workshop Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays size={18} className="text-fossee-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-fossee-dark">Date</p>
                        <p className="text-sm text-fossee-muted">{formatDateLong(workshop.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-fossee-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-fossee-dark">Location</p>
                        <p className="text-sm text-fossee-muted">{workshop.coordinator?.profile?.state || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="text-fossee-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-fossee-dark">Institute</p>
                        <p className="text-sm text-fossee-muted">{workshop.coordinator?.profile?.institute || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <UserCircle size={18} className="text-fossee-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-fossee-dark">Coordinator</p>
                        <p className="text-sm text-fossee-muted">
                          {workshop.coordinator?.first_name} {workshop.coordinator?.last_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 md:p-6 shadow-card">
                  <h2 className="text-lg font-bold text-fossee-dark mb-4 flex items-center gap-2">
                    <MessageSquare size={18} /> Comments
                  </h2>

                  {/* Comment list */}
                  <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                    {workshop.comments && workshop.comments.length > 0 ? (
                      workshop.comments.map((c, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-fossee-primary/10 text-fossee-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {c.author?.first_name?.[0] || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-fossee-dark">
                                {c.author?.first_name || 'User'}
                              </span>
                              {c.is_private && (
                                <span className="inline-flex items-center gap-0.5 text-xs text-amber-700" title="Private comment">
                                  <Lock size={10} /> Private
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{c.comment || c.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-fossee-muted text-center py-4">No comments yet.</p>
                    )}
                  </div>

                  {/* Comment form */}
                  <form onSubmit={handleComment} className="flex gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 h-10 px-4 rounded-xl border border-fossee-border focus:border-fossee-primary focus:outline-none text-sm"
                      disabled={sending}
                    />
                    <Button type="submit" variant="primary" disabled={sending || !comment.trim()} className="px-4">
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              </div>

              {/* Sidebar (1/3) */}
              <div className="space-y-4">
                {/* Workshop Type Info */}
                <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 shadow-card">
                  <h3 className="text-sm font-bold text-fossee-dark mb-2">Workshop Type</h3>
                  <p className="text-lg font-bold text-fossee-primary">{typeName}</p>
                  {workshop.workshop_type?.duration && (
                    <p className="text-sm text-fossee-muted mt-1">Duration: {workshop.workshop_type.duration}</p>
                  )}
                </div>

                {/* Instructor Info */}
                {workshop.instructor && (
                  <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 shadow-card">
                    <h3 className="text-sm font-bold text-fossee-dark mb-2">Instructor</h3>
                    <p className="font-semibold text-fossee-dark">
                      {workshop.instructor?.first_name} {workshop.instructor?.last_name}
                    </p>
                    <p className="text-sm text-fossee-muted">{workshop.instructor?.email}</p>
                  </div>
                )}

                {/* Quick Actions for Instructor */}
                {role === 'instructor' && workshop.status === 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card space-y-2">
                    <h3 className="text-sm font-bold text-amber-900">Action Required</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={async () => {
                          try {
                            await client.post(`/workshops/${id}/accept/`);
                            addToast('success', 'Workshop accepted!');
                            fetchWorkshop();
                          } catch { addToast('error', 'Failed to accept'); }
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={async () => {
                          try {
                            await client.post(`/workshops/${id}/reject/`);
                            addToast('success', 'Workshop rejected');
                            fetchWorkshop();
                          } catch { addToast('error', 'Failed to reject'); }
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </>
  );
}

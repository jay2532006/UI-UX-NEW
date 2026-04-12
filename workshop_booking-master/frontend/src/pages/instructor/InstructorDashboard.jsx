/* eslint-disable */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, CalendarDays } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/stats/StatCard';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import WorkshopStatusBadge from '../../components/workshop/WorkshopStatusBadge';
import { formatDate } from '../../utils/formatDate';
import { STATUS_CODES } from '../../utils/constants';
import client from '../../api/client';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null); // { id, action }

  const fetchWorkshops = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.get('/workshops/instructor/');
      setWorkshops(res.data);
    } catch {
      addToast('error', 'Failed to load workshops');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchWorkshops(); }, [fetchWorkshops]);

  const stats = useMemo(() => ({
    total: workshops.length,
    pending: workshops.filter((w) => w.status === STATUS_CODES.PENDING).length,
    accepted: workshops.filter((w) => w.status === STATUS_CODES.ACCEPTED).length,
    rejected: workshops.filter((w) => w.status === STATUS_CODES.REJECTED).length,
  }), [workshops]);

  const pendingWorkshops = useMemo(() =>
    workshops.filter((w) => w.status === STATUS_CODES.PENDING), [workshops]);
  const otherWorkshops = useMemo(() =>
    workshops.filter((w) => w.status !== STATUS_CODES.PENDING), [workshops]);

  const handleAction = async (workshopId, action) => {
    try {
      await client.post(`/workshops/${workshopId}/${action}/`);
      addToast('success', `Workshop ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
      setConfirmAction(null);
      fetchWorkshops();
    } catch {
      addToast('error', `Failed to ${action} workshop`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Instructor Dashboard — FOSSEE Workshop Booking</title>
        <meta name="description" content="Manage workshop requests. Accept or reject proposals from coordinators." />
      </Helmet>
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-fossee-accent">Instructor</p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fossee-dark mt-1">
              Hello, {user?.first_name || 'Instructor'} 👨‍🏫
            </h1>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total" value={stats.total} color="text-fossee-primary" bgColor="bg-white" />
            <StatCard label="Pending" value={stats.pending} color="text-amber-600" bgColor="bg-amber-50/50" />
            <StatCard label="Accepted" value={stats.accepted} color="text-fossee-secondary" bgColor="bg-green-50/50" />
            <StatCard label="Rejected" value={stats.rejected} color="text-red-600" bgColor="bg-red-50/50" />
          </div>

          {/* Pending Requests — Action Required */}
          {pendingWorkshops.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-fossee-dark mb-4">
                ⏳ Pending Requests ({pendingWorkshops.length})
              </h2>
              <div className="space-y-3">
                {pendingWorkshops.map((ws) => (
                  <motion.div
                    key={ws.id}
                    layout
                    className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 md:p-5 shadow-card"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-fossee-dark truncate">
                          {ws.workshop_type?.name || ws.workshop_type_detail?.name || 'Workshop'}
                        </h3>
                        <p className="text-sm text-fossee-muted">
                          {ws.coordinator?.first_name || 'Coordinator'} · {formatDate(ws.date)}
                        </p>
                      </div>
                      <WorkshopStatusBadge status={ws.status} />
                    </div>

                    {/* Inline confirmation or action buttons */}
                    <AnimatePresence mode="wait">
                      {confirmAction?.id === ws.id ? (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 mt-2 p-3 bg-white rounded-xl border border-fossee-border"
                        >
                          <span className="text-sm text-fossee-dark font-medium flex-1">
                            {confirmAction.action === 'accept' ? 'Accept this workshop?' : 'Reject this workshop?'}
                          </span>
                          <Button variant="primary" onClick={() => handleAction(ws.id, confirmAction.action)} className="text-xs px-3 py-1.5">
                            Yes
                          </Button>
                          <Button variant="ghost" onClick={() => setConfirmAction(null)} className="text-xs px-3 py-1.5">
                            Cancel
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div key="actions" className="flex gap-2 mt-2">
                          <Button variant="primary" onClick={() => setConfirmAction({ id: ws.id, action: 'accept' })} className="flex-1 text-sm">
                            <Check size={16} className="mr-1" /> Accept
                          </Button>
                          <Button variant="danger" onClick={() => setConfirmAction({ id: ws.id, action: 'reject' })} className="flex-1 text-sm">
                            <X size={16} className="mr-1" /> Reject
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Other workshops */}
          <section>
            <h2 className="text-xl font-bold text-fossee-dark mb-4">All Workshops</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="workshop-card" />)}
              </div>
            ) : otherWorkshops.length === 0 && pendingWorkshops.length === 0 ? (
              <div className="text-center py-12 text-fossee-muted">No workshops assigned yet.</div>
            ) : (
              <div className="space-y-3">
                {otherWorkshops.map((ws) => (
                  <div
                    key={ws.id}
                    className="rounded-2xl border border-fossee-border bg-fossee-card p-4 md:p-5 shadow-card hover:shadow-hover transition-all cursor-pointer"
                    onClick={() => navigate(`/workshop/${ws.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/workshop/${ws.id}`); }}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-fossee-dark truncate">
                          {ws.workshop_type?.name || ws.workshop_type_detail?.name || 'Workshop'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-fossee-muted mt-1">
                          <CalendarDays size={14} /> {formatDate(ws.date)}
                        </div>
                      </div>
                      <WorkshopStatusBadge status={ws.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </PageWrapper>
    </>
  );
}

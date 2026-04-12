import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import client from '../../api/client';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Toast from '../../components/ui/Toast';
import { BookOpen, ChevronRight, Clock, Search } from 'lucide-react';

export default function WorkshopTypesPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTypes = useCallback(async (url = '/workshop-types/') => {
    try {
      const response = await client.get(url);
      const data = response.data;
      const results = Array.isArray(data) ? data : (data.results || []);
      if (url === '/workshop-types/') {
        setWorkshopTypes(results);
      } else {
        setWorkshopTypes((prev) => [...prev, ...results]);
      }
      setNextPage(data.next || null);
    } catch {
      setToast({
        type: 'error',
        message: 'Failed to load workshop types',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleLoadMore = () => {
    if (!nextPage) return;
    setLoadingMore(true);
    // Extract relative path from absolute URL
    const url = nextPage.replace(window.location.origin, '').replace('/api', '');
    fetchTypes(url);
  };

  const filtered = workshopTypes.filter((type) =>
    searchQuery === '' ||
    type.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Workshop Types — FOSSEE Workshop Booking</title>
        <meta
          name="description"
          content="Browse all workshop types offered by FOSSEE. Find workshops on Python, Scilab, OpenFOAM, and more open-source tools."
        />
      </Helmet>
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-gray-900">Workshop Types</h1>
            <p className="text-gray-600 text-sm mt-1">
              Browse available workshops offered by FOSSEE
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search workshop types…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[44px] pl-10 pr-4 rounded-xl border-2 border-gray-300 focus:border-fossee-blue focus:outline-none transition-colors"
              aria-label="Search workshop types"
            />
          </div>

          {/* List */}
          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState
              Icon={searchQuery ? Search : BookOpen}
              message={searchQuery ? `No results for "${searchQuery}"` : 'No workshop types available yet'}
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((type) => (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() =>
                    role === 'coordinator'
                      ? navigate('/propose', { state: { preselectedType: type.id } })
                      : undefined
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-fossee-blue transition-colors">
                        {type.name}
                      </h2>

                      {type.duration && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{type.duration}</span>
                        </div>
                      )}

                      {type.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {type.description}
                        </p>
                      )}

                      {/* Attachments */}
                      {type.attachments?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {type.attachments.map((att) => (
                            <a
                              key={att.id}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-fossee-blue hover:underline flex items-center gap-1"
                            >
                              📎 Resource {att.id}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {role === 'coordinator' && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-1 text-sm text-fossee-blue font-medium group-hover:gap-2 transition-all">
                          Propose
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {/* Load More */}
              {nextPage && !searchQuery && (
                <div className="text-center pt-2">
                  <Button
                    variant="secondary"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* CTA for Coordinators */}
          {role === 'coordinator' && workshopTypes.length > 0 && (
            <div className="border-t pt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/propose')}
              >
                + Propose a Workshop
              </Button>
            </div>
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

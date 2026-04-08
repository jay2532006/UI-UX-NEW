import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import client from '../../api/client';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    title: '',
    institute: '',
    department: '',
    phone_number: '',
    location: '',
    state: '',
  });

  useEffect(() => {
    if (user) {
      const { profile } = user;
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        title: profile?.title || '',
        institute: profile?.institute || '',
        department: profile?.department || '',
        phone_number: profile?.phone_number || '',
        location: profile?.location || '',
        state: profile?.state || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await client.put('/profile/', formData);
      setToast({
        type: 'success',
        message: 'Profile updated successfully!',
      });
      setEditMode(false);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <PageWrapper><Spinner /></PageWrapper>;

  return (
    <>
      <Helmet>
        <title>My Profile — FOSSEE Workshop Booking</title>
        <meta name="description" content="View and edit your profile information including name, institute, department, and role." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        </div>

        {/* Avatar & Role */}
        <Card className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-fossee-blue text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.full_name}</h2>
            <Badge variant={user?.role === 'instructor' ? 'success' : 'default'} className="mt-2">
              {user?.role === 'instructor' ? '👨‍🏫 Instructor' : '📋 Coordinator'}
            </Badge>
          </div>
        </Card>

        {/* Profile Information */}
        <Card title="Basic Information">
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {editMode ? (
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  disabled
                />
              ) : (
                <p className="text-gray-900">{user?.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {editMode ? (
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{user?.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {editMode ? (
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{user?.last_name}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Institution Information */}
        <Card title="Institution Details">
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="institute" className="block text-sm font-medium text-gray-700 mb-1">
                Institute
              </label>
              {editMode ? (
                <input
                  id="institute"
                  type="text"
                  name="institute"
                  value={formData.institute}
                  onChange={handleInputChange}
                  className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{user?.profile?.institute || '-'}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                {editMode ? (
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{user?.profile?.department || '-'}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                {editMode ? (
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{user?.profile?.state || '-'}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {editMode ? (
                <input
                  id="phone_number"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full h-[44px] px-3 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{user?.profile?.phone_number || '-'}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!editMode ? (
            <Button
              variant="primary"
              onClick={() => setEditMode(true)}
              fullWidth
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setEditMode(false)}
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                fullWidth
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

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

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

export default function WorkshopDetailPage() {
  const { id } = useParams();
  
  return (
    <>
      <Helmet>
        <title>Workshop Details — FOSSEE Workshop Booking</title>
        <meta name="description" content="View detailed information about a workshop including schedule, instructor, and registration details." />
      </Helmet>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Workshop Detail Page - placeholder (ID: {id})</h1>
        <p className="text-gray-600">Workshop details, status, coordinator, instructor, comments, and attachments will be built in Phase 6</p>
      </div>
    </>
  );
}

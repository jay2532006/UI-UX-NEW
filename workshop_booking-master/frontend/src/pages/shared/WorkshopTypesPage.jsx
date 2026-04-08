import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function WorkshopTypesPage() {
  return (
    <>
      <Helmet>
        <title>Workshop Types — FOSSEE Portal</title>
        <meta name="description" content="Browse available workshop types offered by FOSSEE. Find workshops matching your interests." />
      </Helmet>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Workshop Types Page - placeholder</h1>
        <p className="text-gray-600">Browse and filter workshop types will be built in Phase 5</p>
      </div>
    </>
  );
}

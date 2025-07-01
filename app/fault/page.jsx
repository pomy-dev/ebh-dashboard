'use client';

import React from 'react';
import FaultsList from '@/components/fault/FaultList';

const Faults = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Queries Reported</h1>
      </div>
      <FaultsList />
    </div>
  );
};

export default Faults;

import React from 'react';
import FaultsList from '../../components/fault/FaultList';
import { faults } from '../../utils/mockData';

const Faults = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Queries Reported</h1>
      </div>
      <FaultsList faults={faults} />
    </div>
  );
};

export default Faults;
import React from 'react';
import TenantsList from '@/components/tenants/TenantsList';
import { tenants } from '@/utils/mockData';

const Tenants = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Tenant
        </button>
      </div>
      <TenantsList tenants={tenants} />
    </div>
  );
};

export default Tenants;
"use client";

import React, { useState } from 'react';
import TenantsList from '@/components/tenants/TenantsList';
import TenantForm from '@/components/tenants/TenantForm';
import { tenants as initialTenants, properties } from '@/utils/mockData';
import { Tenant } from '@/types';

const Tenants = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Get unique property names for the form
  const propertyNames = properties.map(property => property.name);

  const handleAddTenant = (formData: any) => {
    const newTenant: Tenant = {
      id: (tenants.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      propertyName: formData.propertyName,
      unit: formData.unit,
      monthlyRent: formData.monthlyRent,
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      status: formData.status,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      },
      paymentHistory: {
        totalPaid: 0,
        lastPayment: new Date().toISOString().split('T')[0],
        outstandingBalance: 0
      }
    };

    setTenants(prev => [...prev, newTenant]);
  };

  const handleEditTenant = (formData: any) => {
    setTenants(prev => prev.map(tenant =>
      tenant.id === editingTenant?.id
        ? {
          ...tenant,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          propertyName: formData.propertyName,
          unit: formData.unit,
          monthlyRent: formData.monthlyRent,
          leaseStart: formData.leaseStart,
          leaseEnd: formData.leaseEnd,
          status: formData.status,
          emergencyContact: {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
            relationship: formData.emergencyContactRelationship
          }
        }
        : tenant
    ));
  };

  const handleFormSubmit = (formData: any) => {
    if (editingTenant) {
      handleEditTenant(formData);
    } else {
      handleAddTenant(formData);
    }
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  const handleEditClick = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
        <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Tenant
        </button>
      </div>
      <TenantsList tenants={tenants} onEditTenant={handleEditClick} />

      <TenantForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        tenant={editingTenant}
        properties={propertyNames}
      />
    </div>
  );
};

export default Tenants;
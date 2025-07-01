"use client";

import React, { useState, useEffect } from 'react';
import TenantsList from '@/components/tenants/TenantsList';
import TenantForm from '@/components/tenants/TenantForm';
import { getAllTenants, insertTenant, updateTenant, deleteTenant } from '@/services/tenantsService';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const { data, error } = await getAllTenants();
    if (error) {
      console.error('Error fetching tenants:', error);
    } else {
      setTenants(data);
    }
  };

  const handleAddTenant = async (formData) => {
    const { error } = await insertTenant(formData);
    if (!error) fetchTenants();
  };

  const handleUpdateTenant = async (formData) => {
    const { error } = await updateTenant(editingTenant.id, formData);
    if (!error) fetchTenants();
  };

  const handleDeleteTenant = async (tenantId) => {
    const confirmed = confirm("Are you sure you want to delete this tenant?");
    if (!confirmed) return;
    const { error } = await deleteTenant(tenantId);
    if (!error) fetchTenants();
  };

  const handleFormSubmit = async (formData) => {
    if (editingTenant) {
      await handleUpdateTenant(formData);
    } else {
      await handleAddTenant(formData);
    }
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  const handleEditClick = (tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Tenant
        </button>
      </div>

      <TenantsList
        tenants={tenants}
        onEditTenant={handleEditClick}
        onDeleteTenant={handleDeleteTenant}
      />

      <TenantForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTenant(null);
        }}
        onSubmit={handleFormSubmit}
        tenant={editingTenant}
      />
    </div>
  );
};

export default Tenants;

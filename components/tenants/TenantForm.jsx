"use client";

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { getUsers, getAllProperties } from '@/services/tenantsService';

const TenantForm = ({ isOpen, onClose, onSubmit, tenant }) => {
  const [userFilter, setUserFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    property_id: '',
    unit_number: '',
    monthly_rent: 0,
    lease_start_date: '',
    lease_end_date: '',
    emergency_name: '',
    emergency_phone: '',
    relationship: ''
  });

  useEffect(() => {
    if (tenant && isOpen) {
      setFormData({
        user_id: tenant.user_id || '',
        property_id: tenant.property_id || '',
        unit_number: tenant.unit_number,
        monthly_rent: tenant.monthly_rent,
        lease_start_date: tenant.lease_start_date,
        lease_end_date: tenant.lease_end_date,
        emergency_name: tenant.emergency_name,
        emergency_phone: tenant.emergency_phone,
        relationship: tenant.relationship
      });
    }
  }, [tenant, isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      const usersResult = await getUsers(userFilter);
      const propertiesResult = await getAllProperties(propertyFilter);
      setUsers(usersResult);
      setProperties(propertiesResult);
    };
    fetchData();
  }, [userFilter, propertyFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'monthly_rent' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {tenant ? 'Edit Tenant' : 'Add New Tenant'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Filter Users</label>
              <input type="text" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="w-full px-4 py-2 border rounded text-black" placeholder="Search user..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User</label>
              <select name="user_id" value={formData.user_id} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black">
                <option value="">Select User</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Filter Properties</label>
              <input type="text" value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="w-full px-4 py-2 border rounded text-black" placeholder="Search property..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property</label>
              <select name="property_id" value={formData.property_id} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black">
                <option value="">Select Property</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.property_name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Unit Number</label>
              <input type="text" name="unit_number" value={formData.unit_number} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
              <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lease Start Date</label>
              <input type="date" name="lease_start_date" value={formData.lease_start_date} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lease End Date</label>
              <input type="date" name="lease_end_date" value={formData.lease_end_date} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
              <input type="text" name="emergency_name" value={formData.emergency_name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
              <input type="tel" name="emergency_phone" value={formData.emergency_phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship</label>
              <input type="text" name="relationship" value={formData.relationship} onChange={handleInputChange} className="w-full px-4 py-2 border rounded text-black" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {tenant ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;

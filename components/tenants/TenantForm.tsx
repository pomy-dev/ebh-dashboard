'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, DollarSign, UserPlus } from 'lucide-react';
import { Tenant } from '@/types';

interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  unit: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'pending' | 'expired';
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
  tenant?: Tenant | null;
  properties: string[];
}

const TenantForm: React.FC<TenantFormProps> = ({ isOpen, onClose, onSubmit, tenant, properties }) => {
  const [formData, setFormData] = useState<TenantFormData>({
    name: tenant?.name || '',
    email: tenant?.email || '',
    phone: tenant?.phone || '',
    propertyName: tenant?.propertyName || '',
    unit: tenant?.unit || '',
    monthlyRent: tenant?.monthlyRent || 0,
    leaseStart: tenant?.leaseStart || '',
    leaseEnd: tenant?.leaseEnd || '',
    status: tenant?.status || 'active',
    emergencyContactName: tenant?.emergencyContact.name || '',
    emergencyContactPhone: tenant?.emergencyContact.phone || '',
    emergencyContactRelationship: tenant?.emergencyContact.relationship || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({});

  React.useEffect(() => {
    if (tenant && isOpen) {
      setFormData({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        propertyName: tenant.propertyName,
        unit: tenant.unit,
        monthlyRent: tenant.monthlyRent,
        leaseStart: tenant.leaseStart,
        leaseEnd: tenant.leaseEnd,
        status: tenant.status,
        emergencyContactName: tenant.emergencyContact.name,
        emergencyContactPhone: tenant.emergencyContact.phone,
        emergencyContactRelationship: tenant.emergencyContact.relationship
      });
    } else if (!tenant && isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyName: '',
        unit: '',
        monthlyRent: 0,
        leaseStart: '',
        leaseEnd: '',
        status: 'active',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
      });
    }
    setErrors({});
  }, [tenant, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyRent' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof TenantFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TenantFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.propertyName) newErrors.propertyName = 'Property is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (formData.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent must be greater than 0';
    if (!formData.leaseStart) newErrors.leaseStart = 'Lease start date is required';
    if (!formData.leaseEnd) newErrors.leaseEnd = 'Lease end date is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    if (!formData.emergencyContactRelationship.trim()) newErrors.emergencyContactRelationship = 'Emergency contact relationship is required';

    // Validate lease dates
    if (formData.leaseStart && formData.leaseEnd) {
      const startDate = new Date(formData.leaseStart);
      const endDate = new Date(formData.leaseEnd);
      if (endDate <= startDate) {
        newErrors.leaseEnd = 'Lease end date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {tenant ? 'Edit Tenant' : 'Add New Tenant'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="john.doe@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border placeholder:text-gray-300 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Assignment */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Property Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property *
                </label>
                <select
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.propertyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select a property</option>
                  {properties.map(property => (
                    <option key={property} value={property}>{property}</option>
                  ))}
                </select>
                {errors.propertyName && <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Number *
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.unit ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="12B"
                />
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>
            </div>
          </div>

          {/* Lease Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Lease Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full pl-8 pr-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="2500"
                  />
                </div>
                {errors.monthlyRent && <p className="text-red-500 text-sm mt-1">{errors.monthlyRent}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Start Date *
                </label>
                <input
                  type="date"
                  name="leaseStart"
                  value={formData.leaseStart}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.leaseStart ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.leaseStart && <p className="text-red-500 text-sm mt-1">{errors.leaseStart}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease End Date *
                </label>
                <input
                  type="date"
                  name="leaseEnd"
                  value={formData.leaseEnd}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.leaseEnd ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.leaseEnd && <p className="text-red-500 text-sm mt-1">{errors.leaseEnd}</p>}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Jane Doe"
                />
                {errors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="(555) 987-6543"
                />
                {errors.emergencyContactPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <select
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 placeholder:text-gray-300 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.emergencyContactRelationship ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
                {errors.emergencyContactRelationship && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactRelationship}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {tenant ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
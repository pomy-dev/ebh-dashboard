'use client';

import React, { useState, useMemo } from 'react';
import { Tenant } from '@/types';
import { Filter, Download, FileText, FileSpreadsheet, FileX, User, Phone, Mail, MapPin, Calendar, DollarSign, Edit } from 'lucide-react';

interface TenantsListProps {
  tenants: Tenant[];
  onEditTenant: (tenant: Tenant) => void;
}

const TenantsList: React.FC<TenantsListProps> = ({ tenants, onEditTenant }) => {
  const [filters, setFilters] = useState({
    property: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique properties for filter dropdown
  const uniqueProperties = useMemo(() => {
    return [...new Set(tenants.map(tenant => tenant.propertyName))];
  }, [tenants]);

  // Filter tenants based on current filters
  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      const matchesProperty = !filters.property || tenant.propertyName === filters.property;
      const matchesStatus = !filters.status || tenant.status === filters.status;
      const matchesSearch = !filters.search ||
        tenant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        tenant.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        tenant.unit.toLowerCase().includes(filters.search.toLowerCase());

      return matchesProperty && matchesStatus && matchesSearch;
    });
  }, [tenants, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      property: '',
      status: '',
      search: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Property', 'Unit', 'Monthly Rent', 'Lease Start', 'Lease End', 'Status', 'Outstanding Balance'];
    const csvContent = [
      headers.join(','),
      ...filteredTenants.map(tenant =>
        [
          tenant.name,
          tenant.email,
          tenant.phone,
          tenant.propertyName,
          tenant.unit,
          tenant.monthlyRent,
          tenant.leaseStart,
          tenant.leaseEnd,
          tenant.status,
          tenant.paymentHistory.outstandingBalance
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const table = `
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Property</th>
          <th>Unit</th>
          <th>Monthly Rent</th>
          <th>Lease Start</th>
          <th>Lease End</th>
          <th>Status</th>
          <th>Outstanding Balance</th>
        </tr>
        ${filteredTenants.map(tenant => `
          <tr>
            <td>${tenant.name}</td>
            <td>${tenant.email}</td>
            <td>${tenant.phone}</td>
            <td>${tenant.propertyName}</td>
            <td>${tenant.unit}</td>
            <td>$${tenant.monthlyRent}</td>
            <td>${tenant.leaseStart}</td>
            <td>${tenant.leaseEnd}</td>
            <td>${tenant.status}</td>
            <td>$${tenant.paymentHistory.outstandingBalance}</td>
          </tr>
        `).join('')}
      </table>
    `;

    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenants.xls';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToWord = () => {
    const doc = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Tenants Report</title>
        </head>
        <body>
          <h1>Tenants Report</h1>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Property</th>
              <th>Unit</th>
              <th>Monthly Rent</th>
              <th>Lease Start</th>
              <th>Lease End</th>
              <th>Status</th>
              <th>Outstanding Balance</th>
            </tr>
            ${filteredTenants.map(tenant => `
              <tr>
                <td>${tenant.name}</td>
                <td>${tenant.email}</td>
                <td>${tenant.phone}</td>
                <td>${tenant.propertyName}</td>
                <td>${tenant.unit}</td>
                <td>$${tenant.monthlyRent}</td>
                <td>${tenant.leaseStart}</td>
                <td>${tenant.leaseEnd}</td>
                <td>${tenant.status}</td>
                <td>$${tenant.paymentHistory.outstandingBalance}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([doc], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenants.doc';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* Filter and Export Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={exportToExcel}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span>Export as Excel</span>
                </button>
                <button
                  onClick={exportToWord}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <FileX className="w-4 h-4 text-blue-600" />
                  <span>Export as Word</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name, email, or unit..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
              <select
                value={filters.property}
                onChange={(e) => handleFilterChange('property', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Properties</option>
                {uniqueProperties.map(property => (
                  <option key={property} value={property}>{property}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredTenants.length} of {tenants.length} tenants
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{tenant.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                    {tenant.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onEditTenant(tenant)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit tenant"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{tenant.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{tenant.propertyName} - Unit {tenant.unit}</span>
              </div>
            </div>

            {/* Lease Information */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Rent</span>
                <span className="font-semibold text-gray-800">${tenant.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lease Period</span>
                <span className="text-sm text-gray-800">
                  {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outstanding Balance</span>
                <span className={`font-semibold ${tenant.paymentHistory.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${tenant.paymentHistory.outstandingBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Payment</span>
                <span className="text-sm text-gray-800">
                  {new Date(tenant.paymentHistory.lastPayment).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>{tenant.emergencyContact.name} ({tenant.emergencyContact.relationship})</div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{tenant.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-lg inline-block mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No tenants found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default TenantsList;
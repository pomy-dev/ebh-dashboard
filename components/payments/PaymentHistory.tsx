"use client"

import React, {useMemo, useState} from 'react';
import { Payment } from '../../types';
import { Filter, Download, FileText, FileSpreadsheet, FileX } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const [filters, setFilters] = useState({
    property: '',
    minAmount: '',
    maxAmount: '',
    month: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique properties for filter dropdown
  const uniqueProperties = useMemo(() => {
    return [...new Set(payments.map(payment => payment.propertyName))];
  }, [payments]);

  // Filter payments based on current filters
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesProperty = !filters.property || payment.propertyName === filters.property;
      const matchesMinAmount = !filters.minAmount || payment.amount >= Number(filters.minAmount);
      const matchesMaxAmount = !filters.maxAmount || payment.amount <= Number(filters.maxAmount);
      const matchesMonth = !filters.month || payment.date.startsWith(filters.month);
      const matchesStatus = !filters.status || payment.status === filters.status;

      return matchesProperty && matchesMinAmount && matchesMaxAmount && matchesMonth && matchesStatus;
    });
  }, [payments, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      property: '',
      minAmount: '',
      maxAmount: '',
      month: '',
      status: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['Tenant', 'Property', 'Amount', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment =>
        [payment.tenantName, payment.propertyName, payment.amount, payment.date, payment.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    // Create HTML table for Excel
    const table = `
      <table>
        <tr>
          <th>Tenant</th>
          <th>Property</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
        ${filteredPayments.map(payment => `
          <tr>
            <td>${payment.tenantName}</td>
            <td>${payment.propertyName}</td>
            <td>$${payment.amount}</td>
            <td>${payment.date}</td>
            <td>${payment.status}</td>
          </tr>
        `).join('')}
      </table>
    `;

    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.xls';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToWord = () => {
    const doc = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment History</title>
        </head>
        <body>
          <h1>Payment History Report</h1>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th>Tenant</th>
              <th>Property</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
            ${filteredPayments.map(payment => `
              <tr>
                <td>${payment.tenantName}</td>
                <td>${payment.propertyName}</td>
                <td>$${payment.amount}</td>
                <td>${payment.date}</td>
                <td>${payment.status}</td>
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
    a.download = 'payments.doc';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                placeholder="$10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input
                type="month"
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="lg:col-span-5 flex justify-end">
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
        Showing {filteredPayments.length} of {payments.length} payments
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.tenantName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.propertyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
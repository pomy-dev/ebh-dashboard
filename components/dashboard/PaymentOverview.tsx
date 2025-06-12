"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Payment } from '@/types';

interface PaymentsOverviewProps {
  payments: Payment[];
}

const PaymentsOverview: React.FC<PaymentsOverviewProps> = ({ payments }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate payment statistics
  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const overdueAmount = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const thisMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() &&
      paymentDate.getFullYear() === now.getFullYear();
  });

  const thisMonthRevenue = thisMonthPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Mock previous month data for trend calculation
  const lastMonthRevenue = thisMonthRevenue * 0.85; // Simulated 15% growth
  const revenueGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: { value: Number(revenueGrowth), isPositive: Number(revenueGrowth) > 0 },
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Pending Payments',
      value: `$${pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'Overdue Payments',
      value: `$${overdueAmount.toLocaleString()}`,
      icon: TrendingDown,
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'This Month',
      value: `$${thisMonthRevenue.toLocaleString()}`,
      icon: TrendingUp,
      trend: { value: Number(revenueGrowth), isPositive: Number(revenueGrowth) > 0 },
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  // Show only first 4 payments by default, all when expanded
  const displayedPayments = isExpanded ? payments : payments.slice(0, 4);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Payments Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-2">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl text-slate-400 font-semibold mt-2">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${stat.trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend.isPositive ? '+' : '-'}{Math.abs(stat.trend.value)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
          {payments.length > 4 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span className="text-sm font-medium">
                {isExpanded ? 'Show Less' : 'Expand'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        <div className="space-y-3">
          {displayedPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800">{payment.tenantName}</p>
                <p className="text-sm text-gray-600">{payment.propertyName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">${payment.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsOverview;
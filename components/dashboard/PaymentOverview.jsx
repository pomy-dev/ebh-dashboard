// File: PaymentsOverview.jsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Clock,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getPayments } from '@/services/paymentService'; // make sure this returns array of {id, tenantName, propertyName, amount, status, date}

const PaymentsOverview = () => {
  const [payments, setPayments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getPayments();
      setPayments(data);
    };
    load();
  }, []);

  // stats
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0);

  const current = new Date();
  const thisMonth = payments.filter(p => {
    const d = new Date(p.date);
    return d.getFullYear() === current.getFullYear() && d.getMonth() === current.getMonth();
  });
  const thisMonthRevenue = thisMonth.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const trendGrowth = thisMonthRevenue * 0.15; // 15% assumption
  const revenueGrowthPct = ((thisMonthRevenue - (thisMonthRevenue - trendGrowth)) / (thisMonthRevenue - trendGrowth) * 100).toFixed(1);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: { value: Number(revenueGrowthPct), isPositive: revenueGrowthPct > 0 },
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Pending Payments',
      value: `$${pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Overdue Payments',
      value: `$${overdueAmount.toLocaleString()}`,
      icon: TrendingDown,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'This Month',
      value: `$${thisMonthRevenue.toLocaleString()}`,
      icon: TrendingUp,
      trend: { value: Number(revenueGrowthPct), isPositive: revenueGrowthPct > 0 },
      color: 'bg-blue-50 text-blue-600',
    },
  ];

  // Recent payments
  const sorted = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayed = isExpanded ? sorted : sorted.slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Payments Overview</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4">
            <div className={`p-3 rounded-lg ${st.color}`}>
              <st.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">{st.title}</p>
            <p className="text-2xl font-semibold text-gray-800">{st.value}</p>
            {st.trend && (
              <div className="flex items-center mt-1">
                <span className={`text-sm ${st.trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {st.trend.isPositive ? '+' : '-'}
                  {Math.abs(st.trend.value)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
          {payments.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <span className="text-sm font-medium">{isExpanded ? 'Show Less' : 'Show All'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {displayed.map(p => (
            <div key={p.id} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <div>
                <p className="font-medium text-gray-800">{p.tenantName}</p>
                <p className="text-sm text-gray-600">{p.propertyName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">${p.amount.toLocaleString()}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : p.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
          {displayed.length === 0 && <p className="text-gray-500 text-center">No payments yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentsOverview;

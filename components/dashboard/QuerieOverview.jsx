// components/QueriesOverview.jsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getAllFaults } from '@/services/maintenanceService'; // You must create this service too

const QueriesOverview = () => {
  const [faults, setFaults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchFaults = async () => {
      const data = await getAllFaults();
      setFaults(data);
    };
    fetchFaults();
  }, []);

  const totalFaults = faults.length;
  const openFaults = faults.filter(f => f.status === 'open').length;
  const inProgress = faults.filter(f => f.status === 'in-progress').length;
  const resolved = faults.filter(f => f.status === 'resolved').length;
  const highPriority = faults.filter(f => f.priority === 'high').length;

  const resolutionRate = totalFaults > 0 ? ((resolved / totalFaults) * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Total Queries',
      value: totalFaults,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Open Issues',
      value: openFaults,
      icon: AlertTriangle,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      trend: { value: Number(resolutionRate), isPositive: true },
      color: 'bg-green-50 text-green-600',
    },
  ];

  const sorted = [...faults].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recent = isExpanded ? sorted : sorted.slice(0, 3);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Queries Overview</h2>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className={`p-3 rounded-lg inline-block ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            {stat.trend && (
              <p className="text-sm text-green-500 mt-1">
                {stat.trend.value}% resolved
              </p>
            )}
          </div>
        ))}
      </div>

      {/* High Priority Banner */}
      {highPriority > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">
              {highPriority} high priority issue{highPriority > 1 ? 's' : ''} require immediate attention
            </span>
          </div>
        </div>
      )}

      {/* Recent Queries */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Queries</h3>
          {faults.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              {isExpanded ? 'Show Less' : 'Show All'}
              {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          )}
        </div>
        <div className="space-y-3">
          {recent.map(fault => (
            <div key={fault.id} className="flex items-center justify-between border-b py-3">
              <div>
                <p className="font-medium text-gray-800">{fault.case_title}</p>
                <p className="text-sm text-gray-600">{fault.Property} - Unit {fault.Unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(fault.priority)}`}>
                  {fault.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fault.status)}`}>
                  {fault.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-center text-gray-500">No queries reported yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesOverview;

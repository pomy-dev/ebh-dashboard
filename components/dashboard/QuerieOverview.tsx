import React from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Fault } from '@/types';

interface QueriesOverviewProps {
  faults: Fault[];
}

const QueriesOverview: React.FC<QueriesOverviewProps> = ({ faults }) => {
  // Calculate fault statistics
  const totalFaults = faults.length;
  const openFaults = faults.filter(f => f.status === 'open').length;
  const inProgressFaults = faults.filter(f => f.status === 'in-progress').length;
  const resolvedFaults = faults.filter(f => f.status === 'resolved').length;
  const highPriorityFaults = faults.filter(f => f.priority === 'high').length;

  // Calculate resolution rate
  const resolutionRate = totalFaults > 0 ? ((resolvedFaults / totalFaults) * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Total Queries',
      value: totalFaults,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Open Issues',
      value: openFaults,
      icon: AlertTriangle,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'In Progress',
      value: inProgressFaults,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Resolved',
      value: resolvedFaults,
      icon: CheckCircle,
      trend: { value: Number(resolutionRate), isPositive: true },
      color: 'bg-green-50 text-green-600'
    }
  ];

  // Get recent faults
  const recentFaults = faults
    .sort((a, b) => new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Queries Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-2">
            <div className={`flex items-center p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-evenly">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-500">
                      {stat.trend.value}% resolved
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High Priority Alerts */}
      {highPriorityFaults > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">
              {highPriorityFaults} high priority issue{highPriorityFaults > 1 ? 's' : ''} require{highPriorityFaults === 1 ? 's' : ''} immediate attention
            </span>
          </div>
        </div>
      )}

      {/* Recent Queries */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Queries</h3>
        <div className="space-y-4">
          {recentFaults.map((fault) => (
            <div key={fault.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{fault.title}</p>
                <p className="text-sm text-gray-600">{fault.propertyName} - Unit {fault.unit}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(fault.priority)}`}>
                  {fault.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fault.status)}`}>
                  {fault.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
          {recentFaults.length === 0 && (
            <p className="text-gray-500 text-center py-4">No queries reported yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesOverview;
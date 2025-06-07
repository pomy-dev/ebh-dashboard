
import React from 'react';
import { Fault } from '../../utils/mockData';

interface FaultsListProps {
  faults: Fault[];
}

const FaultsList: React.FC<FaultsListProps> = ({ faults }) => {
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
      {faults.map((fault) => (
        <div key={fault.id} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{fault.title}</h3>
              <p className="text-gray-600 mt-2">{fault.description}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(fault.priority)}`}>
                {fault.priority}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fault.status)}`}>
                {fault.status}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Property:</span> {fault.propertyName}
            </div>
            <div>
              <span className="font-medium">Unit:</span> {fault.unit}
            </div>
            <div>
              <span className="font-medium">Reported:</span> {fault.dateReported}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaultsList;
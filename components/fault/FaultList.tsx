"use client"

import React, { useState } from 'react';
import { Fault } from '../../utils/mockData';
import FaultReplyModal from './FaultReplyModal';
import { MessageSquare } from 'lucide-react';

interface FaultsListProps {
  faults: Fault[];
}

const FaultsList: React.FC<FaultsListProps> = ({ faults: initialFaults }) => {
  const [faults, setFaults] = useState(initialFaults);
  const [selectedFault, setSelectedFault] = useState<Fault | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

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

  const handleReplyClick = (fault: Fault) => {
    setSelectedFault(fault);
    setIsReplyModalOpen(true);
  };

  const handleReplySubmit = (faultId: string, reply: { status: string; message: string }) => {
    setFaults(prevFaults =>
      prevFaults.map(fault =>
        fault.id === faultId
          ? { ...fault, status: reply.status as 'open' | 'in-progress' | 'resolved' }
          : fault
      )
    );
  };

  return (
    <>
      <div className="space-y-6">
        {faults.map((fault) => (
          <div key={fault.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{fault.title}</h3>
                <p className="text-gray-600 mt-2">{fault.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(fault.priority)}`}>
                    {fault.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fault.status)}`}>
                    {fault.status.replace('-', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => handleReplyClick(fault)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reply</span>
                </button>
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
                <span className="font-medium">Reported:</span> {new Date(fault.dateReported).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <FaultReplyModal
        fault={selectedFault}
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setSelectedFault(null);
        }}
        onSubmit={handleReplySubmit}
      />
    </>
  );
};

export default FaultsList;
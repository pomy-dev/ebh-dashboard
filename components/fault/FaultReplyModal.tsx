'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Fault } from '@/types';

interface FaultReplyModalProps {
  fault: Fault | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (faultId: string, reply: { status: string; message: string }) => void;
}

const FaultReplyModal: React.FC<FaultReplyModalProps> = ({ fault, isOpen, onClose, onSubmit }) => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ status?: string; message?: string }>({});

  React.useEffect(() => {
    if (fault && isOpen) {
      setStatus(fault.status);
      setMessage('');
      setErrors({});
    }
  }, [fault, isOpen]);

  const validateForm = () => {
    const newErrors: { status?: string; message?: string } = {};

    if (!status) newErrors.status = 'Status is required';
    if (!message.trim()) newErrors.message = 'Reply message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && fault) {
      onSubmit(fault.id, { status, message });
      setMessage('');
      onClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'open':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen || !fault) return null;

  return (
    <div className="fixed inset-0 flex items-center ml-68 z-50 p-4 scrollbar-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[160vh] max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reply to Fault Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Fault Details */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{fault.title}</h3>
                <p className="text-gray-600 mt-1">{fault.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(fault.priority)}`}>
                  {fault.priority} priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Property:</span>
                <p className="text-gray-600">{fault.propertyName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Unit:</span>
                <p className="text-gray-600">{fault.unit}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reported:</span>
                <p className="text-gray-600">{new Date(fault.dateReported).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Current Status:</span>
                <div className="flex items-center space-x-1 mt-1">
                  {getStatusIcon(fault.status)}
                  <span className="text-gray-600 capitalize">{fault.status.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'open', label: 'Open', icon: AlertCircle, color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
                { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'border-blue-300 bg-blue-50 text-blue-700' },
                { value: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'border-green-300 bg-green-50 text-green-700' }
              ].map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-3 text-center transition-all ${status === option.value
                    ? option.color
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}>
                    <option.icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Provide an update on the fault status, actions taken, or next steps..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
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
              Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FaultReplyModal;
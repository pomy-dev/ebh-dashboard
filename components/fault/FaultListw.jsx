'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Paperclip, Loader2, Search, Download, ChevronDown } from 'lucide-react';
import FaultReplyModal from './FaultReplyModal';
import FaultFilesModal from './FaultFilesModal';
import { getAllFaults } from '@/services/maintenanceService';
import { updateFaultReply } from '@/services/maintenanceService';
// import { exportToCSV } from '@/utils/exportToCSV';

const FaultsList = () => {
  const [faults, setFaults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedFault, setSelectedFault] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);

  useEffect(() => {
    fetchFaults();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [faults, search, sortKey]);

  const fetchFaults = async () => {
    setLoading(true);
    const data = await getAllFaults();
    setFaults(data || []);
    setLoading(false);
  };

  const handleReplySubmit = async (faultId, reply) => {
    await updateFaultReply(faultId, reply);
    await fetchFaults();
  };

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

  const filterAndSort = () => {
    let data = [...faults];

    if (search) {
      data = data.filter((f) =>
        f.case_title?.toLowerCase().includes(search.toLowerCase()) ||
        f.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortKey === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortKey === 'status') {
      const statusOrder = { open: 1, 'in-progress': 2, resolved: 3 };
      data.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    setFiltered(data);
  };

  // const handleExport = () => {
  //   exportToCSV(faults, 'faults_report');
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  return (
    <>
      <div className="flex bg-white rounded-xl shadow-sm p-6 justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search faults..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 text-gray-800 border rounded-lg w-72 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <select
            className="px-3 py-2 text-gray-800 border rounded-lg text-sm"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <button
          // onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="space-y-6">
        {filtered.map((fault) => (
          <div key={fault.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{fault.case_title}</h3>
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
                  onClick={() => {
                    setSelectedFault(fault);
                    setIsFilesModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>View Files</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedFault(fault);
                    setIsReplyModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div><span className="font-medium">Property:</span> {fault.Property}</div>
              <div><span className="font-medium">Unit:</span> {fault.Unit}</div>
              <div><span className="font-medium">Reported:</span> {new Date(fault.created_at).toLocaleDateString()}</div>
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

      <FaultFilesModal
        fault={selectedFault}
        isOpen={isFilesModalOpen}
        onClose={() => {
          setIsFilesModalOpen(false);
          setSelectedFault(null);
        }}
      />
    </>
  );
};

export default FaultsList;

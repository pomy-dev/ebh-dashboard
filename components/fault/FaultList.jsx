'use client';

import React, { useEffect, useState } from 'react';
// import { Search,  Download } from 'lucide-react';
import { MessageSquare, Paperclip, Loader2, Search, Download, ChevronDown } from 'lucide-react';
import { format, subDays, startOfToday } from 'date-fns';
import { getAllFaults } from '@/services/maintenanceService';
import FaultReplyModal from './FaultReplyModal';
import FaultFilesModal from './FaultFilesModal';

const FaultsList = () => {
  const [faults, setFaults] = useState([]);
  const [filteredFaults, setFilteredFaults] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFault, setSelectedFault] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFaults = async () => {
      setLoading(true);
      const data = await getAllFaults();
      setFaults(data);
      setLoading(false);
    };
    loadFaults();
  }, []);

  useEffect(() => {
    let filtered = [...faults];

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        f =>
          f.case_title?.toLowerCase().includes(query) ||
          f.description?.toLowerCase().includes(query)
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        f => new Date(f.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      const toDate = new Date(endDate);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        f => new Date(f.created_at) <= toDate
      );
    }

    if (sortKey) {
      filtered.sort((a, b) =>
        (a[sortKey] || '').localeCompare(b[sortKey] || '')
      );
    }

    setFilteredFaults(filtered);
  }, [search, sortKey, startDate, endDate, faults]);



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

  const handleReplyClick = fault => {
    setSelectedFault(fault);
    setIsReplyModalOpen(true);
  };

  const handleFilesClick = fault => {
    setSelectedFault(fault);
    setIsFilesModalOpen(true);
  };

  const handleReplySubmit = (id, updated) => {
    setFaults(prev =>
      prev.map(f =>
        f.id === id ? { ...f, ...updated } : f
      )
    );
    setIsReplyModalOpen(false);
  };

  const applyPresetRange = days => {
    const from = format(subDays(startOfToday(), days), 'yyyy-MM-dd');
    const to = format(new Date(), 'yyyy-MM-dd');
    setStartDate(from);
    setEndDate(to);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap bg-white rounded-xl shadow-sm p-6 justify-between items-center mb-6 gap-4">
        <div className="flex items-center flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search faults..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 text-gray-800 border rounded-lg w-72 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <select
            className="px-3 py-2 text-gray-800 border rounded-lg text-sm"
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-2 py-1 border rounded text-sm text-gray-800"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-2 py-1 border rounded text-sm text-gray-800"
          />

          <select
            onChange={e => applyPresetRange(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm text-gray-800"
          >
            <option value="">Preset Range</option>
            <option value="0">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>

        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : (

        <div className="space-y-6">
        {filteredFaults.map((fault) => (
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
      )}

      <FaultReplyModal
        fault={selectedFault}
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onSubmit={handleReplySubmit}
      />
      <FaultFilesModal
        fault={selectedFault}
        isOpen={isFilesModalOpen}
        onClose={() => setIsFilesModalOpen(false)}
      />
    </div>
  );
};

export default FaultsList;

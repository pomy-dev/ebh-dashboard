"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Filter,
  Download,
  FileText,
  FileSpreadsheet,
  FileX,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Loader2,
  Trash2,
} from "lucide-react";
import { getUserDetail } from '@/services/tenantsService';

const TenantsList = ({ tenants, onEditTenant, onDeleteTenant }) => {
  const [filters, setFilters] = useState({
    property: "",
    status: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [userDetailsMap, setUserDetailsMap] = useState({});
   const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Fetch user details for all tenants using their user_id
  useEffect(() => {
    const fetchUserDetails = async () => {
      const newUserDetailsMap = {};

      for (const tenant of tenants) {
        if (!tenant.user_id) continue;

        try {
          const data = await getUserDetail(tenant.user_id);
          if (data.length > 0) {
            newUserDetailsMap[tenant.user_id] = data[0];
          }
        } catch (error) {
          console.error("Failed to fetch user details for:", tenant.user_id);
        }
      }

      setUserDetailsMap(newUserDetailsMap);
      setIsLoadingUsers(false);
    };

    // Add a slight delay to ensure tenants are loaded
    if (tenants.length > 0) {
      setTimeout(fetchUserDetails, 500);
    }
  }, [tenants]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const uniqueProperties = useMemo(() => {
    return [...new Set(tenants.map((tenant) => tenant.propertyName))];
  }, [tenants]);

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesProperty =
        !filters.property || tenant.propertyName === filters.property;
      const matchesStatus =
        !filters.status || tenant.status === filters.status;

      const userDetail = userDetailsMap[tenant.user_id];
      const matchesSearch =
        !filters.search ||
        tenant.unit?.toLowerCase().includes(filters.search.toLowerCase()) ||
        userDetail?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        userDetail?.email?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesProperty && matchesStatus && matchesSearch;
    });
  }, [tenants, filters, userDetailsMap]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () =>
    setFilters({ property: "", status: "", search: "" });

  return (
    <div className="space-y-6">
      {/* Filters and Export */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Export dropdown */}
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
                  onClick={() => {/* implement exportToCSV */}}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => {/* implement exportToExcel */}}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span>Export as Excel</span>
                </button>
                <button
                  onClick={() => {/* implement exportToWord */}}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <FileX className="w-4 h-4 text-blue-600" />
                  <span>Export as Word</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 border rounded-lg"
            />
            <select
              value={filters.property}
              onChange={(e) => handleFilterChange("property", e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Properties</option>
              {uniqueProperties.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
            <div className="md:col-span-3 text-right">
              <button onClick={clearFilters} className="text-sm text-blue-600">
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tenants Cards */}

            {isLoadingUsers ? (
        <div className="flex justify-center py-20 text-blue-600">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span>Loading tenant data...</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTenants.map((t) => {
          const user = userDetailsMap[t.user_id] || {};
          return (
            <div key={t.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name || t.user_id}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditTenant(t)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTenant(t.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email || "Loading..."}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{user.user_number || "Loading..."}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {"property ID :" + t.property_id} - Unit {t.unit_number}
                  </span>
                </div>
              </div>

              {/* Lease & Payment */}
              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monthly Rent</span>
                  <span className="font-semibold text-gray-800">
                    E{t.monthly_rent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lease</span>
                  <span>
                    {t.lease_start_date} - {t.lease_end_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding</span>
                  <span
                    className={
                      t.paymentHistory?.outstandingBalance > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    E{t.paymentHistory?.outstandingBalance || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Payment</span>
                  <span>{t.paymentHistory?.lastPayment}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 text-sm text-gray-600">
                <h4 className="font-medium mb-1">Emergency Contact</h4>
                <div>
                  {t.emergency_name} ({t.relationship})
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{t.emergency_phone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )} 

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-lg inline-block mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">
            No tenants found matching your filters.
          </p>
        </div>
      )}
      
    </div>
  );
};

export default TenantsList;

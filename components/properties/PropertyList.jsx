'use client';

import React, { useEffect, useState } from 'react';
import { getAllProperties, deleteProperty, updateProperty, insertProperty } from '@/services/supabaseService';
import PropertyForm from './PropertyForm';
import { toast } from 'react-hot-toast';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const fetchProperties = async () => {
    const { data, error } = await getAllProperties();
    if (!error) {
      setProperties(data);
    } else {
      toast.error('Error fetching properties');
      console.error('Error fetching properties:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this property?');
    if (confirmed) {
      const { error } = await deleteProperty(id);
      if (!error) {
        toast.success('Property deleted');
        fetchProperties();
      } else {
        toast.error('Error deleting property');
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleUpdate = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProperty(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  const handlePropertySubmit = async (formData) => {
    try {
      const payload = { ...formData };
      delete payload.created_at;

      let response;
      if (payload.id) {
        response = await updateProperty(payload.id, payload);
        if (response.error) throw new Error(response.error.message);
        toast.success('Property updated');
      } else {
        response = await insertProperty(payload);
        if (response.error) throw new Error(response.error.message);
        toast.success('Property added');
      }

      fetchProperties();
      handleModalClose();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Submission failed');
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Property
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={property.property_image || '/placeholder.jpg'}
                alt={property.property_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{property.property_name}</h3>
                <p className="text-gray-600 mt-2">{property.street_address}, {property.city}, {property.states}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Units</span>
                    <span className="font-medium px-6 py-1 rounded-full bg-slate-100 text-slate-700">{property.number_of_units}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-medium text-slate-600">${property.monthly_rent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-slate-600">{property.property_type}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between gap-4">
                  <button
                    onClick={() => handleUpdate(property)}
                    className="px-4 py-2 text-sm bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <PropertyForm
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSubmit={handlePropertySubmit}
          initialValues={selectedProperty}
        />
      )}
    </>
  );
};

export default PropertyList;

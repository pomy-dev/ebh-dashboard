'use client';

import React, { useEffect, useState } from 'react';
import PropertyList from '@/components/properties/PropertyList';
import PropertyForm from '@/components/properties/PropertyForm';
import { getAllProperties, insertProperty } from '@/services/supabaseService';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchProperties = async () => {
    const { data, error } = await getAllProperties();
    if (!error) setProperties(data);
    else console.error('Error fetching properties:', error);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = async (formData) => {
    const { error } = await insertProperty(formData);
    if (error) return console.error('Insert failed:', error);
    await fetchProperties();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        {/* <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Property
        </button> */}
      </div>

      <PropertyList properties={properties} />

      <PropertyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProperty}
        refreshProperties={fetchProperties}
      />
    </div>
  );
};

export default Properties;

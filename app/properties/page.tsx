'use client';

import React, { useState } from 'react';
import PropertyList from '@/components/properties/PropertyList';
import PropertyForm from '../../components/properties/PropertyForm';
import { properties as initialProperties } from '@/utils/mockData';
import { Property } from '@/types';

const Properties = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddProperty = (formData: any) => {
    const newProperty: Property = {
      id: (properties.length + 1).toString(),
      name: formData.name,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      units: formData.units,
      occupied: 0, // New property starts with 0 occupied units
      available: formData.units, // All units are available initially
      monthlyRent: formData.monthlyRent,
      imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    };

    setProperties(prev => [...prev, newProperty]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Property
        </button>
      </div>

      <PropertyList properties={properties} />

      <PropertyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProperty}
      />
    </div>
  );
};

export default Properties;
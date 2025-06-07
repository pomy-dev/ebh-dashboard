import React from 'react';
import { Property } from '../../types';

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800">{property.name}</h3>
            <p className="text-gray-600 mt-2">{property.address}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Units</span>
                <span className="font-medium">{property.units}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupied</span>
                <span className="font-medium text-green-600">{property.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available</span>
                <span className="font-medium text-blue-600">{property.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span className="font-medium">${property.monthlyRent}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
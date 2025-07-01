'use client';

import React, { useEffect, useState } from 'react';
import { X, Building, Loader2 } from 'lucide-react';

const PropertyForm = ({ isOpen, onClose, onSubmit, initialValues = null, refreshProperties }) => {
  const [formData, setFormData] = useState({
    property_name: '',
    property_type: 'apartment',
    description: '',
    street_address: '',
    city: '',
    states: '',
    zip_code: '',
    number_of_units: 1,
    monthly_rent: 0,
    amenities: [],
    property_image: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTypes = [
    { value: '', label: 'Select Type' },
    { value: 'apartment', label: 'Apartment Complex' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'single-family', label: 'Single Family Home' },
    { value: 'duplex', label: 'Duplex' }
  ];

  const availableAmenities = [
    'Swimming Pool', 'Gym/Fitness Center', 'Parking Garage', 'Laundry Facility',
    'Pet Friendly', 'Balcony/Patio', 'Air Conditioning', 'Dishwasher',
    'In-Unit Washer/Dryer', 'Elevator', 'Security System', 'Concierge'
  ];

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_units' || name === 'monthly_rent' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.property_name.trim()) newErrors.property_name = 'Property name is required';
    if (!formData.property_type.trim()) newErrors.property_type = 'Property type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.street_address.trim()) newErrors.street_address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.states.trim()) newErrors.states = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
    if (formData.number_of_units < 1) newErrors.number_of_units = 'Must have at least 1 unit';
    if (formData.monthly_rent <= 0) newErrors.monthly_rent = 'Monthly rent must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (refreshProperties) await refreshProperties();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center ml-68 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[160vh] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-black">
              {formData.id ? 'Update Property' : 'Add New Property'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Property Name *</label>
              <input name="property_name" value={formData.property_name} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg placeholder-black text-black" placeholder="e.g., Sunset Apartments" />
              {errors.property_name && <p className="text-red-500 text-sm mt-1">{errors.property_name}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Property Type *</label>
              <select name="property_type" value={formData.property_type} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black">
                {propertyTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              {errors.property_type && <p className="text-red-500 text-sm mt-1">{errors.property_type}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="Describe the property..." rows={3} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Street Address *</label>
              <input name="street_address" value={formData.street_address} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="123 Main Street" />
              {errors.street_address && <p className="text-red-500 text-sm mt-1">{errors.street_address}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">City *</label>
              <input name="city" value={formData.city} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="City" />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">State *</label>
              <input name="states" value={formData.states} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="State" />
              {errors.states && <p className="text-red-500 text-sm mt-1">{errors.states}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">ZIP Code *</label>
              <input name="zip_code" value={formData.zip_code} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="ZIP Code" />
              {errors.zip_code && <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Number of Units *</label>
              <input name="number_of_units" type="number" value={formData.number_of_units} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="Number of Units" />
              {errors.number_of_units && <p className="text-red-500 text-sm mt-1">{errors.number_of_units}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Monthly Rent *</label>
              <input name="monthly_rent" type="number" value={formData.monthly_rent} onChange={handleInputChange} className="w-full border px-4 py-3 rounded-lg text-black placeholder-black" placeholder="Monthly Rent" />
              {errors.monthly_rent && <p className="text-red-500 text-sm mt-1">{errors.monthly_rent}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Property Image</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setFormData(prev => ({ ...prev, property_image: reader.result }));
                reader.readAsDataURL(file);
              }
            }} />
            {formData.property_image && <img src={formData.property_image} className="w-40 h-40 object-cover rounded mt-2" alt="Preview" />}
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-lg text-black hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg text-white transition-colors duration-200 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                formData.id ? 'Update Property' : 'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;

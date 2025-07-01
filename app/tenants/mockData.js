// mockData.js

// Dummy data for tenants
export const tenants = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '123-456-7890',
    propertyName: 'Property A',
    unit: '101',
    monthlyRent: 1200,
    leaseStart: '2023-01-01',
    leaseEnd: '2024-01-01',
    status: 'active',
    emergencyContact: {
      name: 'Bob Johnson',
      phone: '987-654-3210',
      relationship: 'Brother'
    },
    paymentHistory: {
      totalPaid: 1200,
      lastPayment: '2023-06-01',
      outstandingBalance: 0
    }
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '234-567-8901',
    propertyName: 'Property B',
    unit: '202',
    monthlyRent: 1500,
    leaseStart: '2023-03-01',
    leaseEnd: '2024-03-01',
    status: 'active',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '876-543-2109',
      relationship: 'Wife'
    },
    paymentHistory: {
      totalPaid: 3000,
      lastPayment: '2023-06-01',
      outstandingBalance: 0
    }
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '345-678-9012',
    propertyName: 'Property A',
    unit: '103',
    monthlyRent: 1100,
    leaseStart: '2023-02-01',
    leaseEnd: '2024-02-01',
    status: 'pending',
    emergencyContact: {
      name: 'Mark Davis',
      phone: '765-432-1098',
      relationship: 'Father'
    },
    paymentHistory: {
      totalPaid: 550,
      lastPayment: '2023-05-15',
      outstandingBalance: 550
    }
  }
];

// Dummy data for properties
export const properties = [
  {
    id: '1',
    name: 'Property A',
    address: '123 Main St, Anytown, USA',
    units: 10,
    occupied: 8,
    available: 2,
    monthlyRent: 1200,
    imageUrl: 'https://example.com/imageA.jpg'
  },
  {
    id: '2',
    name: 'Property B',
    address: '456 Elm St, Anytown, USA',
    units: 20,
    occupied: 15,
    available: 5,
    monthlyRent: 1500,
    imageUrl: 'https://example.com/imageB.jpg'
  }
];
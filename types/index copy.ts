// types.js

// Property object structure
const Property = {
  id: '',
  name: '',
  address: '',
  units: 0,
  occupied: 0,
  available: 0,
  monthlyRent: 0,
  imageUrl: ''
};

// Payment object structure
const Payment = {
  id: '',
  tenant_id: 0,
  amount: 0,
  updated_at: '',
  method: '',
  account: '',
  reference: '',
  status: 'paid' // 'paid' | 'pending' | 'overdue'
};

// Fault object structure
const Fault = {
  id: '',
  title: '',
  description: '',
  status: 'open', // 'open' | 'in-progress' | 'resolved'
  priority: 'low', // 'low' | 'medium' | 'high'
  dateReported: '',
  propertyName: '',
  unit: ''
};

// Tenant object structure
const Tenant = {
  id: '',
  name: '',
  email: '',
  phone: '',
  propertyName: '',
  unit: '',
  monthlyRent: 0,
  leaseStart: '',
  leaseEnd: '',
  status: 'active', // 'active' | 'pending' | 'expired'
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  paymentHistory: {
    totalPaid: 0,
    lastPayment: '',
    outstandingBalance: 0
  }
};

// Exporting the objects
module.exports = {
  Property,
  Payment,
  Fault,
  Tenant
};
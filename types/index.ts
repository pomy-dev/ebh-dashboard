export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  occupied: number;
  available: number;
  monthlyRent: number;
  imageUrl: string;
}

export interface Payment {
  id: string;
  tenantName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  propertyName: string;
}

export interface Fault {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  dateReported: string;
  propertyName: string;
  unit: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  unit: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'pending' | 'expired';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  paymentHistory: {
    totalPaid: number;
    lastPayment: string;
    outstandingBalance: number;
  };
}
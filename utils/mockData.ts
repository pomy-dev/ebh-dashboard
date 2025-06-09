import { Property, Payment, Fault, Tenant } from '@/types';

export const properties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd, Los Angeles, CA 90028',
    units: 50,
    occupied: 45,
    available: 5,
    monthlyRent: 2500,
    imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
  },
  {
    id: '2',
    name: 'Ocean View Complex',
    address: '456 Beach Road, Miami, FL 33139',
    units: 75,
    occupied: 70,
    available: 5,
    monthlyRent: 3000,
    imageUrl: 'https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg'
  },
  {
    id: '3',
    name: 'City Heights',
    address: '789 Downtown Ave, New York, NY 10001',
    units: 100,
    occupied: 92,
    available: 8,
    monthlyRent: 3500,
    imageUrl: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg'
  }
];

export const payments: Payment[] = [
  {
    id: '1',
    tenantName: 'John Doe',
    amount: 2500,
    date: '2024-03-01',
    status: 'paid',
    propertyName: 'Sunset Apartments'
  },
  {
    id: '2',
    tenantName: 'Jane Smith',
    amount: 3000,
    date: '2024-03-02',
    status: 'pending',
    propertyName: 'Ocean View Complex'
  },
  {
    id: '3',
    tenantName: 'Mike Johnson',
    amount: 3500,
    date: '2024-02-28',
    status: 'overdue',
    propertyName: 'City Heights'
  },
  {
    id: '4',
    tenantName: 'Sarah Wilson',
    amount: 2500,
    date: '2024-03-01',
    status: 'paid',
    propertyName: 'Sunset Apartments'
  },
  {
    id: '5',
    tenantName: 'David Brown',
    amount: 3000,
    date: '2024-03-03',
    status: 'paid',
    propertyName: 'Ocean View Complex'
  },
  {
    id: '6',
    tenantName: 'Emily Davis',
    amount: 3500,
    date: '2024-03-01',
    status: 'pending',
    propertyName: 'City Heights'
  }
];

export const faults: Fault[] = [
  {
    id: '1',
    title: 'Leaking Faucet',
    description: 'Kitchen sink faucet is constantly dripping',
    status: 'open',
    priority: 'medium',
    dateReported: '2024-03-01',
    propertyName: 'Sunset Apartments',
    unit: '12B'
  },
  {
    id: '2',
    title: 'AC Not Working',
    description: 'Air conditioning unit not cooling properly',
    status: 'in-progress',
    priority: 'high',
    dateReported: '2024-03-02',
    propertyName: 'Ocean View Complex',
    unit: '45A'
  },
  {
    id: '3',
    title: 'Light Fixture Replacement',
    description: 'Bathroom light fixture needs replacement',
    status: 'resolved',
    priority: 'low',
    dateReported: '2024-02-28',
    propertyName: 'City Heights',
    unit: '23C'
  }
];

export const tenants: Tenant[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    propertyName: 'Sunset Apartments',
    unit: '12B',
    monthlyRent: 2500,
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    status: 'active',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    paymentHistory: {
      totalPaid: 22500,
      lastPayment: '2024-03-01',
      outstandingBalance: 0
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 234-5678',
    propertyName: 'Ocean View Complex',
    unit: '45A',
    monthlyRent: 3000,
    leaseStart: '2023-08-15',
    leaseEnd: '2024-08-14',
    status: 'active',
    emergencyContact: {
      name: 'Robert Smith',
      phone: '(555) 876-5432',
      relationship: 'Father'
    },
    paymentHistory: {
      totalPaid: 21000,
      lastPayment: '2024-02-01',
      outstandingBalance: 3000
    }
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '(555) 345-6789',
    propertyName: 'City Heights',
    unit: '23C',
    monthlyRent: 3500,
    leaseStart: '2023-09-01',
    leaseEnd: '2024-08-31',
    status: 'active',
    emergencyContact: {
      name: 'Lisa Johnson',
      phone: '(555) 765-4321',
      relationship: 'Sister'
    },
    paymentHistory: {
      totalPaid: 21000,
      lastPayment: '2024-01-28',
      outstandingBalance: 7000
    }
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '(555) 456-7890',
    propertyName: 'Sunset Apartments',
    unit: '8A',
    monthlyRent: 2500,
    leaseStart: '2023-07-01',
    leaseEnd: '2024-06-30',
    status: 'active',
    emergencyContact: {
      name: 'Mark Wilson',
      phone: '(555) 654-3210',
      relationship: 'Brother'
    },
    paymentHistory: {
      totalPaid: 20000,
      lastPayment: '2024-03-01',
      outstandingBalance: 0
    }
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '(555) 567-8901',
    propertyName: 'Ocean View Complex',
    unit: '67B',
    monthlyRent: 3000,
    leaseStart: '2023-10-01',
    leaseEnd: '2024-09-30',
    status: 'active',
    emergencyContact: {
      name: 'Mary Brown',
      phone: '(555) 543-2109',
      relationship: 'Mother'
    },
    paymentHistory: {
      totalPaid: 15000,
      lastPayment: '2024-03-03',
      outstandingBalance: 0
    }
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 678-9012',
    propertyName: 'City Heights',
    unit: '89D',
    monthlyRent: 3500,
    leaseStart: '2023-11-15',
    leaseEnd: '2024-11-14',
    status: 'active',
    emergencyContact: {
      name: 'Tom Davis',
      phone: '(555) 432-1098',
      relationship: 'Father'
    },
    paymentHistory: {
      totalPaid: 14000,
      lastPayment: '2024-02-15',
      outstandingBalance: 3500
    }
  },
  {
    id: '7',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@email.com',
    phone: '(555) 789-0123',
    propertyName: 'Sunset Apartments',
    unit: '34C',
    monthlyRent: 2500,
    leaseStart: '2023-05-01',
    leaseEnd: '2024-04-30',
    status: 'pending',
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '(555) 321-0987',
      relationship: 'Spouse'
    },
    paymentHistory: {
      totalPaid: 25000,
      lastPayment: '2024-03-01',
      outstandingBalance: 0
    }
  },
  {
    id: '8',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '(555) 890-1234',
    propertyName: 'Ocean View Complex',
    unit: '12F',
    monthlyRent: 3000,
    leaseStart: '2022-12-01',
    leaseEnd: '2023-11-30',
    status: 'expired',
    emergencyContact: {
      name: 'John Thompson',
      phone: '(555) 210-9876',
      relationship: 'Brother'
    },
    paymentHistory: {
      totalPaid: 36000,
      lastPayment: '2023-11-01',
      outstandingBalance: 0
    }
  }
];
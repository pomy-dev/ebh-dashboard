import { Property, Payment, Fault } from '../types';

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
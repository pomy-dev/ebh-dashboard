import React from 'react';
import { Building2, Home, Users, Percent } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PaymentsOverview from '@/components/dashboard/PaymentOverview';
import QueriesOverview from '@/components/dashboard/QuerieOverview';
import { properties, payments, faults } from '@/utils/mockData';

const Dashboard = () => {
  // Calculate total statistics
  const totalUnits = properties.reduce((sum, prop) => sum + prop.units, 0);
  const totalOccupied = properties.reduce((sum, prop) => sum + prop.occupied, 0);
  const totalAvailable = properties.reduce((sum, prop) => sum + prop.available, 0);
  const occupancyRate = ((totalOccupied / totalUnits) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={properties.length}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={Home}
        />
        <StatCard
          title="Occupied Units"
          value={totalOccupied}
          icon={Users}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={Percent}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Payments and Queries Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <PaymentsOverview payments={payments} />
        <QueriesOverview faults={faults} />
      </div>
    </div>
  );
};

export default Dashboard;
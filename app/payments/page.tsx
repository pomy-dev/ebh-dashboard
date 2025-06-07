import React from 'react';
import PaymentHistory from '../../components/payments/PaymentHistory';
import { payments } from '../../utils/mockData';

const Payments = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
      </div>
      <PaymentHistory payments={payments} />
    </div>
  );
};

export default Payments;
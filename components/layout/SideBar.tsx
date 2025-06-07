'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, AlertTriangle, Building2 } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/fault', icon: AlertTriangle, label: 'Queries' },
    { path: '/properties', icon: Building2, label: 'Properties' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Naku Ekhaya</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
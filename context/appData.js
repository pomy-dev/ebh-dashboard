"use client";

import React, { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState([]); // default theme



  return (
    <AppContext.Provider value={{ paymentData, setPaymentData}}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppData = () => useContext(AppContext);
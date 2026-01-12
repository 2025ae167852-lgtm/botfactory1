import React from 'react';

export const Toaster = () => {
  return (
    <div className="toast-container">
      {/* Simple toast placeholder - you can use a library like react-hot-toast later */}
      <div className="hidden" id="toast-default"></div>
    </div>
  );
};

export const toast = {
  success: (message: string) => {
    console.log(`✅ ${message}`);
    // Add your toast logic here
  },
  error: (message: string) => {
    console.error(`❌ ${message}`);
    // Add your toast logic here
  },
  info: (message: string) => {
    console.log(`ℹ️ ${message}`);
    // Add your toast logic here
  }
};

export default Toaster;
import React from "react";

const Toaster: React.FC = () => {
  return null; // Minimal placeholder for build
};

export default Toaster;

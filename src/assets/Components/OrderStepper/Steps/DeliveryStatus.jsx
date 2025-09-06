import React, { useEffect } from "react";
import loader from '../../Loader/Loader';

export default function DeliveryStatus({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          {loader}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Your order is on the way 🚚
        </h2>
        
        <p className="text-gray-600 mb-6">
          Please wait a moment while your order is being delivered...
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-3000 ease-linear" 
            style={{ width: '0%' }}
            id="progress-bar"
          >
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Preparing your order...
        </p>
      </div>
    </div>
  );
}

useEffect(() => {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = '100%';
  }
}, []);
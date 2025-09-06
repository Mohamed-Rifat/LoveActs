import React, { useState, useEffect } from "react";

export default function ConfirmPersonalInfo({ onConfirm, userInitialData }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (userInitialData) setUserData(userInitialData);
  }, [userInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmClick = () => {
    onConfirm(userData); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-5 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Confirm Your Personal Information 🛡️
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Please make sure your information is correct before proceeding to review your order
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md mb-8">
        <div className="w-full">
          <label htmlFor="name" className="block text-left mb-2 text-gray-700">Full Name</label>
          <input
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="email" className="block text-left mb-2 text-gray-700">Email Address</label>
          <input
            id="email"
            name="email"
            value={userData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="phone" className="block text-left mb-2 text-gray-700">Phone Number</label>
          <input
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div>
        <button 
          onClick={handleConfirmClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Confirm Information
        </button>
      </div>
    </div>
  );
}
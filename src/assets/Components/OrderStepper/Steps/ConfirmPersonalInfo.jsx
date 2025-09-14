import React, { useState, useEffect } from "react";

export default function ConfirmPersonalInfo({ onConfirm, userInitialData }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (userInitialData) setUserData((prev) => ({ ...prev, ...userInitialData }));
  }, [userInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmClick = () => {
    onConfirm(userData);
  };

  // check if all required fields are filled
  const isFormValid =
    userData.name.trim() &&
    userData.phone.trim() &&
    userData.street.trim() &&
    userData.city.trim() &&
    userData.country.trim();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-5 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Confirm Your Personal Information 🛡️
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Please make sure your information is correct before proceeding to review your order
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md mb-8">
        {/* Full Name */}
        <div className="w-full">
          <label htmlFor="name" className="block text-left mb-2 text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        
        {/* Email */}
        <div className="w-full">
          <label htmlFor="email" className="block text-left mb-2 text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            value={userData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        
        {/* Phone */}
        <div className="w-full">
          <label htmlFor="phone" className="block text-left mb-2 text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Street */}
        <div className="w-full">
          <label htmlFor="street" className="block text-left mb-2 text-gray-700">
            Street <span className="text-red-500">*</span>
          </label>
          <input
            id="street"
            name="street"
            value={userData.street}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter street address"
          />
        </div>

        {/* City */}
        <div className="w-full">
          <label htmlFor="city" className="block text-left mb-2 text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            value={userData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city"
          />
        </div>

        {/* Country */}
        <div className="w-full">
          <label htmlFor="country" className="block text-left mb-2 text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            id="country"
            name="country"
            value={userData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter country"
          />
        </div>
      </div>

      <div>
        <button 
          onClick={handleConfirmClick}
          disabled={!isFormValid}
          className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
            ${isFormValid 
              ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" 
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
        >
          Confirm Information
        </button>
      </div>
    </div>
  );
}

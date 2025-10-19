import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheck, FiLock } from "react-icons/fi";

export default function ConfirmPersonalInfo({ onConfirm, onBack, userInitialData }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (userInitialData)
      setUserData((prev) => ({ ...prev, ...userInitialData }));
  }, [userInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmClick = () => {
    onConfirm(userData);
  };

  const isFormValid =
    userData.street.trim() && userData.city.trim() && userData.country.trim();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#CF848A] to-[#A85C68] rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
          Confirm Your Personal Information
        </h2>
        <p className="text-gray-600 max-w-md text-sm md:text-base">
          Please review and confirm your details before proceeding with your order
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-gray-50 rounded-sm p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiUser className="text-[#CF848A] text-lg" />
              Personal Info
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              <FiLock className="text-xs" />
              <span>Read-only</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  value={userData.name}
                  disabled
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  disabled
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <FiMapPin className="text-[#CF848A]" />
            Shipping Address
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="street"
                  name="street"
                  value={userData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF848A] focus:border-transparent transition-all duration-200"
                  placeholder="Enter street address"
                />
                <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                value={userData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF848A] focus:border-transparent transition-all duration-200"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                id="country"
                name="country"
                value={userData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF848A] focus:border-transparent transition-all duration-200"
                placeholder="Enter country"
              />
            </div>
            {!isFormValid && (
              <p className="text-xs text-gray-500 text-center md:text-left max-w-xs">
                Please fill in all required fields marked with *
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-5xl md:flex-row items-center md:items-start justify-between gap-6 mt-1 w-full">
        <div className="w-full md:w-auto">
          <div className="p-4 bg-blue-50 rounded-sm border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">!</span>
              </div>
              <p className="text-blue-700 text-xs text-left leading-relaxed">
                Your information is secure and will only be used for order processing and delivery purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={onBack}
            className="px-8 py-4 rounded-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300 shadow-sm w-full md:w-auto"
          >
            Back
          </button>

          <button
            onClick={handleConfirmClick}
            disabled={!isFormValid}
            className={`px-8 py-4 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 justify-center w-full md:w-auto
        ${isFormValid
                ? "bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white hover:from-[#A85C68] hover:to-[#CF848A] transform  focus:ring-[#CF848A] shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm"
              }`}
          >
            <FiCheck className="text-lg" />
            Confirm Information
          </button>
        </div>
      </div>

    </div>
  );
}

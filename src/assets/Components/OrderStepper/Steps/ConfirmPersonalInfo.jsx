import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheck, FiLock, FiHome, FiAlertCircle, FiTruck, FiPackage } from "react-icons/fi";

export default function ConfirmPersonalInfo({
  onConfirm,
  onBack,
  userInitialData,
  hasToken = false,
  initialDeliveryMethod = null
}) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDeliveryMethod = () => {
      if (initialDeliveryMethod && ["delivery", "pickup"].includes(initialDeliveryMethod)) {
        setDeliveryMethod(initialDeliveryMethod);
        return;
      }

      try {
        const savedMethod = localStorage.getItem("cartDeliveryOption");
        if (savedMethod && ["delivery", "pickup"].includes(savedMethod)) {
          setDeliveryMethod(savedMethod);
        } else {
          setDeliveryMethod("delivery");
        }
      } catch (error) {
        console.error("Error reading delivery method from localStorage:", error);
        setDeliveryMethod("delivery");
      }
    };

    fetchDeliveryMethod();
  }, [initialDeliveryMethod]);

  useEffect(() => {
    if (userInitialData) {
      const normalizedData = {
        name: userInitialData.name || "",
        email: userInitialData.email || "",
        phone: userInitialData.phone || "",
        street: userInitialData.street ||
          userInitialData.address?.street ||
          userInitialData.address?.address ||
          "",
        city: userInitialData.city ||
          userInitialData.address?.city ||
          "",
        country: userInitialData.country ||
          userInitialData.address?.country ||
          "",
      };

      setUserData(normalizedData);
    }
  }, [userInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, '');
      const limitedValue = numericValue.slice(0, 11);
      setUserData((prev) => ({ ...prev, [name]: limitedValue }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!hasToken) {
      if (!userData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (userData.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      }
      if (!userData.email.trim()) {
        newErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email.trim())) {
          newErrors.email = "Please enter a valid email address";
        }
      }
      if (!userData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else {
        const cleanPhone = userData.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 11) {
          newErrors.phone = "Phone number must be 11 digits";
        } else if (!/^(010|011|012|015)\d{8}$/.test(cleanPhone)) {
          newErrors.phone = "Must be a valid Egyptian number (010, 011, 012, 015)";
        }
      }
    }

    if (deliveryMethod === "delivery") {
      if (!userData.street.trim()) {
        newErrors.street = "Street address is required";
      } else if (userData.street.trim().length < 5) {
        newErrors.street = "Please enter a complete street address";
      }

      if (!userData.city.trim()) {
        newErrors.city = "City is required";
      } else if (userData.city.trim().length < 2) {
        newErrors.city = "Please enter a valid city name";
      }

      if (!userData.country.trim()) {
        newErrors.country = "Country is required";
      } else if (userData.country.trim().length < 2) {
        newErrors.country = "Please enter a valid country name";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmClick = () => {
    if (!validateForm()) {
      return;
    }

    const formattedPhone = userData.phone.replace(/\D/g, '');

    const confirmedData = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      phone: formattedPhone,
      deliveryMethod: deliveryMethod,
      ...(deliveryMethod === "delivery" && {
        street: userData.street.trim(),
        city: userData.city.trim(),
        country: userData.country.trim(),
        address: {
          street: userData.street.trim(),
          city: userData.city.trim(),
          country: userData.country.trim()
        }
      })
    };
    onConfirm(confirmedData);
  };

  const isFormValid = () => {
    if (!hasToken) {
      const nameValid = userData.name.trim().length >= 3;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim());
      const phoneValid = /^(010|011|012|015)\d{8}$/.test(userData.phone.replace(/\D/g, ''));

      if (!(nameValid && emailValid && phoneValid)) {
        return false;
      }
    }

    if (deliveryMethod === "delivery") {
      const addressValid = userData.street.trim() &&
        userData.city.trim() &&
        userData.country.trim();
      return addressValid;
    }

    return true;
  };

  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full px-4 py-3 pl-11 border focus:outline-none transition-all duration-200";

    if (hasToken && !["street", "city", "country"].includes(fieldName)) {
      return `${baseClass} border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed`;
    }

    if (errors[fieldName]) {
      return `${baseClass} border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent`;
    }

    return `${baseClass} border-gray-300 focus:ring-2 focus:ring-[#CF848A] focus:border-transparent`;
  };

  const formatPhoneDisplay = (value) => {
    if (!value) return "";

    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 3) {
      return cleanValue;
    } else if (cleanValue.length <= 6) {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`;
    } else {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 11)}`;
    }
  };

  const renderMethodBadge = () => {
    if (deliveryMethod === "delivery") {
      return (
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
          <FiTruck className="text-blue-600 text-sm" />
          <span className="text-blue-700 text-sm font-medium">Delivery to your address</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
          <FiPackage className="text-amber-600 text-sm" />
          <span className="text-amber-700 text-sm font-medium">Store Pickup</span>
        </div>
      );
    }
  };

  const renderAddressSection = () => {
    if (deliveryMethod === "delivery") {
      return (
        <div className="bg-white p-4 sm:p-6 border border-gray-200 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <FiMapPin className="text-[#CF848A]" />
            Shipping Address
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Street Address <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(at least 5 characters)</span>
              </label>
              <div className="relative">
                <input
                  name="street"
                  value={userData.street}
                  onChange={handleChange}
                  required={deliveryMethod === "delivery"}
                  className={getFieldClassName("street")}
                  placeholder="123 Main Street, Building, Apartment"
                  minLength={5}
                  maxLength={100}
                />
                <FiHome className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.street && (
                <p className="text-red-500 text-sm mt-1 text-left flex items-center gap-1">
                  <FiAlertCircle className="text-xs" /> {errors.street}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  required={deliveryMethod === "delivery"}
                  className={getFieldClassName("city").replace("pl-11", "px-4")}
                  placeholder="Enter city"
                  minLength={2}
                  maxLength={50}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 text-left flex items-center gap-1">
                    <FiAlertCircle className="text-xs" /> {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  name="country"
                  value={userData.country}
                  onChange={handleChange}
                  required={deliveryMethod === "delivery"}
                  className={getFieldClassName("country").replace("pl-11", "px-4")}
                  placeholder="Enter country"
                  minLength={2}
                  maxLength={50}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1 text-left flex items-center gap-1">
                    <FiAlertCircle className="text-xs" /> {errors.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 border border-amber-200 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <FiPackage className="text-amber-600" />
            Pickup Location
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-white border border-amber-100 rounded-lg">
              <h4 className="text-base font-semibold text-gray-800 mb-2">Main Store</h4>
              <p className="text-gray-600 text-sm mb-3">
                <span className="font-medium">Address:</span> New Cairo
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FiPhone className="text-xs" />
                  <span>01234567890</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FiMapPin className="text-xs" />
                  <span>Open 10AM - 10PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderValidationMessages = () => {
    if (!isFormValid()) {
      return (
        <div className="p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-amber-800 text-sm font-medium mb-2">
                Please fill in all required fields:
              </p>
              <ul className="text-amber-700 text-xs list-disc pl-4 space-y-1">
                {!hasToken && (
                  <>
                    <li>Name: At least 3 characters</li>
                    <li>Email: Valid email format</li>
                    <li>Phone: Valid Egyptian number (010/011/012/015 + 8 digits)</li>
                  </>
                )}
                {deliveryMethod === "delivery" && (
                  <>
                    <li>Street Address: At least 5 characters</li>
                    <li>City: At least 2 characters</li>
                    <li>Country: At least 2 characters</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-green-50 border border-green-200">
        <div className="flex items-center gap-3">
          <FiCheck className="text-green-600" />
          <div>
            <p className="text-green-800 text-sm font-medium">
              ✓ All information is complete and valid
            </p>
            {deliveryMethod === "delivery" && userData.street && (
              <p className="text-green-700 text-xs mt-1">
                Delivery to: {userData.street}, {userData.city}, {userData.country}
              </p>
            )}
            {deliveryMethod === "pickup" && (
              <p className="text-green-700 text-xs mt-1">
                Pickup at: Main Store
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (isFormValid()) {
      return (
        <div className="w-full max-w-6xl mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <FiUser className="text-blue-600" />
              <h4 className="text-sm font-medium text-blue-800">Information Summary</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-gray-600 text-xs mb-1">Name</p>
                <p className="text-blue-700 text-sm font-medium">{userData.name || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Phone</p>
                <p className="text-blue-700 text-sm font-medium">{formatPhoneDisplay(userData.phone) || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">
                  {deliveryMethod === "delivery" ? "Delivery Address" : "Pickup Location"}
                </p>
                <p className="text-blue-700 text-sm font-medium">
                  {deliveryMethod === "delivery"
                    ? `${userData.street || "Not set"}, ${userData.city || ""}, ${userData.country || ""}`
                    : "Main Store - Cairo, 123 Nile Street"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-6 text-center">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#CF848A] to-[#A85C68] flex items-center justify-center mx-auto mb-4 rounded-full">
          {deliveryMethod === "delivery" ? (
            <FiTruck className="text-white text-2xl" />
          ) : (
            <FiPackage className="text-white text-2xl" />
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
          {deliveryMethod === "delivery"
            ? "Shipping Information"
            : "Pickup Information"}
        </h2>
        <p className="text-gray-600 max-w-md text-sm md:text-base">
          {deliveryMethod === "delivery"
            ? hasToken
              ? "Review your details for delivery"
              : "Enter your details for delivery"
            : hasToken
              ? "Review your details for store pickup"
              : "Enter your details for store pickup"
          }
        </p>

        {renderMethodBadge()}

        {hasToken && (
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <FiLock className="text-green-600 text-sm" />
            <span className="text-green-700 text-sm font-medium">Account detected - Some fields are protected</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 sm:p-6 border border-gray-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiUser className="text-[#CF848A] text-lg" />
              Personal Information
            </h3>
            {hasToken && (
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-200 px-2 py-1">
                <FiLock className="text-xs" />
                <span>Protected</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Full Name <span className="text-red-500">{!hasToken && "*"}</span>
                {!hasToken && <span className="text-gray-500 text-xs ml-1">(at least 3 characters)</span>}
              </label>
              <div className="relative">
                <input
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={hasToken}
                  required={!hasToken}
                  className={getFieldClassName("name")}
                  placeholder="Enter your full name"
                  minLength={3}
                  maxLength={50}
                />
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 text-left flex items-center gap-1">
                  <FiAlertCircle className="text-xs" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Email Address <span className="text-red-500">{!hasToken && "*"}</span>
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={hasToken}
                  required={!hasToken}
                  className={getFieldClassName("email")}
                  placeholder="example@domain.com"
                />
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-left flex items-center gap-1">
                  <FiAlertCircle className="text-xs" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-left mb-2 text-gray-700 text-sm font-medium">
                Phone Number <span className="text-red-500">{!hasToken && "*"}</span>
                {!hasToken && <span className="text-gray-500 text-xs ml-1">(Egyptian number)</span>}
              </label>
              <div className="relative">
                <input
                  name="phone"
                  value={formatPhoneDisplay(userData.phone)}
                  onChange={handleChange}
                  disabled={hasToken}
                  required={!hasToken}
                  className={getFieldClassName("phone")}
                  placeholder="010-XXX-XXXX"
                  maxLength={13}
                />
                <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 text-left flex items-center gap-1">
                  <FiAlertCircle className="text-xs" /> {errors.phone}
                </p>
              )}
              {!hasToken && !errors.phone && userData.phone && (
                <p className="text-gray-500 text-xs mt-1 text-left">
                  Format: 010, 011, 012, or 015 followed by 8 digits
                </p>
              )}
            </div>
          </div>
        </div>

        {renderAddressSection()}
      </div>

      <div className="w-full max-w-6xl mb-6">
        {renderValidationMessages()}
      </div>

      {renderSummary()}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-2 w-full max-w-6xl">

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto ml-auto">
          <button
            onClick={onBack}
            className="px-6 py-3.5 font-medium focus:outline-none transition-all duration-200 flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 w-full sm:w-auto"
          >
            Back to Cart
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={!isFormValid()}
            className={`px-6 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 justify-center w-full sm:w-auto
        ${isFormValid()
                ? deliveryMethod === "delivery"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-md"
                  : "bg-gradient-to-r from-[#CF848A] to-[#a76e72] text-white hover:from-[#986468] hover:to-[#c18e91] focus:ring-[#CF848A] shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <FiCheck className="text-lg" />
            {deliveryMethod === "delivery" ? "Confirm Delivery" : "Confirm Pickup"}
          </button>
        </div>
      </div>
    </div>
  );
}
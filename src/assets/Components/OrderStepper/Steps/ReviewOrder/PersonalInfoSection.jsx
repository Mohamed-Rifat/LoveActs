import React from "react";
import { FiUser, FiMail, FiPhone, FiPackage, FiShoppingBag, FiMapPin } from "react-icons/fi";

const PersonalInfoSection = ({ userData, deliveryOption }) => {
    return (
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 select-none cursor-not-allowed">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="text-gray-700 text-xl" />
                Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                    <FiUser className="text-gray-400 mt-1 text-lg" />
                    <div>
                        <p className="text-sm font-medium text-gray-600">Full Name</p>
                        <p className="text-gray-900 font-semibold mt-1">
                            {userData.name || "Not specified"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                    <FiMail className="text-gray-400 mt-1 text-lg" />
                    <div>
                        <p className="text-sm font-medium text-gray-600">Email Address</p>
                        <p className="text-gray-900 font-semibold mt-1">
                            {userData.email || "Not specified"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                    <FiPhone className="text-gray-400 mt-1 text-lg" />
                    <div>
                        <p className="text-sm font-medium text-gray-600">Phone Number</p>
                        <p className="text-gray-900 font-semibold mt-1">
                            {userData.phone || "Not specified"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                    {deliveryOption === "delivery" ? (
                        <FiPackage className="text-gray-500 mt-1 text-lg" />
                    ) : (
                        <FiShoppingBag className="text-gray-500 mt-1 text-lg" />
                    )}
                    <div>
                        <p className="text-sm font-medium text-gray-600">Delivery Method</p>
                        <p className="text-gray-900 font-semibold mt-1">
                            {deliveryOption === "delivery" ? "Home Delivery" : "Store Pickup"}
                        </p>
                    </div>
                </div>

                {deliveryOption === "delivery" && (
                    <div className="sm:col-span-2 flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                        <FiMapPin className="text-gray-400 mt-1 text-lg" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Delivery Address</p>
                            <p className="text-gray-900 font-semibold mt-1">
                                {userData.street && userData.city && userData.country
                                    ? `${userData.street}, ${userData.city}, ${userData.country}`
                                    : "Address not specified"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PersonalInfoSection;

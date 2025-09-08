import React, { useContext, useState } from "react";
import { CartContext } from "../../../Context/CartContext";

export default function ReviewOrder({ selectedDrink, selectedCafe, onConfirm, onBack, userData }) {
  const { cart } = useContext(CartContext);
  const [selectedTime, setSelectedTime] = useState("");

  const deliveryTimes = [
    { id: "10-12", label: "10:00 AM - 12:00 PM", value: "10-12" },
    { id: "12-2", label: "12:00 PM - 2:00 PM", value: "12-2" },
    { id: "2-4", label: "2:00 PM - 4:00 PM", value: "2-4" },
    { id: "4-6", label: "4:00 PM - 6:00 PM", value: "4-6" },
    { id: "6-8", label: "6:00 PM - 8:00 PM", value: "6-8" }
  ];

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      alert("Please select a pickup time");
      return;
    }
    onConfirm(selectedTime);
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = totalPrice + (selectedDrink?.price || 0);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Review Your Order 📝
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-blue-700 flex items-center justify-center mb-4">
              <span className="mr-2">🛡️</span>
              Your Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  value={userData?.name || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  value={userData?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  value={userData?.phone || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-blue-700 flex items-center justify-center mb-4">
              <span className="mr-2">⏰</span>
              Choose Pickup Time
            </h3>

            <div className="mt-4">
              <p className="text-center text-lg font-medium mb-4">Available Pickup Times</p>
              <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3">
                {deliveryTimes.map((time) => (
                  <div key={time.id} className="min-w-[140px]">
                    <label className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      selectedTime === time.value
                        ? 'border-blue-600 bg-blue-100 shadow-md'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      <input
                        type="radio"
                        name="deliveryTime"
                        value={time.value}
                        checked={selectedTime === time.value}
                        onChange={handleTimeChange}
                        className="sr-only"
                      />
                      <span className="text-center block">{time.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-blue-700 flex items-center justify-center mb-4">
              <span className="mr-2">📦</span>
              Your Order Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">
                  Selected Products
                </h4>
                <div className="space-y-3">
                  {cart?.length ? (
                    cart.map((item, i) => (
                      <div key={i} className="border-b border-gray-200 pb-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} | Price: {item.price} EGP
                          </p>
                        </div>
                        <p className="font-bold">{item.price * item.quantity} EGP</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="border-t-2 border-blue-600 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Cart Total:</span>
                      <span>{totalPrice} EGP</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">
                    Selected Drink
                  </h4>
                  
                  {selectedCafe && selectedDrink ? (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">☕</span>
                        <h5 className="text-lg font-semibold">{selectedCafe.name}</h5>
                      </div>
                      
                      <div className="pl-5">
                        <div className="flex justify-between">
                          <span>{selectedDrink.productName}</span>
                          <span className="font-bold">${selectedDrink.price}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No drink selected</p>
                  )}
                </div>

                {selectedTime && (
                  <div>
                    <h4 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">
                      Pickup Time
                    </h4>
                    <div className="bg-green-100 p-4 rounded-xl text-green-800">
                      <div className="flex items-center">
                        <span className="mr-2">⏰</span>
                        <p className="font-bold">
                          {deliveryTimes.find(t => t.value === selectedTime)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(cart.length > 0 || selectedDrink) && (
                  <div className="bg-blue-700 p-4 rounded-xl text-white">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>{finalTotal} EGP</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTime}
            className={`px-8 py-3 rounded-lg transition-colors ${
              selectedTime
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";
import { useToken } from "../../../Context/TokenContext/TokenContext";
import { FiCheckCircle } from "react-icons/fi";

export default function DeliveryStatus() {
  const navigate = useNavigate();
  const { clearCart, clearGuestCart } = useContext(CartContext);
  const { token } = useToken();
  const [orderCompleted, setOrderCompleted] = useState(false);

  useEffect(() => {
    const processOrder = async () => {
      try {
        if (token) {
          await clearCart();
        } else {
          await clearGuestCart();
        }
        
        setTimeout(() => {
          setOrderCompleted(true);
          setTimeout(() => {
            navigate("/", {
              replace: true,
              state: { orderCompleted: true }
            });
          }, 3000);
        }, 2000);
      } catch (error) {
        console.error("❌ Error clearing cart:", error);
      }
    };

    const timer = setTimeout(() => {
      processOrder();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, clearCart, clearGuestCart, token]);

  useEffect(() => {
    const bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = "100%";
  }, []);

  if (orderCompleted) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Order Confirmed! ✅
          </h2>
          <p className="text-gray-600 mb-4">
            Your order has been placed successfully!
          </p>
          <p className="text-gray-500 mb-6">
            Thank you for your purchase. You will receive your order shortly.
          </p>
          <div className="animate-pulse text-sm text-blue-600">
            Redirecting to home page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[420px] flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Your order is on the way 🚚
        </h2>
        <p className="text-gray-600 mb-6">
          Please wait a moment while your order is being processed
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            id="progress-bar"
            className="bg-blue-600 h-2 rounded-full transition-all duration-3000 ease-linear"
            style={{ width: "0%" }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Processing your order...
        </p>
      </div>
    </div>
  );
}
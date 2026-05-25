import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";
import { useToken } from "../../../Context/TokenContext/TokenContext";
import { FiCheckCircle } from "react-icons/fi";

export default function DeliveryStatus({ orderNumber, onComplete }) {
  const { clearCart, clearGuestCart } = useContext(CartContext);
  const { token } = useToken();
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const processOrder = async () => {
      if (hasCompleted.current) return;

      try {
        try {
          if (token) {
            await clearCart();
          } else {
            await clearGuestCart();
          }
        } catch (error) {
          console.warn("⚠️ Cart clear failed but continuing:", error.message);
        }

        setOrderCompleted(true);
        hasCompleted.current = true;
        setTimeout(() => {
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          }
        }, 2000);

      } catch (error) {
        console.error("❌ Error in processOrder:", error);
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2000);
        }
      }
    };

    const timer = setTimeout(() => {
      processOrder();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [clearCart, clearGuestCart, token, onComplete]);

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
          {orderNumber && (
            <p className="text-gray-500 mb-2">
              Order Number: <strong className="text-[#CF848A]">{orderNumber}</strong>
            </p>
          )}
          <p className="text-gray-500">
            Thank you for your purchase.
          </p>
          <div className="mt-6 text-sm text-blue-600">
            Preparing your order summary...
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
            className="bg-gradient-to-r from-[#CF848A] to-[#A85C68] h-2 rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Processing your order...
        </p>
      </div>
    </div>
  );
}
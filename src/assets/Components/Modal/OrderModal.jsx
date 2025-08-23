// components/Modal/OrderModal.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OrderModal({ isOpenOrder, setIsOpenOrder, cartId, totalPrice }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    paymentMethod: "cash"
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/checkout`,
        {
          cartId,
          address: formData.address,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod
        },
        {
          headers: {
            Authorization: `User ${token}`
          }
        }
      );
      
      toast.success('Order placed successfully!');
      setIsOpenOrder(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error('Failed to place order');
    }
    
    setLoading(false);
  };

  if (!isOpenOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Your Order</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Shipping Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit Card</option>
            </select>
          </div>
          
          <div className="mb-4 p-2 bg-gray-100 rounded-md">
            <p className="font-semibold">Total: {totalPrice} EGP</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpenOrder(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
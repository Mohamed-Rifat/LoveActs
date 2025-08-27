import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToken } from './TokenContext/TokenContext';
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, removeToken } = useToken();
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState({});
  const [loading, setLoading] = useState(true);

  const getCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://flowers-vert-six.vercel.app/api/cart/get-user-cart",
        { headers: { Authorization: `User ${token}` } } // 👈 تعديل هنا
      );
      setItems(response.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) removeToken();
    } finally {
      setLoading(false);
    }
  };

const addToCart = async (productId, quantity = 1) => {
  if (!token) return toast.error("You must be logged in");
  setPending(prev => ({ ...prev, [`add-${productId}`]: true }));
  try {
    const response = await axios.post(
      "https://flowers-vert-six.vercel.app/api/cart/add-to-cart",
      { productId, quantity },
      { headers: { Authorization: `User ${token}` } }
    );

    setItems(response.data || []); 
    toast.success("Added to cart");
  } catch (err) {
    console.error("Error adding to cart:", err);
    toast.error(err.response?.data?.message || "Failed to add to cart");
    if (err.response?.status === 401) removeToken();
  } finally {
    setPending(prev => ({ ...prev, [`add-${productId}`]: false }));
  }
};


  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `https://flowers-vert-six.vercel.app/api/cart/remove-from-cart/${productId}`,
        { headers: { Authorization: `User ${token}` } } 
      );
      setItems(response.data || []);
      toast.success("Removed from cart");
    } catch (err) {
      console.error("Error removing from cart:", err);
      if (err.response?.status === 401) removeToken();
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      const response = await axios.patch(
        `https://flowers-vert-six.vercel.app/api/cart/update-quantity/${productId}`,
        { quantity },
        { headers: { Authorization: `User ${token}` } } 
      );
      setItems(response.data || []);
    } catch (err) {
      console.error("Error updating quantity:", err);
      if (err.response?.status === 401) removeToken();
    }
  };

  useEffect(() => {
    getCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, pending, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

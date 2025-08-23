// Context/CartContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [cartId, setCartId] = useState(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const addToCart = async (productId, quantity) => {
    try {
      const { data } = await axios.post(
        `https://flowers-vert-six.vercel.app/api/cart/add-to-cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `User ${getToken()}`,
          },
        }
      );
      setNumOfCartItems(prev => prev + quantity);
      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const getCart = async () => {
    try {
      const { data } = await axios.get(
        `https://flowers-vert-six.vercel.app/api/cart/get-user-cart`,
        {
          headers: {
            Authorization: `User ${getToken()}`,
          },
        }
      );
      setNumOfCartItems(data.data.totalQuantity || 0);
      setCartId(data.data._id);
      return data;
    } catch (error) {
      console.error("Error getting cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.patch(
        `https://flowers-vert-six.vercel.app/api/cart/remove-product-from-cart/${cartId}`,
        { productId },
        {
          headers: {
            Authorization: `User ${getToken()}`,
          },
        }
      );
      setNumOfCartItems(data.data.totalQuantity || 0);
      return data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.patch(
        `https://flowers-vert-six.vercel.app/api/cart/update-product-quantity/${cartId}`,
        { productId, quantity },
        {
          headers: {
            Authorization: `User ${getToken()}`,
          },
        }
      );
      setNumOfCartItems(data.data.totalQuantity || 0);
      return data;
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await axios.delete(
        `https://flowers-vert-six.vercel.app/api/cart/clear-cart/${cartId}`,
        {
          headers: {
            Authorization: `User ${getToken()}`,
          },
        }
      );
      setNumOfCartItems(0);
      return data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const value = {
    numOfCartItems,
    setNumOfCartItems,
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartId,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
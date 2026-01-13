import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useToken } from "../Context/TokenContext/TokenContext";
import { toast } from "react-hot-toast";

export const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { token } = useToken();

  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState({});

  const API = "https://flowers-vert-six.vercel.app/api/cart";


  const getHeaders = () => {
    if (token) return { Authorization: `Bearer ${token}` };

    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) throw new Error("Missing sessionId");

    return { sessionid: sessionId };
  };

  const getCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/get-user-cart`, {
        headers: getHeaders(),
      });

      setCart(res.data.cart?.products || []);
      setCartId(res.data.cart?._id || null);
      setNumOfCartItems(res.data.cart?.products?.length || 0);
    } catch (err) {
      if (err.response?.status === 404) {
        setCart([]);
        setCartId(null);
        setNumOfCartItems(0);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };


  const createGuestSession = async () => {
    try {
      const response = await axios.get("https://flowers-vert-six.vercel.app/get-seesion-id");
      const sessionId = response.data.sessionId;
      localStorage.setItem("sessionId", sessionId);
      console.log("New guest session created:", sessionId);
      return sessionId;
    } catch (error) {
      console.error("Failed to create guest session:", error);
      toast.error("Could not create guest session");
      throw error;
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setPending((p) => ({ ...p, [`add-${productId}`]: true }));

    try {
      let headers;
      try {
        headers = getHeaders();
      } catch (error) {
        if (error.message === "Missing sessionId" && !token) {
          throw new Error("NEED_SESSION");
        } else {
          throw error;
        }
      }

      await axios.post(
        `${API}/add-to-cart`,
        { productId, quantity },
        { headers }
      );
      await getCart();
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);

      if (err.message === "NEED_SESSION") {
        throw new Error("NEED_SESSION");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setPending((p) => ({ ...p, [`add-${productId}`]: false }));
    }
  };

  const updateCartItem = async (productId, quantity = 1) => {
    try {
      await axios.patch(
        `${API}/remove-product-from-cart/${cartId}`,
        { productId, quantity },
        { headers: getHeaders() }
      );

      await getCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API}/clear-cart`, {
        headers: getHeaders(),
      });

      await getCart();
      toast.success("Cart cleared");
    } catch (err) {
      console.error(err);
    }
  };
  const clearGuestCart = async () => {
    try {
      try {
        await axios.delete(`${API}/clear-cart`, {
          headers: getHeaders(),
        });
      } catch (err) {
        console.log("Could not clear existing cart:", err.message);
      }

      localStorage.removeItem("sessionId");

      const response = await axios.get("https://flowers-vert-six.vercel.app/get-seesion-id");
      const newSessionId = response.data.sessionId;
      localStorage.setItem("sessionId", newSessionId);

      setCart([]);
      setCartId(null);
      setNumOfCartItems(0);

      toast.success("Cart cleared Successfully");
      return newSessionId;
    } catch (error) {
      console.error("Failed to clear guest cart:", error);
      toast.error("Failed to clear cart");
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        numOfCartItems,
        loading,
        pending,
        addToCart,
        updateCartItem,
        clearCart,
        clearGuestCart,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

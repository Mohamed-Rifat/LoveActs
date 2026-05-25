import axios from "axios";
import { createContext, useState, useEffect, useCallback } from "react";
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
    if (!sessionId) return null;

    return { sessionid: sessionId };
  };

  const createGuestSession = async () => {
    try {
      const response = await axios.get("https://flowers-vert-six.vercel.app/get-seesion-id");
      const sessionId = response.data.sessionId;
      localStorage.setItem("sessionId", sessionId);
      return sessionId;
    } catch (error) {
      console.error("Failed to create guest session:", error);
      toast.error("Could not create guest session");
      throw error;
    }
  };

  const getCart = useCallback(async () => {
    setLoading(true);

    if (!token && !localStorage.getItem("sessionId")) {
      try {
        await createGuestSession();
      } catch (error) {
        setLoading(false);
        return;
      }
    }

    const headers = getHeaders();

    if (!headers) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/get-user-cart`, {
        headers: headers,
      });

      setCart(res.data.cart?.products || []);
      setCartId(res.data.cart?._id || null);
      setNumOfCartItems(res.data.cart?.products?.length || 0);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.message?.includes("not found")) {
        setCart([]);
        setCartId(null);
        setNumOfCartItems(0);
      } else {
        console.error("Error fetching cart:", err);
        toast.error("Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const addToCart = async (productId, quantity = 1, drink = null, uniqueId = null, customTimestamp = null) => {
    setPending((p) => ({ ...p, [`add-${productId}`]: true }));

    try {
      let headers = getHeaders();

      if (!headers) {
        const newSessionId = await createGuestSession();
        headers = { sessionid: newSessionId };
      }

      const dataToSend = {
        productId,
        quantity,
        ...(drink && { drink }),
        ...(customTimestamp && { addedAt: customTimestamp }),
        ...(uniqueId && { uniqueId })
      };

      await axios.post(
        `${API}/add-to-cart`,
        dataToSend,
        { headers }
      );

      await getCart();
      toast.success("Added to cart");

      if (drink && customTimestamp) {
        setTimeout(() => {
          verifyDrinkSelection(productId, customTimestamp, drink);
        }, 500);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setPending((p) => ({ ...p, [`add-${productId}`]: false }));
    }
  };

  const verifyDrinkSelection = (productId, timestamp, drink) => {
    try {
      const savedSelections = localStorage.getItem('cartDrinkSelections');
      if (savedSelections) {
        const selections = JSON.parse(savedSelections);
        const expectedKey = `${productId}-0-${timestamp}`;

        if (!selections[expectedKey]) {
          console.warn('⚠️ Drink selection not found, attempting to re-save...');
          const drinkSelectionData = {
            drink: drink,
            selectedAt: new Date().toISOString(),
            productId: productId,
            unitIndex: 0,
            itemTimestamp: timestamp,
            stableKey: expectedKey
          };

          selections[expectedKey] = drinkSelectionData;
          localStorage.setItem('cartDrinkSelections', JSON.stringify(selections));
        } else {
        }
      }
    } catch (error) {
      console.error('Error verifying drink selection:', error);
    }
  };

  const updateCartItem = async (productId, quantity = 1) => {
    if (!cartId) {
      return;
    }

    try {
      await axios.patch(
        `${API}/remove-product-from-cart/${cartId}`,
        { productId, quantity },
        { headers: getHeaders() }
      );

      await getCart();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setCart([]);
        setCartId(null);
        setNumOfCartItems(0);
      } else {
        toast.error("Failed to update cart");
      }
    }
  };

  const removeCartItem = async (productId) => {
    if (!cartId) {
      toast.error("Cart not found");
      return;
    }

    setPending((p) => ({ ...p, [`remove-${productId}`]: true }));

    try {
      await axios.patch(
        `${API}/remove-product-from-cart/${cartId}`,
        { productId, quantity: 0 },
        { headers: getHeaders() }
      );
      await getCart();
      toast.success("Product removed from cart");
    } catch (err) {
      console.error("Error removing product:", err);
      if (err.response?.status === 404) {
        setCart([]);
        setCartId(null);
        setNumOfCartItems(0);
        toast.error("Cart not found");
      } else {
        toast.error("Failed to remove product. Try again.");
      }
    } finally {
      setPending((p) => ({ ...p, [`remove-${productId}`]: false }));
    }
  };

  const clearCart = async () => {
    if (!cartId) {
      toast.error("No cart found");
      return;
    }

    try {
      await axios.delete(`${API}/clear-cart`, {
        headers: getHeaders(),
      });

      await getCart();
      toast.success("Cart cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
    }
  };

  const clearGuestCart = async () => {
    try {
      if (cartId) {
        try {
          await axios.delete(`${API}/clear-cart`, {
            headers: getHeaders(),
          });
        } catch (err) {
        }
      }

      localStorage.removeItem("sessionId");

      const newSessionId = await createGuestSession();

      setCart([]);
      setCartId(null);
      setNumOfCartItems(0);

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
        removeCartItem,
        clearCart,
        clearGuestCart,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
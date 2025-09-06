import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useToken } from "../Context/TokenContext/TokenContext";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token, user } = useToken();
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState({});

  // get user cart
  async function getCart() {
    if (!token) return;
    if (user?.role !== "User") return;

    setLoading(true);
    try {
      const res = await axios.get(
        "https://flowers-vert-six.vercel.app/api/cart/get-user-cart",
        { headers: { Authorization: `User ${token}` } }
      );
      setCart(res.data.cart?.products || []);
      setCartId(res.data.cart?._id || null);
      setNumOfCartItems(res.data.cart?.products?.length || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }

  // add to cart
  async function addToCart(productId, quantity = 1) {
    if (!token) return;
    setPending(prev => ({ ...prev, [`add-${productId}`]: true }));
    try {
      await axios.post(
        "https://flowers-vert-six.vercel.app/api/cart/add-to-cart",
        { productId, quantity },
        { headers: { Authorization: `User ${token}` } }
      );
      await getCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setPending(prev => ({ ...prev, [`add-${productId}`]: false }));
    }
  }

async function removeFromCart(cartItemId, quantity = 1) {
  if (!token || !cartId) return null;

  try {
    console.log("---- REMOVE FROM CART ----");
    console.log("cartId:", cartId);
    console.log("cartItemId:", cartItemId);
    console.log("quantity:", quantity);

    const res = await axios.patch(
      `https://flowers-vert-six.vercel.app/api/cart/remove-product-from-cart/${cartId}`,
      { productId: cartItemId, quantity }, 
      { headers: { Authorization: `User ${token}` } }
    );
    await getCart();
    return res.data;
  } catch (err) {
    console.error("Error removing/updating product from cart:", err);
    return null;
  }
}


  async function clearAllCart() {
    if (!token) return null;
    try {
      const res = await axios.delete(
        "https://flowers-vert-six.vercel.app/api/cart/clear-cart",
        { headers: { Authorization: `User ${token}` } }
      );
      await getCart();
      return res.data;
    } catch (err) {
      console.error("Error clearing all cart:", err);
      return null;
    }
  }

  useEffect(() => {
    getCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        numOfCartItems,
        loading,
        pending,
        addToCart,
        removeFromCart,
        clearAllCart,
        setCart,
        setNumOfCartItems,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

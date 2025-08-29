import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { TokenContext } from "./TokenContext/TokenContext";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useContext(TokenContext);
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState({});

  const headers = {
    Authorization: `User ${token || localStorage.getItem("token")}`,
  };

  async function getCart() {
    const storedToken = token || localStorage.getItem("token");
    console.log("Token used for cart:", storedToken);

    if (!storedToken) return;
    setLoading(true);
    try {
      const res = await axios.get(
        "https://flowers-vert-six.vercel.app/api/cart/get-user-cart",
        { headers: { Authorization: `User ${storedToken}` } }
      );
      console.log("Cart response:", res.data);
      
    
      setCart(res.data.cart?.products || []);
      setCartId(res.data.cart?._id || null); 
      setNumOfCartItems(res.data.cart?.products?.length || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId, quantity = 1) {
    if (!token && !localStorage.getItem("token")) return;
    setPending(prev => ({ ...prev, [`add-${productId}`]: true }));
    try {
      await axios.post(
        "https://flowers-vert-six.vercel.app/api/cart/add-to-cart",
        { productId, quantity },
        { headers }
      );
      await getCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setPending(prev => ({ ...prev, [`add-${productId}`]: false }));
    }
  }

async function removeFromCart(productId, quantity = 1) {
  const storedToken = token || localStorage.getItem("token");
  console.log("=== Attempting to remove product from cart ===");
  console.log("Cart ID:", cartId);
  console.log("Product ID passed:", productId);
  console.log("Quantity:", quantity);
  console.log("Token:", storedToken);

  if (!storedToken || !cartId) {
    console.error("Missing token or cart ID");
    return null;
  }

  try {
    const res = await axios.patch(
      `https://flowers-vert-six.vercel.app/api/cart/remove-product-from-cart/${cartId}`,
      { productId, quantity },   
      { headers: { Authorization: `User ${storedToken}` } }
    );

    console.log("Remove product response:", res.data);

    await getCart();
    return res.data;
  } catch (err) {
    console.error("Error removing/updating product from cart:", err);
    return null;
  }
}

  async function clearCart() {
    const storedToken = token || localStorage.getItem("token");
    
    if (!storedToken || !cartId) {
      console.error("Missing token or cart ID");
      return null;
    }

    try {
      const res = await axios.delete(
        `https://flowers-vert-six.vercel.app/api/cart/clear-cart/${cartId}`,
        { headers: { Authorization: `User ${storedToken}` } }
      );
console.log("Current cart products:", cart.map(p => ({
  _id: p._id,
  productId: p.productId?._id
})));

      console.log("Clear cart response:", res.data);
      await getCart(); 
      return res.data;
    } catch (err) {
      console.error("Error clearing cart:", err);
      return null;
    }
  }

  useEffect(() => {
    console.log("Fetching cart...");
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
        clearCart,
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
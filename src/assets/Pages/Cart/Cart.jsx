import Loader from "../../Components/Loader/Loader";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/UseCart";

export default function Cart() {
  const { cart: items = [], loading, addToCart, removeFromCart, pending, numOfCartItems, clearAllCart, setCart, setNumOfCartItems } = useCart();
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const getProductId = (item) => item?.productId?._id || item?._id || null;
  const getProductData = (item) => (item.productId && typeof item.productId === 'object' ? item.productId : item);
  const formatPrice = (price) => parseFloat(price).toFixed(2);

  // تحديث الكميات تلقائياً عند تغير العناصر
  useEffect(() => {
    if (!items) return;
    const initialQuantities = {};
    items.forEach(item => {
      const productId = getProductId(item);
      initialQuantities[productId] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [items]);

  const handleClearCart = async () => {
    setQuantities({});
    setCart([]);
    setNumOfCartItems(0);
    await clearAllCart();
  }



  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return; // منع تقليل أقل من 1
    const currentQuantity = quantities[cartItemId];
    if (newQuantity < currentQuantity) {
      removeFromCart(cartItemId, 1);
    } else {
      addToCart(cartItemId, 1);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const subtotal = useMemo(() => {
    return (items || []).reduce((total, item) => {
      const product = getProductData(item);
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const tax = useMemo(() => subtotal * 0.14, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  if (loading) return <Loader />;

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FiShoppingCart className="text-4xl text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              0
            </div>
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            Your cart is empty
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-8"
          >
            Looks like you haven't added any items to your cart yet.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <FiArrowLeft className="transform rotate-180" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-600 bg-green-100 px-3 py-1 rounded-full font-medium">
            {numOfCartItems} {numOfCartItems === 1 ? 'item' : 'items'}
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <AnimatePresence>
                {(items || []).map((item, index) => {
                  const product = getProductData(item);
                  const productId = getProductId(item);
                  const isPending = pending?.[`add-${productId}`];

                  return (
                    <motion.div
                      key={productId || index}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b border-gray-100 last:border-b-0 ${isPending ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="p-6 flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            src={product.imageCover || product.image || "/Logo.PNG"}
                            alt={product.title || product.name}
                            className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-lg shadow-md bg-white p-2"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo.png";
                            }}
                          />
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {product.title || product.name}
                          </h3>
                          {product.category?.name && (
                            <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
                          )}
                          <p className="text-xl font-bold text-green-600 mb-4">${formatPrice(product.price)}</p>

                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <motion.button
                                whileHover={{ backgroundColor: "#f0f0f0" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(productId, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isPending}
                                className="p-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <FiMinus className="text-gray-700" />
                              </motion.button>
                              <span className="px-4 py-2 bg-white text-gray-900 font-medium min-w-[3rem] text-center">
                                {isPending ? "..." : item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ backgroundColor: "#f0f0f0" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(productId, item.quantity + 1)}
                                disabled={isPending}
                                className="p-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <FiPlus className="text-gray-700" />
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveItem(productId)}
                              disabled={isPending}
                              className="flex items-center gap-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <FiTrash2 />
                              Remove
                            </motion.button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <p className="text-lg font-bold text-gray-900">
                            ${formatPrice((typeof product.price === 'string' ? parseFloat(product.price) : product.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                <FiArrowLeft />
                Continue Shopping
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClearCart()}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-4"
              >
                <FiTrash2 />
                Clear Cart
              </motion.button>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-medium">${formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-green-600">${formatPrice(total)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#059669" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <FiCreditCard />
                Proceed to Checkout
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You won't be charged until the next step
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

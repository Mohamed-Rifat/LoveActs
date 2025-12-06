import Loader from "../../Components/Loader/Loader";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/UseCart";
import axios from "axios";
import { useToken } from '../../Context/TokenContext/TokenContext';

export default function Cart() {
  const { cart: items = [], loading, addToCart, removeFromCart, pending, numOfCartItems, clearAllCart, setCart, setNumOfCartItems } = useCart();
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { token } = useToken();
  const getProductId = (item) => item?.productId?._id || item?._id || null;
  const getProductData = (item) => (item.productId && typeof item.productId === 'object' ? item.productId : item);
  const formatPrice = (price) => parseFloat(price).toFixed(2);
  const [showModal, setShowModal] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const deliveryFee = 50;

  const subtotal = useMemo(() => {
    return (items || []).reduce((total, item) => {
      const product = getProductData(item);
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const total = useMemo(() => subtotal, [subtotal]);

  const finalTotal = useMemo(() => {
    return deliveryOption === "delivery" ? total + deliveryFee : total;
  }, [deliveryOption, total]);

  const handleProceedClick = () => {
    setShowModal(true);
  };

  const handleConfirmOption = () => {
    setIsConfirmed(true);
    setShowModal(false);
    navigate("/checkout", { state: { deliveryOption, finalTotal } });
  };

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
            <div className="w-24 h-24 bg-[#FDE9EE] rounded-full flex items-center justify-center mx-auto">
              <FiShoppingCart className="text-4xl text-[#CF848A]" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#FDE9EE] text-[#CF848A] rounded-full flex items-center justify-center font-bold">
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
              className="inline-flex items-center gap-2 bg-[#FDE9EE] text-[#CF848A] font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
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
              className="bg-white shadow-md overflow-hidden"
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
                      className={`border-b border-gray-100 last:border-b-0 ${isPending ? "opacity-50" : "opacity-100"}`}
                    >
                      <div className="p-4 sm:p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between gap-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0"
                          >
                            <img
                              src={product.imageCover || product.image || "/Logo.PNG"}
                              alt={product.title || product.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200 bg-gray-50 shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/logo.png";
                              }}
                            />
                          </motion.div>

                          <div className="flex flex-col flex-grow justify-between w-full">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                {product.title || product.name}
                              </h3>

                              {product.category?.name && (
                                <p className="text-sm text-gray-500">{product.category.name}</p>
                              )}

                              <p className="text-sm sm:text-base font-medium text-gray-800 mt-1">
                                {formatPrice(product.price)} LE
                              </p>

                              <div className="mt-2 text-sm text-gray-700">
                                <p>
                                  Quantity: <span className="font-semibold">{item.quantity}</span>
                                </p>
                              </div>

                            </div>

                            <div className="flex justify-end mt-2">
                              <p className="text-lg sm:text-xl font-bold text-[#CF848A]">
                                {formatPrice(
                                  (typeof product.price === "string"
                                    ? parseFloat(product.price)
                                    : product.price) * item.quantity
                                )}{" "}
                                LE
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                  );
                })}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {showModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white shadow-lg p-6 max-w-md w-full text-center"
                  >
                    <h2 className="text-xl font-bold mb-4">Choose Delivery Option</h2>

                    <div className="flex flex-col gap-3 mb-6">
                      <button
                        onClick={() => setDeliveryOption("pickup")}
                        className={`py-3 border ${deliveryOption === "pickup"
                          ? "bg-[#CF848A] text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                          }`}
                      >
                        Pickup from Store
                      </button>
                      <button
                        onClick={() => setDeliveryOption("delivery")}
                        className={`py-3 border ${deliveryOption === "delivery"
                          ? "bg-[#CF848A] text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                          }`}
                      >
                        Home Delivery
                      </button>
                    </div>

                    {deliveryOption === "delivery" && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800 mb-4">
                        📦 Delivery service has an extra fee of <b>50 EGP</b>.
                        <br /> Currently available only in <b>New Cairo</b>, coming soon across all Egypt.
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!deliveryOption}
                        onClick={handleConfirmOption}
                        className="px-4 py-2 bg-[#CF848A] text-white hover:bg-[#c57077] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
            <div className="bg-white shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClearCart()}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-medium py-3 px-4 transition-colors duration-200 shadow-md hover:shadow-lg mt-4"
              >
                <FiTrash2 />
                Clear Cart
              </motion.button>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-[#CF848A]">{formatPrice(total)} LE</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#059669" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedClick}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-medium py-3 px-4 transition-colors duration-200 shadow-md hover:shadow-lg"
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

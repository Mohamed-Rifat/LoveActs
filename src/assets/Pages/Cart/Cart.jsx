import { useContext, useState, useEffect, useMemo } from "react";
import { CartContext } from "./../../Context/CartContext";
import Loader from "../../Components/Loader/Loader";
import { FiShoppingCart, FiTrash2, FiPlus, FiArrowLeft, FiCreditCard, FiCheck, FiCoffee, FiPackage, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToken } from '../../Context/TokenContext/TokenContext';
import ChooseCafe from "./../../Components/OrderStepper/Steps/chooseCafe";
import './Cart.css';
import { toast } from "react-hot-toast";

export default function Cart() {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();
  const { token } = useToken();
  const [clearingCart, setClearingCart] = useState(false);

  if (!cartContext) {
    throw new Error("Cart must be used within a CartProvider");
  }

  const {
    cart: items = [],
    loading,
    numOfCartItems,
    clearCart,
    clearGuestCart,
    addToCart,
    updateCartItem,
    getCart,
    pending
  } = cartContext;

  const checkUserAuth = () => {
    const storedToken = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return {
      isLoggedIn: !!storedToken,
      isGuest: !storedToken && !!sessionId,
      isAuthenticated: !!storedToken || !!sessionId,
      token: storedToken,
      sessionId: sessionId,
      role: user?.role
    };
  };

  const [showModal, setShowModal] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [drinkSelections, setDrinkSelections] = useState(() => {
    try {
      const saved = localStorage.getItem('cartDrinkSelections');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading saved drink selections:', error);
    }
    return {};
  });

  const [activeDrinkSelection, setActiveDrinkSelection] = useState(null);
  const [expandedView, setExpandedView] = useState({});
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [authStatus, setAuthStatus] = useState(checkUserAuth());

  useEffect(() => {
    setAuthStatus(checkUserAuth());
  }, [token]);


  const getProductId = (item) => item?.productId?._id || item?._id || null;
  const getProductData = (item) => (item.productId && typeof item.productId === 'object' ? item.productId : item);
  const formatPrice = (price) => parseFloat(price).toFixed(2);

  const deliveryFee = 50;

  const generateItemIds = (items) => {
    const expandedItems = [];
    (items || []).forEach((item) => {
      const product = getProductData(item);
      const productId = getProductId(item);
      const itemTimestamp = item.createdAt || item.addedAt || item._id || Date.now();

      for (let i = 0; i < item.quantity; i++) {
        const uniqueId = `${productId}-${i}-${Date.now()}`;
        const stableKey = `${productId}-${i}-${itemTimestamp}`;

        expandedItems.push({
          ...item,
          uniqueId,
          stableKey,
          originalProductId: productId,
          productData: product,
          unitIndex: i,
          itemTimestamp: itemTimestamp
        });
      }
    });
    return expandedItems;
  };

  const expandedItems = useMemo(() => generateItemIds(items), [items]);

  useEffect(() => {
    if (items && items.length > 0 && Object.keys(drinkSelections).length > 0) {
      const updatedSelections = { ...drinkSelections };
      let updated = false;

      Object.entries(drinkSelections).forEach(([key, selection]) => {
        if (!selection.stableKey && !selection.itemTimestamp) {
          const [productId, unitIndex] = key.split('-').slice(0, 2);

          if (productId && !isNaN(unitIndex)) {
            const matchingItem = expandedItems.find(item =>
              item.originalProductId === productId &&
              item.unitIndex === parseInt(unitIndex)
            );

            if (matchingItem) {
              delete updatedSelections[key];
              updatedSelections[matchingItem.stableKey] = {
                ...selection,
                productId: productId,
                unitIndex: parseInt(unitIndex),
                itemTimestamp: matchingItem.itemTimestamp,
                stableKey: matchingItem.stableKey
              };
              updated = true;
            }
          }
        }
      });

      if (updated) {
        console.log('Synced old drink selections to new system');
        setDrinkSelections(updatedSelections);
      }
    }
  }, [items, expandedItems]);

  useEffect(() => {
    const checkpointData = localStorage.getItem('cartDrinkSelectionsCheckpoint');
    if (checkpointData && items && items.length > 0) {
      try {
        const parsedData = JSON.parse(checkpointData);
        console.log('Restoring drink selections from checkpoint');
        setDrinkSelections(parsedData);
        setTimeout(() => {
          localStorage.removeItem('cartDrinkSelectionsCheckpoint');
        }, 1000);
      } catch (error) {
        console.error('Error restoring checkpoint data:', error);
      }
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('cartDrinkSelections', JSON.stringify(drinkSelections));
    } catch (error) {
      console.error('Error saving drink selections:', error);
    }
  }, [drinkSelections]);

  useEffect(() => {
    const savedDeliveryOption = localStorage.getItem('cartDeliveryOption');
    if (savedDeliveryOption) {
      setDeliveryOption(savedDeliveryOption);
    }
  }, []);

  useEffect(() => {
    if (deliveryOption) {
      localStorage.setItem('cartDeliveryOption', deliveryOption);
    }
  }, [deliveryOption]);

  const subtotal = useMemo(() => {
    return expandedItems.reduce((total, expandedItem) => {
      const product = expandedItem.productData;
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const drinkKey = expandedItem.stableKey;
      let drinkPrice = 0;

      if (drinkSelections[drinkKey]) {
        drinkPrice = drinkSelections[drinkKey].drink?.price || 0;
      } else {
        const foundSelection = Object.values(drinkSelections).find(sel =>
          sel.productId === expandedItem.originalProductId &&
          sel.unitIndex === expandedItem.unitIndex
        );
        if (foundSelection) {
          drinkPrice = foundSelection.drink?.price || 0;
        }
      }

      return total + price + drinkPrice;
    }, 0);
  }, [expandedItems, drinkSelections]);

  const total = useMemo(() => subtotal, [subtotal]);

  const finalTotal = useMemo(() => {
    return deliveryOption === "delivery" ? total + deliveryFee : total;
  }, [deliveryOption, total]);

  const allDrinksSelected = useMemo(() => {
    if (expandedItems.length === 0) return true;

    return expandedItems.every(item => {
      const drinkKey = item.stableKey;

      if (drinkSelections[drinkKey]) {
        return drinkSelections[drinkKey].drink;
      }

      return Object.values(drinkSelections).some(sel =>
        sel.productId === item.originalProductId &&
        sel.unitIndex === item.unitIndex &&
        sel.drink
      );
    });
  }, [expandedItems, drinkSelections]);

  const selectedDrinksCount = useMemo(() => {
    return expandedItems.filter(item => {
      const drinkKey = item.stableKey;
      if (drinkSelections[drinkKey]) {
        return drinkSelections[drinkKey].drink;
      }

      return Object.values(drinkSelections).some(sel =>
        sel.productId === item.originalProductId &&
        sel.unitIndex === item.unitIndex &&
        sel.drink
      );
    }).length;
  }, [expandedItems, drinkSelections]);

  const handleProceedClick = () => {
    if (!allDrinksSelected) {
      alert("Please select a drink for all items before proceeding!");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOption = () => {
    if (!allDrinksSelected) {
      alert("Please select a drink for all items before proceeding!");
      return;
    }

    setIsConfirmed(true);
    setShowModal(false);

    const formattedSelections = {};

    expandedItems.forEach(item => {
      const drinkKey = item.stableKey;
      let selection = drinkSelections[drinkKey];

      if (!selection) {
        selection = Object.values(drinkSelections).find(sel =>
          sel.productId === item.originalProductId &&
          sel.unitIndex === item.unitIndex
        );
      }

      if (selection) {
        const productId = item.originalProductId;

        if (!formattedSelections[productId]) {
          formattedSelections[productId] = [];
        }

        formattedSelections[productId].push({
          drink: selection.drink,
          cafe: selection.cafe
        });
      }
    });

    navigate("/checkout", {
      state: {
        deliveryOption,
        finalTotal,
        drinkSelections: formattedSelections,
        userInfo: {
          isGuest: authStatus.isGuest,
          sessionId: authStatus.sessionId,
          token: authStatus.token
        }
      }
    });
  };

  useEffect(() => {
    const authStatus = checkUserAuth();

    if (authStatus.isGuest) {
      const checkpointData = localStorage.getItem('cartDrinkSelectionsCheckpoint');
      if (checkpointData && items && items.length > 0) {
        try {
          const parsedData = JSON.parse(checkpointData);
          console.log('Restoring drink selections from checkpoint');
          setDrinkSelections(parsedData);
          setTimeout(() => {
            localStorage.removeItem('cartDrinkSelectionsCheckpoint');
          }, 1000);
        } catch (error) {
          console.error('Error restoring checkpoint data:', error);
        }
      }
    }
  }, [items]);

  const handleOpenDrinkSelection = (uniqueId) => {
    setActiveDrinkSelection(uniqueId);
  };

  const handleCloseDrinkSelection = () => {
    setActiveDrinkSelection(null);
  };

  const handleDrinkSelect = (drinkData) => {
    if (activeDrinkSelection) {
      const item = expandedItems.find(item => item.uniqueId === activeDrinkSelection);

      if (item) {
        const drinkKey = item.stableKey;

        setDrinkSelections(prev => {
          const newSelections = {
            ...prev,
            [drinkKey]: {
              drink: drinkData,
              cafe: drinkData.cafe,
              selectedAt: new Date().toISOString(),
              productId: item.originalProductId,
              unitIndex: item.unitIndex,
              itemTimestamp: item.itemTimestamp,
              stableKey: drinkKey
            }
          };
          return newSelections;
        });
      }
      setActiveDrinkSelection(null);
    }
  };

  const handleRemoveDrinkSelection = (uniqueId, e) => {
    e.stopPropagation();
    const item = expandedItems.find(item => item.uniqueId === uniqueId);

    if (item) {
      const drinkKey = item.stableKey;

      setDrinkSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[drinkKey];
        console.log('Drink removed with key:', drinkKey);
        return newSelections;
      });
    }
  };

  const toggleExpandedView = (productId) => {
    setExpandedView(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const groupedItems = useMemo(() => {
    const groups = {};

    expandedItems.forEach(item => {
      const productId = item.originalProductId;
      if (!groups[productId]) {
        groups[productId] = {
          productData: item.productData,
          quantity: item.quantity,
          items: []
        };
      }
      groups[productId].items.push(item);
    });

    return groups;
  }, [expandedItems]);

  useEffect(() => {
    if (!items) return;
    const newExpandedView = {};
    Object.keys(groupedItems).forEach(productId => {
      const group = groupedItems[productId];
      const hasAllDrinks = group.items.every(item => {
        const drinkKey = item.stableKey;
        return drinkSelections[drinkKey]?.drink ||
          Object.values(drinkSelections).some(sel =>
            sel.productId === item.originalProductId &&
            sel.unitIndex === item.unitIndex &&
            sel.drink
          );
      });
      newExpandedView[productId] = !hasAllDrinks;
    });
    setExpandedView(newExpandedView);
  }, [items, drinkSelections, groupedItems]);

  const handleClearCart = async () => {
    if (clearingCart) return;

    const authStatus = checkUserAuth();
    setClearingCart(true);
    localStorage.removeItem('cartDrinkSelections');
    localStorage.removeItem('cartDeliveryOption');
    if (authStatus.isGuest) {
      localStorage.removeItem('cartDrinkSelectionsCheckpoint');
      localStorage.removeItem('Guest-cart');
      localStorage.removeItem('guestSessionId');
    }
    setDrinkSelections({});
    setDeliveryOption(null);

    try {
      if (authStatus.isLoggedIn) {
        await clearCart();
      } else if (authStatus.isGuest && clearGuestCart) {
        await clearGuestCart();
      } else {
        await handleManualGuestClear();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error("Failed to clear cart");
    } finally {
      setClearingCart(false);
    }
  };

  const handleManualGuestClear = async () => {
    try {
      await clearCart();
    } catch (err) {
    }
    localStorage.removeItem("sessionId");

    const response = await axios.get("https://flowers-vert-six.vercel.app/get-seesion-id");
    const newSessionId = response.data.sessionId;
    localStorage.setItem("sessionId", newSessionId);
    await getCart();
    return newSessionId;
  };

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
      className="min-h-screen bg-gray-50 pb-24 lg:pb-0"
    >
      <div className="bg-white border-b border-gray-200 sticky z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <FiArrowLeft className="text-xl text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-gray-600 text-xs mt-0.5">
                  {expandedItems.length} item{expandedItems.length !== 1 ? 's' : ''} • {selectedDrinksCount} drink{selectedDrinksCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${authStatus.isAuthenticated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-600">
                  {authStatus.isGuest ? 'Guest' : authStatus.isLoggedIn ? 'Logged In' : 'Not Logged In'}
                </span>
              </div>

              <button
                className="Btn"
                onClick={handleClearCart}
                disabled={clearingCart}
              >
                <div className="sign">
                  {clearingCart ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      viewBox="0 0 16 16"
                      className="bi bi-trash3-fill"
                      fill="currentColor"
                      height="18"
                      width="18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                      ></path>
                    </svg>
                  )}
                </div>

                <div className="text">
                  {clearingCart ? "Clearing..." : "Delete"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="mb-6 lg:hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">Drink Selection</span>
                <span className="text-sm font-semibold text-[#CF848A]">
                  {selectedDrinksCount}/{expandedItems.length}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(selectedDrinksCount / expandedItems.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#CF848A] to-[#A85C68]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {expandedItems.length - selectedDrinksCount} more to select
              </p>
            </div>

            <div className="mb-6 hidden lg:block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Drink Selection Progress</span>
                <span className="text-sm font-semibold text-[#CF848A]">
                  {selectedDrinksCount}/{expandedItems.length}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(selectedDrinksCount / expandedItems.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#CF848A] to-[#A85C68]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {expandedItems.length - selectedDrinksCount} more drink{expandedItems.length - selectedDrinksCount !== 1 ? 's' : ''} to select
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedItems).map(([productId, group], index) => {
                const isExpanded = expandedView[productId];
                const groupSelectedCount = group.items.filter(item => {
                  const drinkKey = item.stableKey;
                  return drinkSelections[drinkKey]?.drink ||
                    Object.values(drinkSelections).some(sel =>
                      sel.productId === item.originalProductId &&
                      sel.unitIndex === item.unitIndex &&
                      sel.drink
                    );
                }).length;

                return (
                  <motion.div
                    key={productId}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                      onClick={() => toggleExpandedView(productId)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={group.productData.imageCover || group.productData.image || "/Logo.PNG"}
                            alt={group.productData.title || group.productData.name}
                            className="w-16 h-16 rounded-full object-cover border border-gray-200"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 truncate">
                                {group.productData.title || group.productData.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {formatPrice(group.productData.price)} LE each
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-[#CF848A]">
                                {formatPrice(
                                  group.items.reduce((total, item) => {
                                    const selection = drinkSelections[item.stableKey] ||
                                      Object.values(drinkSelections).find(sel =>
                                        sel.productId === item.originalProductId &&
                                        sel.unitIndex === item.unitIndex
                                      );

                                    const drinkPrice = selection?.drink?.price || 0;
                                    return total + item.productData.price + drinkPrice;
                                  }, 0)
                                )} LE
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-gray-600">
                                Qty: <span className="font-semibold">{group.quantity}</span>
                              </span>
                              <span className={`text-xs px-2 py-0.5 ${groupSelectedCount === group.quantity
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                                }`}>
                                {groupSelectedCount}/{group.quantity} drinks
                              </span>
                            </div>

                            <button className="text-[#CF848A] hover:text-[#A85C68] text-xs font-medium flex items-center gap-1">
                              {isExpanded ? 'Hide' : 'Show Items'}
                              <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs"
                              >
                                ▼
                              </motion.span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 bg-gray-50">
                            <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <FiPackage className="text-[#CF848A] text-sm" />
                              Select drinks for each item:
                            </h4>

                            <div className="space-y-3">
                              {group.items.map((item, unitIndex) => {
                                const drinkKey = item.stableKey;
                                const selection = drinkSelections[drinkKey] ||
                                  Object.values(drinkSelections).find(sel =>
                                    sel.productId === item.originalProductId &&
                                    sel.unitIndex === item.unitIndex
                                  );

                                const hasDrinkSelection = !!selection?.drink;
                                const isActive = activeDrinkSelection === item.uniqueId;

                                return (
                                  <div key={item.uniqueId} className="bg-white border border-gray-200 p-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                          {group.productData.title || group.productData.name}  ( {unitIndex + 1} )
                                        </span>
                                        {hasDrinkSelection && (
                                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5">
                                            ✓ Selected
                                          </span>
                                        )}
                                      </div>

                                      <div className="text-right">
                                        <p className="text-base font-bold text-[#CF848A]">
                                          {hasDrinkSelection
                                            ? formatPrice(item.productData.price + (selection.drink.price || 0))
                                            : formatPrice(item.productData.price)
                                          } LE
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      {hasDrinkSelection ? (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="p-2 bg-green-50 border border-green-200"
                                        >
                                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-1.5 mb-1">
                                                <FiCheck className="text-green-600 text-sm" />
                                                <span className="text-sm font-medium text-green-800 truncate">
                                                  {selection.drink.productName}
                                                </span>
                                              </div>
                                              <div className="text-xs text-green-600 ml-5">
                                                From {selection.cafe.name} • +{selection.drink.price} LE
                                              </div>
                                            </div>
                                            <button
                                              onClick={(e) => handleRemoveDrinkSelection(item.uniqueId, e)}
                                              className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 transition-colors self-end sm:self-start"
                                            >
                                              Change
                                            </button>
                                          </div>
                                        </motion.div>
                                      ) : (
                                        <button
                                          onClick={() => handleOpenDrinkSelection(item.uniqueId)}
                                          className="w-full py-2.5 px-4 border border-gray-300 hover:border-[#CF848A] hover:bg-[#FDE9EE] transition-all duration-300 group flex items-center justify-center gap-2"
                                        >
                                          <FiPlus className="text-gray-400 group-hover:text-[#CF848A] text-sm" />
                                          <span className="text-sm text-gray-600 group-hover:text-[#CF848A] font-medium">
                                            Add Drink
                                          </span>
                                        </button>
                                      )}
                                    </div>

                                    {isActive && (
                                      <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 pt-3 border-t border-gray-200"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                                            <FiCoffee className="text-[#CF848A]" />
                                            <span>Choose Drink for Item {unitIndex + 1}</span>
                                          </h5>
                                          <button
                                            onClick={handleCloseDrinkSelection}
                                            className="text-gray-500 hover:text-gray-700 text-xs p-1 hover:bg-gray-100"
                                          >
                                            ✕ Close
                                          </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                          <div className="border border-gray-200">
                                            <ChooseCafe
                                              onSelectDrink={handleDrinkSelect}
                                              singleSelectionMode={true}
                                            />
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-[#CF848A] hover:text-[#A85C68] font-medium py-3 px-6 hover:bg-[#FDE9EE] transition-all duration-300 group text-sm"
              >
                <FiArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-6">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-200 overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-r from-[#CF848A] to-[#A85C68] text-white">
                  <h2 className="text-xl font-bold mb-1">Order Summary</h2>
                  <p className="text-white/90 text-sm">Review your order details</p>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FDE9EE] flex items-center justify-center">
                        <FiShoppingCart className="text-[#CF848A]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expandedItems.length} Items</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="space-y-3">
                      {(() => {
                        const productsTotal = Object.values(groupedItems).reduce((sum, group) => {
                          return sum + group.items.reduce((groupSum, item) => groupSum + item.productData.price, 0);
                        }, 0);
                        const drinksTotal = Object.values(drinkSelections).reduce((sum, sel) => sum + (sel.drink?.price || 0), 0);
                        const deliveryFee = deliveryOption === "delivery" ? 50 : 0;
                        const finalTotal = productsTotal + drinksTotal + deliveryFee;
                        return (
                          <>
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>{formatPrice(productsTotal)} LE</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                              <span>Drinks ({selectedDrinksCount})</span>
                              <span className="text-green-600 font-medium">+{formatPrice(drinksTotal)} LE</span>
                            </div>

                            {deliveryOption && (
                              <>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex justify-between">
                                  <span>Delivery</span>
                                  <span className={deliveryOption === "delivery" ? "text-amber-600" : "text-gray-600"}>
                                    {deliveryOption === "delivery" ? `+${formatPrice(deliveryFee)} LE` : "Pickup"}
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="h-px bg-gray-200"></div>
                            <div className="flex justify-between text-lg font-bold pt-2">
                              <span>Total</span>
                              <span className="text-[#CF848A]">{formatPrice(finalTotal)} LE</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {!allDrinksSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-amber-50 border border-amber-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-600 font-bold">!</span>
                        </div>
                        <div>
                          <p className="font-medium text-amber-800 mb-1">Complete Drink Selection</p>
                          <p className="text-amber-700 text-sm">
                            Select {expandedItems.length - selectedDrinksCount} more drink
                            {expandedItems.length - selectedDrinksCount !== 1 ? 's' : ''} to proceed
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    <motion.button
                      whileHover={allDrinksSelected ? { scale: 1.02 } : {}}
                      whileTap={allDrinksSelected ? { scale: 0.98 } : {}}
                      onClick={handleProceedClick}
                      disabled={!allDrinksSelected}
                      className={`w-full py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${allDrinksSelected
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-md hover:from-green-600 hover:to-emerald-700 cursor-pointer"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <FiCreditCard className="text-lg" />
                      {allDrinksSelected ? "Proceed to Checkout" : "Complete Selections First"}
                    </motion.button>

                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full py-3 px-6 border border-[#CF848A] text-[#CF848A] hover:bg-[#FDE9EE] transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Delivery Options</span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-6">
                    You won't be charged until the payment step
                  </p>
                </div>
              </motion.div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Need help?</strong> Each flower item needs a drink selection. Click "Add Drink" for each item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-lg font-bold text-[#CF848A]">{formatPrice(finalTotal)} LE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {selectedDrinksCount}/{expandedItems.length} drinks selected
                </span>
                <button
                  onClick={() => setShowMobileSummary(!showMobileSummary)}
                  className="text-xs text-[#CF848A] hover:text-[#A85C68] font-medium"
                >
                  {showMobileSummary ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleProceedClick}
              disabled={!allDrinksSelected}
              className={`py-3 px-6 font-semibold transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 ${allDrinksSelected
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <FiCreditCard className="text-lg" />
              <span className="text-sm">Checkout</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-200 mt-3">
                  <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${authStatus.isAuthenticated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-600">
                        {authStatus.isGuest ? 'Shopping as Guest' :
                          authStatus.isLoggedIn ? 'Logged In' : 'Not Logged In'}
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const productsTotal = Object.values(groupedItems).reduce((sum, group) => {
                      return sum + group.items.reduce((groupSum, item) => groupSum + item.productData.price, 0);
                    }, 0);

                    const drinksTotal = Object.values(drinkSelections).reduce((sum, sel) => sum + (sel.drink?.price || 0), 0);

                    const deliveryFee = deliveryOption === "delivery" ? 50 : 0;

                    const finalTotal = productsTotal + drinksTotal + deliveryFee;

                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span>{formatPrice(productsTotal)} LE</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Drinks ({selectedDrinksCount})</span>
                          <span className="text-green-600">+{formatPrice(drinksTotal)} LE</span>
                        </div>

                        {deliveryOption && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery</span>
                            <span className={deliveryOption === "delivery" ? "text-amber-600" : "text-gray-600"}>
                              {deliveryOption === "delivery" ? `+${formatPrice(deliveryFee)} LE` : "Pickup"}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span className="text-[#CF848A]">{formatPrice(finalTotal)} LE</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {!allDrinksSelected && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-800 text-center">
                        Complete {expandedItems.length - selectedDrinksCount} more drink
                        {expandedItems.length - selectedDrinksCount !== 1 ? 's' : ''} selection
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full py-2.5 text-sm border border-[#CF848A] text-[#CF848A] hover:bg-[#FDE9EE] transition-colors"
                    >
                      Delivery Options
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#FDE9EE] rounded-lg flex items-center justify-center text-[#CF848A]">
                    🚚
                  </span>
                  Delivery Options
                </h2>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setDeliveryOption("pickup")}
                    className={`w-full p-5 border-2 text-left transition-all duration-300 ${deliveryOption === "pickup"
                      ? "border-[#CF848A] bg-[#FDE9EE]"
                      : "border-gray-200 hover:border-[#CF848A] hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryOption === "pickup" ? "border-[#CF848A]" : "border-gray-300"
                        }`}>
                        {deliveryOption === "pickup" && (
                          <div className="w-3 h-3 bg-[#CF848A] rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Pickup from Store</p>
                        <p className="text-sm text-gray-600 mt-1">Collect your order from our café</p>
                      </div>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setDeliveryOption("delivery")}
                    className={`w-full p-5 border-2 text-left transition-all duration-300 ${deliveryOption === "delivery"
                      ? "border-[#CF848A] bg-[#FDE9EE]"
                      : "border-gray-200 hover:border-[#CF848A] hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryOption === "delivery" ? "border-[#CF848A]" : "border-gray-300"
                        }`}>
                        {deliveryOption === "delivery" && (
                          <div className="w-3 h-3 bg-[#CF848A] rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Home Delivery</p>
                        <p className="text-sm text-gray-600 mt-1">Delivered to your doorstep</p>
                      </div>
                      <span className="text-amber-600 font-bold">+50 LE</span>
                    </div>
                  </button>
                </div>

                {deliveryOption === "delivery" && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-800">
                      📦 <strong>Delivery Info:</strong> Currently available in <b>New Cairo</b> only.
                      Additional 50 EGP fee applies.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!deliveryOption}
                    onClick={handleConfirmOption}
                    className={`flex-1 py-3 px-4 font-medium transition-colors ${deliveryOption
                      ? "bg-[#CF848A] hover:bg-[#A85C68] text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
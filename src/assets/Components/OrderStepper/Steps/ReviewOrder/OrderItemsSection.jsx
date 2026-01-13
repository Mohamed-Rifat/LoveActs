import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiCheck, FiCoffee, FiChevronDown, FiChevronUp } from "react-icons/fi";

const OrderItemsSection = ({
  groupedItems,
  drinkSelections,
  expandedItems,
  loading,
  cartItems
}) => {
  const [expandedView, setExpandedView] = useState({});
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (groupedItems && Object.keys(groupedItems).length > 0) {
      const initialExpanded = {};
      Object.keys(groupedItems).forEach(productId => {
        initialExpanded[productId] = true;
      });
      setExpandedView(initialExpanded);
      setLocalLoading(false);
    } else {
      setLocalLoading(false);
    }
  }, [groupedItems]);

  const getDrinkSelection = (item) => {
    if (!drinkSelections) return null;

    const drinkKey = item.stableKey;
    if (drinkSelections[drinkKey]) {
      return drinkSelections[drinkKey];
    }

    return Object.values(drinkSelections).find(sel => {
      if (sel.productId === item.originalProductId && sel.unitIndex === item.unitIndex) {
        return true;
      }
      if (sel.cartItemId && item.cartItemId && sel.cartItemId === item.cartItemId) {
        return true;
      }
      return false;
    });
  };

  const formatPrice = (price) => parseFloat(price).toFixed(2);

  const toggleExpandedView = (productId) => {
    setExpandedView(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  if (loading || localLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (groupedItems && Object.keys(groupedItems).length > 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#CF848A]/10 to-[#A85C68]/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <FiPackage className="text-[#CF848A] text-base sm:text-lg" />
              <span>Your Order</span>
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(groupedItems).map(([productId, group]) => {
              const isExpanded = expandedView[productId] !== false;
              const groupSelectedCount = group.items.filter(item => {
                const selection = getDrinkSelection(item);
                return selection?.drink;
              }).length;

              return (
                <div key={productId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleExpandedView(productId)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={group.productData.image || "/Logo.PNG"}
                          alt={group.productData.name}
                          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-sm"
                        />

                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">
                              {group.productData.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                              {formatPrice(group.productData.price)} LE each
                            </p>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="text-right">
                              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#CF848A]">
                                {formatPrice(
                                  group.items.reduce((total, item) => {
                                    const selection = getDrinkSelection(item);
                                    const drinkPrice = selection?.drink?.price || 0;
                                    return total + (group.productData.price + drinkPrice);
                                  }, 0)
                                )} LE
                              </p>
                            </div>

                            <button className="text-[#CF848A] hover:text-[#A85C68] p-1">
                              {isExpanded ? (
                                <FiChevronUp className="text-base sm:text-lg" />
                              ) : (
                                <FiChevronDown className="text-base sm:text-lg" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${groupSelectedCount === group.quantity ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <span className={`text-xs font-medium ${groupSelectedCount === group.quantity ? 'text-green-700' : 'text-amber-700'
                              }`}>
                              {groupSelectedCount}/{group.quantity} drinks
                            </span>
                          </div>

                          <span className="text-xs text-gray-600 sm:hidden">
                            Qty: {group.quantity}
                          </span>
                        </div>

                        <div className="mt-2 sm:hidden">
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(groupSelectedCount / group.quantity) * 100}%` }}
                              className={`h-full ${groupSelectedCount === group.quantity ? 'bg-green-500' : 'bg-amber-500'}`}
                            />
                          </div>
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
                        className="overflow-hidden"
                      >
                        <div className="p-3 sm:p-4 bg-gray-50">
                          <div className="space-y-2 sm:space-y-3">
                            {group.items.map((item, index) => {
                              const selection = getDrinkSelection(item);
                              const hasDrink = !!selection?.drink;

                              return (
                                <div key={item.uniqueId} className="bg-white border border-gray-200 p-2 sm:p-3 rounded-lg">
                                  <div className="space-y-2">
                                    {hasDrink ? (
                                      <div className="bg-green-50 border border-green-100 rounded-lg p-2 sm:p-3">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border border-green-200 bg-white">
                                            <img
                                              src={selection.drink.image || "/default-drink-image.png"}
                                              alt={selection.drink.productName}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                                              <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-green-800 truncate">
                                                  {selection.drink.productName}
                                                </p>
                                                <p className="text-xs text-green-600 mt-0.5 truncate">
                                                  From {selection.cafe?.name || "Cafe"}
                                                </p>
                                              </div>
                                              <div className="text-right mt-1 sm:mt-0">
                                                <p className="text-xs sm:text-sm font-bold text-green-700">
                                                  +{formatPrice(selection.drink.price)} LE
                                                </p>
                                                <p className="text-xs text-green-600">Drink</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <FiCoffee className="text-gray-400 text-sm sm:text-base" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs sm:text-sm text-gray-500 italic">
                                              No drink selected for this item
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <FiPackage className="text-gray-400 text-lg sm:text-xl" />
      </div>
      <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">No items in order</h3>
      <p className="text-xs sm:text-sm text-gray-500">Your cart appears to be empty</p>
    </div>
  );
};

export default OrderItemsSection;

import React, { useState, useMemo } from "react";
import { FiCoffee, FiCheck, FiArrowLeft, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { useCart } from "./../../../hooks/UseCart";
import ChooseCafe from "./chooseCafe";
import { useNavigate } from "react-router-dom";

export default function ChooseDrinksForCart({ onNext, onBack }) {
  const { cart: items } = useCart();
  const [selectedDrinks, setSelectedDrinks] = useState({});
  const [activeProductId, setActiveProductId] = useState(null);
  const navigate = useNavigate();

  const expandedCartItems = useMemo(() => {
    if (!items) return [];

    const expanded = [];
    items.forEach(item => {
      const product = item.productId || item;
      const productId = product._id;

      for (let i = 0; i < item.quantity; i++) {
        expanded.push({
          ...item,
          uniqueId: `${productId}-${i}`,
          originalProductId: productId,
          productData: product,
          index: i
        });
      }
    });

    return expanded;
  }, [items]);

  const allDrinksSelected = useMemo(() => {
    return expandedCartItems.every(item =>
      selectedDrinks[item.uniqueId] &&
      selectedDrinks[item.uniqueId].drink &&
      selectedDrinks[item.uniqueId].cafe
    );
  }, [expandedCartItems, selectedDrinks]);

  const handleDrinkSelect = (uniqueId, drinkData) => {
    setSelectedDrinks(prev => ({
      ...prev,
      [uniqueId]: {
        drink: drinkData,
        cafe: drinkData.cafe
      }
    }));
    setActiveProductId(null);
  };

  const handleOpenDrinkSelection = (uniqueId) => {
    setActiveProductId(uniqueId);
  };

  const handleCloseDrinkSelection = () => {
    setActiveProductId(null);
  };

  const handleContinue = () => {
    if (allDrinksSelected) {
      onNext(selectedDrinks);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <FiCoffee className="text-4xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Please add some products to your cart first.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-2 bg-[#CF848A] text-white rounded-lg hover:bg-[#A85C68]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
        >
          <FiArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center flex-1 px-2">
          Select Drinks
        </h2>
        <div className="w-8 sm:w-8"></div>
      </div>

      <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-sm border border-blue-200">
        <p className="text-blue-800 text-xs sm:text-sm">
          <strong>Important:</strong> Please select a drink for each product in your cart.
        </p>
      </div>

      <div className="space-y-4">
        {expandedCartItems.map((item) => {
          const selectedDrink = selectedDrinks[item.uniqueId];
          const isActive = activeProductId === item.uniqueId;

          return (
            <motion.div
              key={item.uniqueId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 p-3 sm:p-4 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 w-full">
                  <img
                    src={item.productData.imageCover || item.productData.image || "/Logo.PNG"}
                    alt={item.productData.title || item.productData.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.productData.title || item.productData.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                       {item.productData.price} LE
                    </p>

                    {selectedDrink && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 p-2 sm:p-3 bg-green-50 rounded-sm border border-green-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex-1">
                            <p className="font-medium text-green-800 text-xs sm:text-sm">
                              <FiCheck className="inline mr-1 sm:mr-2" size={14} />
                              {selectedDrink.drink.productName}
                            </p>
                            <p className="text-xs text-green-600 ml-4 sm:ml-6">
                              From {selectedDrink.cafe.name} • {selectedDrink.drink.price} LE
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex w-full sm:w-auto justify-end mt-2 sm:mt-0">
                  {!selectedDrink ? (
                    <button
                      onClick={() => handleOpenDrinkSelection(item.uniqueId)}
                      className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#CF848A] text-white rounded-sm hover:bg-[#A85C68] text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
                    >
                      <FiPlus size={14} />
                      Choose Drink
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenDrinkSelection(item.uniqueId)}
                      className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 border border-[#CF848A] text-[#CF848A] rounded-sm hover:bg-[#FFF3F3] text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
                    >
                      <FiCoffee size={14} />
                      Change Drink
                    </button>
                  )}
                </div>
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 border-t border-gray-200 pt-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">Select a drink:</h4>
                    <button
                      onClick={handleCloseDrinkSelection}
                      className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                    >
                      Close
                    </button>
                  </div>

                  <ChooseCafe
                    onSelectDrink={(drinkData) => handleDrinkSelect(item.uniqueId, drinkData)}
                    singleSelectionMode={true}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => navigate("/cart")}
          className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium w-full sm:w-auto text-center"
        >
          Back to Cart
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            {Object.keys(selectedDrinks).length} of {expandedCartItems.length} items with drinks
          </span>
          <button
            onClick={handleContinue}
            disabled={!allDrinksSelected}
            className={`px-4 py-2 sm:px-6 sm:py-3 font-medium transition-all w-full sm:w-auto text-center ${
              allDrinksSelected
                ? "bg-[#CF848A] hover:bg-[#A85C68] text-white shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Personal Info
          </button>
        </div>
      </div>
    </div>
  );
}
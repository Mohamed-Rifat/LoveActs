import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp, FiChevronDown, FiLoader, FiCheckCircle } from "react-icons/fi";

const MobileSummary = ({
    showFixedSummary,
    toggleFixedSummary,
    cart,
    totalPrice,
    drinksTotal,
    deliveryOption,
    deliveryFee,
    calculatedTotal,
    itemsWithDrinks,
    isValidOrder,
    loading,
    fetchingCart,
    onBack,
    onSubmitOrder
}) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30">
            <div className="container mx-auto px-4">
                <div className="py-3">
                    <button
                        onClick={toggleFixedSummary}
                        className="w-full flex items-center justify-between py-2"
                    >
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">
                                {calculatedTotal.toFixed(2)} EGP
                            </p>
                            <p className="text-xs text-gray-500">
                                {cart.length} items • {itemsWithDrinks} with drinks
                            </p>
                        </div>
                        <div className="text-[#CF848A]">
                            {showFixedSummary ? <FiChevronDown /> : <FiChevronUp />}
                        </div>
                    </button>
                </div>

                <AnimatePresence>
                    {showFixedSummary && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-gray-200"
                        >
                            <div className="py-4">
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Products</span>
                                        <span>{totalPrice.toFixed(2)} EGP</span>
                                    </div>
                                    {drinksTotal > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Drinks</span>
                                            <span>{drinksTotal.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                    {deliveryOption === "delivery" && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Delivery Fee</span>
                                            <span>{deliveryFee.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span className="text-[#CF848A]">{calculatedTotal.toFixed(2)} EGP</span>
                                        </div>
                                    </div>
                                </div>

                                {!isValidOrder && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
                                        <p className="text-xs text-amber-800 text-center">
                                            Complete all required information
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="py-3 bg-white border-t border-gray-200">
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            disabled={loading || fetchingCart}
                            className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm rounded-lg"
                        >
                            Back
                        </button>

                        <button
                            onClick={onSubmitOrder}
                            disabled={!isValidOrder || loading || fetchingCart}
                            className={`flex-1 py-3 font-semibold transition-all flex items-center justify-center gap-2 text-sm rounded-lg ${isValidOrder && !loading && !fetchingCart
                                ? "bg-gradient-to-r from-[#CF848A] to-[#A85C68] text-white hover:from-[#A85C68] hover:to-[#CF848A] shadow-md"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    Processing...
                                </>
                            ) : fetchingCart ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle />
                                    Confirm Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileSummary;
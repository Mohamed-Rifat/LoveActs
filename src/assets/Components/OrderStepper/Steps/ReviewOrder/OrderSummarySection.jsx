import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";
import axios from "axios";

const OrderSummarySection = ({
    totalPrice: propTotalPrice,
    drinksTotal: propDrinksTotal,
    deliveryOption,
    deliveryFee,
    calculatedTotal: propCalculatedTotal,
    itemsWithDrinks,
    selectedDate,
    selectedTimeSlot,
    isValidOrder,
    loading,
    onBack,
    onSubmitOrder
}) => {
    const [fetchingCart, setFetchingCart] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [drinksTotal, setDrinksTotal] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    useEffect(() => {
        const fetchCartSummary = async () => {
            const sessionId = localStorage.getItem("sessionId");
            if (!sessionId) {
                console.log("⚠️ No sessionId found");
                return;
            }

            setFetchingCart(true);
            try {
                
                const res = await axios.get(
                    "https://flowers-vert-six.vercel.app/api/cart/get-user-cart",
                    {
                        headers: {
                            "sessionId": sessionId,
                        },
                    }
                );

                const products = res.data?.cart?.products || [];
                
                const total = products.reduce((sum, item) => {
                    const price = item.productId?.price || 0;
                    const quantity = item.quantity || 1;
                    return sum + (price * quantity);
                }, 0);
                
                const drinkSelections = JSON.parse(
                    localStorage.getItem("cartDrinkSelections") || "{}"
                );
                
                const drinksTotalCalc = Object.values(drinkSelections).reduce((sum, selection) => {
                    return sum + (selection.drink?.price || 0);
                }, 0);

                const deliveryFeeCalc = deliveryOption === "delivery" ? 50 : 0;
                const finalTotalCalc = total + drinksTotalCalc + deliveryFeeCalc;

                setCart(products);
                setCartTotal(total);
                setDrinksTotal(drinksTotalCalc);
                setFinalTotal(finalTotalCalc);
            } catch (error) {
                console.error("❌ Error fetching cart summary:", error);
            } finally {
                setFetchingCart(false);
            }
        };

        fetchCartSummary();
    }, [deliveryOption]);

    const totalPrice = propTotalPrice !== undefined ? propTotalPrice : cartTotal;
    const calculatedTotal = propCalculatedTotal !== undefined ? propCalculatedTotal : finalTotal;
    const finalDrinksTotal = propDrinksTotal !== undefined ? propDrinksTotal : drinksTotal;
    const cartItemsCount = cart.length;

    return (
        <div className="bg-white border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
            </h2>

            <div className="space-y-4 mb-6">
                {fetchingCart ? (
                    <div className="text-center py-4">
                        <FiLoader className="animate-spin text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Loading cart data...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between text-gray-600">
                            <span>Products</span>
                            <span>{totalPrice.toFixed(2)} EGP</span>
                        </div>

                        {finalDrinksTotal > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Drinks </span>
                                <span className="text-green-600">
                                    +{finalDrinksTotal.toFixed(2)} EGP
                                </span>
                            </div>
                        )}

                        {deliveryOption === "delivery" && (
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>+{deliveryFee.toFixed(2)} EGP</span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount</span>
                                <span className="text-[#CF848A]">
                                    {calculatedTotal.toFixed(2)} EGP
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Order Type:</span>
                        <span className={`font-medium ${deliveryOption === "delivery" ? "text-blue-600" : "text-amber-600"}`}>
                            {deliveryOption === "delivery" ? "Home Delivery" : "Store Pickup"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className="font-medium">Cash on Delivery</span>
                    </div>
                    {selectedDate && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                                {selectedDate.format("ddd, MMM D, YYYY")}
                            </span>
                        </div>
                    )}
                    {selectedTimeSlot && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">{selectedTimeSlot}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${localStorage.getItem("sessionId") ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className="text-sm text-gray-700">Session Status</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${localStorage.getItem("sessionId") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {localStorage.getItem("sessionId") ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>

            {!isValidOrder && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                        <FiAlertCircle />
                        Required Information
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                        {!selectedDate && <li>• Select delivery date</li>}
                        {!selectedTimeSlot && <li>• Select time slot</li>}
                        {!isValidOrder && <li>• Complete personal information</li>}
                        {!localStorage.getItem("sessionId") && <li>• Session expired. Please login again</li>}
                    </ul>
                </div>
            )}

            <div className="space-y-3">
                <button
                    onClick={onSubmitOrder}
                    disabled={!isValidOrder || loading || fetchingCart || !localStorage.getItem("sessionId")}
                    className={`w-full py-3.5 font-semibold transition-all flex items-center justify-center gap-3 rounded-lg ${isValidOrder && !loading && !fetchingCart && localStorage.getItem("sessionId")
                        ? "bg-gradient-to-r from-[#CF848A] to-[#A85C68] text-white hover:from-[#A85C68] hover:to-[#CF848A] shadow-md hover:shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
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
                            Loading Cart...
                        </>
                    ) : (
                        <>
                            <FiCheckCircle className="text-lg" />
                            Confirm Order
                        </>
                    )}
                </button>

                <button
                    onClick={onBack}
                    disabled={loading || fetchingCart}
                    className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium rounded-lg"
                >
                    Back to Edit
                </button>
            </div>
        </div>
    );
};

export default OrderSummarySection;
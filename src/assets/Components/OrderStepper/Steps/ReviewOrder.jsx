import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import PersonalInfoSection from "./ReviewOrder/PersonalInfoSection";
import ScheduleSection from "./ReviewOrder/ScheduleSection";
import OrderItemsSection from "./ReviewOrder/OrderItemsSection";
import OrderSummarySection from "./ReviewOrder/OrderSummarySection";
import MobileSummary from "./ReviewOrder/MobileSummary";

const ReviewOrderMain = ({
    userData: propUserData,
    deliveryOption: propDeliveryOption,
    onBack,
    onConfirm
}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingCart, setFetchingCart] = useState(false);
    const [message, setMessage] = useState(null);
    const [showFixedSummary, setShowFixedSummary] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [cart, setCart] = useState([]);
    const [cartId, setCartId] = useState("");
    const [cartTotal, setCartTotal] = useState(0);
    const [deliveryOption, setDeliveryOption] = useState("delivery");
    const [drinkSelections, setDrinkSelections] = useState({});
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        country: "",
    });

    const fetchCartFromAPI = async () => {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            return;
        }

        setFetchingCart(true);
        try {
            const response = await axios.get(
                "https://flowers-vert-six.vercel.app/api/cart/get-user-cart",
                {
                    headers: {
                        "sessionId": sessionId,
                    },
                }
            );
            const cartData = response.data?.cart;
            if (cartData && cartData.products && cartData.products.length > 0) {
                const products = cartData.products;

                const total = products.reduce((sum, item) => {
                    const price = item.productId?.price || 0;
                    const quantity = item.quantity || 1;
                    return sum + (price * quantity);
                }, 0);

                setCart(products);
                setCartTotal(total);
                setCartId(cartData._id || cartData.id);

                localStorage.setItem("cartId", cartData._id || cartData.id);

            } else {
                setCart([]);
                setCartTotal(0);
            }
        } catch (err) {
            console.error("❌ Error fetching cart:", err.response?.data || err.message);
            setMessage({
                type: "error",
                text: "Failed to load cart items. Please try again."
            });
            setCart([]);
            setCartTotal(0);
        } finally {
            setFetchingCart(false);
        }
    };

    const loadDrinkSelectionsFromStorage = () => {
        try {
            const storedSelections = localStorage.getItem("cartDrinkSelections");
            if (storedSelections) {
                const parsedSelections = JSON.parse(storedSelections);
                setDrinkSelections(parsedSelections);
                return parsedSelections;
            }
            return {};
        } catch (error) {
            console.error("❌ Error loading drink selections:", error);
            return {};
        }
    };

    useEffect(() => {

        loadDrinkSelectionsFromStorage();

        if (propUserData && Object.keys(propUserData).length > 0) {

            const processedUserData = {
                name: propUserData.name || propUserData.fullName || "",
                email: propUserData.email || "",
                phone: propUserData.phone || propUserData.phoneNumber || "",
                street: propUserData.street || propUserData.address?.street || "",
                city: propUserData.city || propUserData.address?.city || "",
                country: propUserData.country || propUserData.address?.country || "Egypt",
            };

            setUserData(processedUserData);
            localStorage.setItem("user", JSON.stringify(processedUserData));
        }

        if (propDeliveryOption) {
            setDeliveryOption(propDeliveryOption);
            localStorage.setItem("cartDeliveryOption", propDeliveryOption);
        }
        fetchCartFromAPI();

    }, [propUserData, propDeliveryOption]);

    const findDrinkForItem = useMemo(() => {
        return ({ productId, unitIndex, cartItemId }) => {
            const key = `${productId}-${unitIndex}-${cartItemId}`;

            if (drinkSelections[key]) {
                return drinkSelections[key];
            }

            for (const [drinkKey, drinkData] of Object.entries(drinkSelections)) {
                const parts = drinkKey.split('-');
                if (parts.length === 3) {
                    const [drinkProductId, drinkUnitIndex, drinkCartItemId] = parts;
                    if (
                        drinkProductId === productId &&
                        parseInt(drinkUnitIndex) === unitIndex &&
                        drinkCartItemId === cartItemId
                    ) {
                        return drinkData;
                    }
                }
            }
            return null;
        };
    }, [drinkSelections]);

    const expandedCartItems = useMemo(() => {
        if (!cart || cart.length === 0) {
            return [];
        }
        const expanded = [];

        cart.forEach((cartItem) => {
            const { productId, quantity, _id: cartItemId } = cartItem;

            if (!productId || !productId._id) {
                console.error("❌ Item without valid product ID:", cartItem);
                return;
            }

            const productIdValue = productId._id;
            const itemQuantity = quantity || 1;
            for (let i = 0; i < itemQuantity; i++) {
                const drinkData = findDrinkForItem({
                    productId: productIdValue,
                    unitIndex: i,
                    cartItemId
                });

                expanded.push({
                    uniqueId: `${productIdValue}-${i}-${cartItemId}`,
                    stableKey: `${productIdValue}-${i}-${cartItemId}`,
                    cartItemId,
                    unitIndex: i,
                    originalProductId: productIdValue,
                    productData: {
                        _id: productIdValue,
                        name: productId.name || "Unknown Product",
                        price: productId.price || 0,
                        image: productId.image || "/Logo.PNG",
                    },
                    selectedDrink: drinkData
                });
            }
        });
        return expanded;
    }, [cart, drinkSelections, findDrinkForItem]);

    const groupedCartItems = useMemo(() => {
        const groups = {};

        expandedCartItems.forEach(item => {
            const productId = item.productData._id;
            if (!groups[productId]) {
                groups[productId] = {
                    productData: item.productData,
                    quantity: 0,
                    items: []
                };
            }

            groups[productId].items.push(item);
            groups[productId].quantity = groups[productId].items.length;
        });

        return groups;
    }, [expandedCartItems]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const drinksTotal = useMemo(() => {
        if (!drinkSelections || Object.keys(drinkSelections).length === 0) return 0;

        return Object.values(drinkSelections).reduce((total, drinkData) => {
            return total + Number(drinkData.drink?.price || 0);
        }, 0);
    }, [drinkSelections]);

    const deliveryFee = deliveryOption === "delivery" ? 50 : 0;
    const calculatedTotal = cartTotal + drinksTotal + deliveryFee;
    const itemsWithDrinks = useMemo(() =>
        expandedCartItems.filter(item => item.selectedDrink).length,
        [expandedCartItems]
    );

    const isValidOrder = useMemo(() => {
        if (!selectedDate || !selectedTimeSlot) return false;

        const hasPersonalInfo = userData.name && userData.phone && userData.email;
        if (!hasPersonalInfo) return false;

        if (deliveryOption === "delivery") {
            const hasAddress = userData.street && userData.city && userData.country;
            if (!hasAddress) return false;
        }

        if (!cart || cart.length === 0) return false;
        if (!localStorage.getItem("sessionId")) return false;

        return true;
    }, [selectedDate, selectedTimeSlot, userData, deliveryOption, cart]);

   const handleSubmitOrder = async () => {
    if (!isValidOrder) {
        setMessage({
            type: "error",
            text: "Please complete all required information first"
        });
        return;
    }

    setLoading(true);
    setMessage(null);

    try {
        const formattedDate = selectedDate ? selectedDate.format('DD/MM/YYYY') : null;
        const sessionId = localStorage.getItem("sessionId");
        const cafeProductArray = Object.values(drinkSelections).map(selection => ({
            name: selection.drink?.productName || "Unknown Drink",
            price: selection.drink?.price || 0,
            quantity: 1
        }));

        const orderPayload = {
            address: {
                street: userData.street.trim(),
                city: userData.city.trim(),
                country: userData.country.trim(),
            },
            name: userData.name.trim(),
            phone: userData.phone.trim(),
            cartId: cartId || localStorage.getItem("cartId") || "", 
            cafe: cafeProductArray.length > 0 ? "689b9a7a7c1bab94ba870113" : null,
            cafeProduct: cafeProductArray,
            selectedDate: formattedDate,
            selectedTimeSlote: selectedTimeSlot,
            contactPhone: `+2${userData.phone.trim()}`,
        };

        Object.keys(orderPayload).forEach(key => {
            if (orderPayload[key] === null || orderPayload[key] === undefined) {
                delete orderPayload[key];
            }
        });

        const headers = {
            'Content-Type': 'application/json'
        };

        if (sessionId) {
            headers["sessionId"] = sessionId;
        }

        const response = await axios.post(
            "https://flowers-vert-six.vercel.app/api/order",
            orderPayload,
            { headers }
        );

        setMessage({
            type: "success",
            text: "🎉 Order placed successfully!"
        });

        localStorage.removeItem("cartDrinkSelections");
        localStorage.removeItem("cartDeliveryOption");
        localStorage.removeItem("user");
        localStorage.removeItem("cartId");
        setCart([]);
        setCartTotal(0);
        setDrinkSelections({});

        setTimeout(() => {
            if (onConfirm) {
                onConfirm({
                    orderId: response.data.order?._id || response.data._id || `ORD-${Date.now().toString().slice(-6)}`,
                    selectedDate: formattedDate,
                    selectedTimeSlot: selectedTimeSlot,
                    totalAmount: calculatedTotal
                });
            }
        }, 1500);

    } catch (err) {
        console.error("❌ Full Order Error:", err);
        console.error("❌ Error Response:", err.response?.data);
        console.error("❌ Validation Details:", JSON.stringify(err.response?.data?.details, null, 2));
        
        let errorMessage = "Failed to place order. Please try again.";
        
        if (err.response?.data?.details) {
            errorMessage = "Validation Errors:\n";
            err.response.data.details.forEach((detail, index) => {
                console.error(`Error ${index + 1}:`, detail);
                errorMessage += `\n${index + 1}. ${detail.message || JSON.stringify(detail)}`;
            });
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        
        setMessage({
            type: "error",
            text: errorMessage
        });
    } finally {
        setLoading(false);
    }
};
    const toggleFixedSummary = () => setShowFixedSummary(!showFixedSummary);

    const handleRefreshCart = () => {
        fetchCartFromAPI();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 py-6 px-4 pb-32 lg:pb-6"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Review Your Order
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Please confirm your details before proceeding
                    </p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center justify-center gap-3 mb-6 p-4 rounded-lg border ${message.type === "success"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-red-50 text-red-800 border-red-200"
                            }`}
                    >
                        {message.type === "success" ? (
                            <FiCheckCircle className="text-green-600 text-xl" />
                        ) : (
                            <FiAlertCircle className="text-red-600 text-2xl" />
                        )}
                        <span className="text-center font-medium">{message.text}</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <PersonalInfoSection
                            userData={userData}
                            deliveryOption={deliveryOption}
                        />

                        <ScheduleSection
                            deliveryOption={deliveryOption}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedTimeSlot={selectedTimeSlot}
                            setSelectedTimeSlot={setSelectedTimeSlot}
                        />

                        <OrderItemsSection
                            groupedItems={groupedCartItems}
                            drinkSelections={drinkSelections}
                            expandedItems={expandedCartItems}
                            loading={fetchingCart}
                            cartItems={cart}
                        />
                    </div>

                    <div className="hidden lg:block lg:col-span-1">
                        <OrderSummarySection
                            totalPrice={cartTotal}
                            drinksTotal={drinksTotal}
                            deliveryOption={deliveryOption}
                            deliveryFee={deliveryFee}
                            calculatedTotal={calculatedTotal}
                            itemsWithDrinks={itemsWithDrinks}
                            selectedDate={selectedDate}
                            selectedTimeSlot={selectedTimeSlot}
                            isValidOrder={isValidOrder}
                            loading={loading}
                            fetchingCart={fetchingCart}
                            onBack={onBack}
                            onSubmitOrder={handleSubmitOrder}
                        />
                    </div>
                </div>
            </div>

            <MobileSummary
                showFixedSummary={showFixedSummary}
                toggleFixedSummary={toggleFixedSummary}
                cart={cart}
                totalPrice={cartTotal}
                drinksTotal={drinksTotal}
                deliveryOption={deliveryOption}
                deliveryFee={deliveryFee}
                calculatedTotal={calculatedTotal}
                itemsWithDrinks={itemsWithDrinks}
                isValidOrder={isValidOrder}
                loading={loading}
                fetchingCart={fetchingCart}
                onBack={onBack}
                onSubmitOrder={handleSubmitOrder}
            />
        </motion.div>
    );
};

export default ReviewOrderMain;
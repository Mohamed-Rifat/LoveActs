import React, { useState } from "react";
import { useToken } from "../../../Context/TokenContext/TokenContext";
import axios from "axios";
import { useCart } from "../../../hooks/UseCart";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

export default function ReviewOrder({
    selectedCafe,
    selectedDrink,
    userData,
    deliveryOption,
    onBack,
    onConfirm
}) {
    const { cart, clearAllCart, cartId } = useCart();
    const { token } = useToken();
    const [selectedTimeSlote, setselectedTimeSlote] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 365);
    const formattedNextWeek = nextWeek.toISOString().split("T")[0];

    const deliveryTimes = [
        { id: "10-12", label: "10:00 AM - 12:00 PM", value: "10:00 AM - 12:00 PM" },
        { id: "12-2", label: "12:00 PM - 2:00 PM", value: "12:00 PM - 2:00 PM" },
        { id: "2-4", label: "2:00 PM - 4:00 PM", value: "2:00 PM - 4:00 PM" },
        { id: "4-6", label: "4:00 PM - 6:00 PM", value: "4:00 PM - 6:00 PM" },
        { id: "6-8", label: "6:00 PM - 8:00 PM", value: "6:00 PM - 8:00 PM" },
    ];

    const handleTimeChange = (e) => setselectedTimeSlote(e.target.value);
    const handleDateChange = (e) => setSelectedDate(e.target.value);

    const totalPrice = cart.reduce(
        (total, item) => total + Number(item.productId.price) * Number(item.quantity || 1),
        0
    );
    const baseTotal = totalPrice + Number(selectedDrink?.price || 0);
    const deliveryFee = deliveryOption === "delivery" ? 50 : 0;
    const total = baseTotal + deliveryFee;

    const handleConfirm = async () => {
        if (!selectedTimeSlote || !selectedDate) {
            setMessage({ type: "error", text: "Please select both date and pickup time" });
            return;
        }

        setLoading(true);
        setMessage(null);
        const dateParts = selectedDate.split("-");
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        try {
            const orderPayload = {
                cartId,
                address: {
                    street: userData?.street || "Not specified",
                    city: userData?.city || "Not specified",
                    country: userData?.country || "Not specified",
                },
                contactPhone: userData.phone || "Not specified",
                cafe: selectedCafe?._id || null,
                selectedDate: formattedDate,
                selectedTimeSlote: selectedTimeSlote,
                cafeProduct: selectedDrink
                    ? {
                        name: selectedDrink.productName,
                        price: selectedDrink.price,
                    }
                    : null,
            };

            const response = await axios.post(
                "https://flowers-vert-six.vercel.app/api/order",
                orderPayload,
                {
                    headers: { Authorization: `User ${token}` },
                }
            );

            setMessage({
                type: "success",
                text: response?.data?.message || "Order placed successfully!",
            });
            clearAllCart();
            if (onConfirm) onConfirm(selectedDate, selectedTimeSlote);
        } catch (err) {
            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    "Failed to place order. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Order</h1>
                    <p className="text-gray-600 text-lg">
                        Please confirm your details before proceeding
                    </p>
                </div>

                {message && (
                    <div
                        className={`flex items-center justify-center gap-2 mb-8 px-4 py-3 rounded-lg border text-sm font-medium ${message.type === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}
                    >
                        {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name", value: userData?.name },
                                    { label: "Email", value: userData?.email },
                                    { label: "Phone", value: userData?.phone },
                                    {
                                        label: "Address",
                                        value:
                                            userData?.street &&
                                            `${userData.street}, ${userData.city}, ${userData.country}`,
                                    },
                                ].map((field, i) => (
                                    <div key={i}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 cursor-not-allowed">
                                            {field.value || "Not specified"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Pickup Schedule
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        min={formattedToday}
                                        max={formattedNextWeek}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CF848A] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Time
                                    </label>
                                    <select
                                        value={selectedTimeSlote}
                                        onChange={handleTimeChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CF848A] focus:border-transparent"
                                    >
                                        <option value="">Choose a time</option>
                                        {deliveryTimes.map((time) => (
                                            <option key={time.id} value={time.value}>
                                                {time.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedDate && selectedTimeSlote && (
                                <div className="mt-6 p-4 bg-[#FFF3F3]  border border-[#F3D6D6] text-center text-[#A85C68] font-medium">
                                    <p>
                                        Pickup on{" "}
                                        {new Date(selectedDate).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                        })}{" "}
                                        at {selectedTimeSlote}
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Order Items
                            </h2>

                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-3">Products</h3>
                                {cart?.length ? (
                                    <div className="space-y-3">
                                        {cart.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={item.productId?.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.productId?.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {item.quantity} × {item.productId?.price} EGP
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="font-semibold text-gray-900">
                                                    {Number(item.productId?.price) * Number(item.quantity || 1)} EGP
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                ) : (
                                    <p className="text-center text-gray-500 py-6">
                                        No products in cart
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-700 mb-3">Selected Drink</h3>
                                {selectedCafe && selectedDrink ? (
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={selectedDrink.image || "/Logo.PNG"}
                                                alt={selectedDrink.productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {selectedDrink.productName}
                                                </p>
                                                <p className="text-sm text-gray-600">from {selectedCafe.name}</p>
                                            </div>
                                        </div>

                                        <p className="font-semibold text-gray-900">
                                            {selectedDrink.price} EGP
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-6">No drink selected</p>
                                )}
                            </div>

                        </section>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Products Total</span>
                                    <span>{totalPrice} EGP</span>
                                </div>
                                {selectedDrink && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Drink</span>
                                        <span>{selectedDrink.price} EGP</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>{deliveryFee} EGP</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>{total} EGP</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">

                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300 text-sm text-yellow-800 flex items-center gap-3">
                                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-yellow-600 font-bold">!</span>
                                    </div>
                                    <p className="text-left flex-1">
                                        You can modify your order before confirming.
                                    </p>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedTimeSlote || !selectedDate || loading}
                                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${selectedTimeSlote && selectedDate && !loading
                                        ? "bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white hover:from-[#A85C68] hover:to-[#CF848A] shadow-md"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="animate-spin text-lg" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle className="text-lg" /> Confirm Order
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onBack}
                                    disabled={loading}
                                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                >
                                    Back
                                </button>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

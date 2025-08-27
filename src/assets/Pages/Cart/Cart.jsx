import { useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import Loader from "../../Components/Loader/Loader";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

export default function Cart() {
  const { items = [], loading, removeFromCart, updateQuantity, pending } = useCart();

  if (loading) return <Loader />;

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FiShoppingCart className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some products to see them here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(items) && items.map((item) => {
          const productId = item._id || item.id;
          return (
            <div key={productId} className="bg-white rounded-2xl shadow p-4 flex flex-col">
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.price} LE</p>

              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => updateQuantity(productId, item.quantity - 1)}
                  disabled={item.quantity <= 1 || pending[`add-${productId}`]}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(productId, item.quantity + 1)}
                  disabled={pending[`add-${productId}`]}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(productId)}
                disabled={pending[`add-${productId}`]}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 />
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

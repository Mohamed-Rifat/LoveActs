import { useEffect, useState } from "react";
import { useCart } from "../../Context/CartContext";
import Loader from "../../Components/Loader/Loader";
import { FiShoppingCart, FiRefreshCw, FiX } from "react-icons/fi";
import axios from "axios";

export default function Products() {
  const { addToCart, pending, getCart, numOfCartItems, setNumOfCartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const API_BASE = "https://flowers-vert-six.vercel.app/api";

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/product/user`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Open Modal
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  // Add to Cart Handler
  const handleAddToCart = async (productId, quantity) => {
    await addToCart(productId, quantity);
    await getCart(); // لتحديث العدد في Navbar
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const productId = product._id || product.id;
          return (
            <div
              key={productId}
              className={`bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden relative ${
                product.isDeleted ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="px-3 py-1 text-sm rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(productId, 1)}
                    disabled={product.isDeleted || pending[`add-${productId}`]}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pending[`add-${productId}`] ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiShoppingCart />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative p-6">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <FiX size={24} />
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-64 w-full object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-gray-600 mb-2">{selectedProduct.description}</p>
            <p className="text-xl font-semibold mb-4">${selectedProduct.price}</p>

            <div className="flex items-center gap-3 mb-4">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 border rounded-lg px-2 py-1 text-center"
              />
            </div>

            <button
              onClick={() =>
                handleAddToCart(selectedProduct._id || selectedProduct.id, quantity)
              }
              disabled={
                selectedProduct.isDeleted ||
                pending[`add-${selectedProduct._id || selectedProduct.id}`]
              }
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending[`add-${selectedProduct._id || selectedProduct.id}`] ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <>
                  <FiShoppingCart />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw, FiShoppingBag, FiTag, FiClock, FiStar, FiShoppingCart, FiPlus, FiMinus, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (productId, qty = 1) => {
    setAddingProductId(productId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must log in first');
        return;
      }

      const response = await axios.post(
        'https://flowers-vert-six.vercel.app/api/cart/add-to-cart',
        {
          productId: productId,
          quantity: qty
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('The product has been added to the cart successfully');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(`Addition failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setAddingProductId(null);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("You must log in first");
      }

      const response = await axios.get(
        "https://flowers-vert-six.vercel.app/api/product/user",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      const productsData = response.data?.products || response.data?.data || response.data || [];
      if (!Array.isArray(productsData)) {
        throw new Error("Invalid data format");
      }

      setProducts(productsData);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching the products. Please try again later.";
      setError(errorMessage);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();

    let filtered = products
      .filter(product =>
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
      )
      .filter(product =>
        categoryFilter ? product.category === categoryFilter : true
      );

    switch(sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, categoryFilter, sortBy]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const truncateDescription = (text, wordCount = 10) => {
    if (!text) return "";
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const resetQuantity = () => {
    setQuantity(1);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Our Products</h1>
            <p className="text-gray-600">Discover our exclusive product collection</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-96">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Search products"
              />
            </div>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-1"
              aria-label="Refresh product list"
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Category:</span>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse overflow-hidden"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </motion.div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id || product.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      resetQuantity();
                    }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <FiShoppingBag className="text-gray-400 text-3xl" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {product.isDeleted ? (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Unavailable
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                      {product.category && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name || "Unnamed Product"}
                    </h2>

                    {product.description && (
                      <p className="mt-3 text-gray-500 text-sm line-clamp-2 mb-3">
                        {truncateDescription(product.description, 10)}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-blue-600">
                        {product.price ? `${product.price} LE` : "0 LE"}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            resetQuantity();
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => handleAddToCart(product._id || product.id, 1)}
                      disabled={product.isDeleted || addingProductId === (product._id || product.id)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                        ${product.isDeleted 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {addingProductId === (product._id || product.id) ? (
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm || categoryFilter
                ? "No products match your search criteria. Try different filters."
                : "No products available at the moment."}
            </p>
            {(searchTerm || categoryFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-gray-600 text-lg" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-full bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiShoppingBag className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedProduct.name || "Unnamed Product"}
                      </h2>
                      
                      <div className="flex items-center gap-2 mb-4">
                        {selectedProduct.isDeleted ? (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Unavailable
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Available
                          </span>
                        )}
                        {selectedProduct.category && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {selectedProduct.category}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-2xl font-bold text-blue-600 mb-4">
                        {selectedProduct.price ? `${selectedProduct.price} LE` : "0 LE"}
                      </p>
                    </div>

                    {selectedProduct.description && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-700 mb-2">Quantity</h3>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={decrementQuantity}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <FiMinus className="text-gray-600" />
                        </button>
                        
                        <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                        
                        <button 
                          onClick={incrementQuantity}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <FiPlus className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(selectedProduct._id || selectedProduct.id, quantity)}
                      disabled={selectedProduct.isDeleted || addingProductId === (selectedProduct._id || selectedProduct.id)}
                      className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2
                        ${selectedProduct.isDeleted 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {addingProductId === (selectedProduct._id || selectedProduct.id) ? (
                        <>
                          <FiRefreshCw className="animate-spin" />
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <FiShoppingCart />
                          Add {quantity > 1 ? `${quantity} Items` : 'to Cart'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
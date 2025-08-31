import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import { FiShoppingCart, FiX, FiMapPin, FiClock, FiCoffee, FiStar, FiSearch, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Cafes() {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://flowers-vert-six.vercel.app/api/cafe/display-all-cafes"
        );
        const cafesData = data?.cafeData || data || [];
        setCafes(cafesData);
        setFilteredCafes(cafesData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load cafes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  useEffect(() => {
    let result = [...cafes];

    if (searchQuery) {
      result = result.filter(cafe =>
        cafe.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter === "withProducts") {
      result = result.filter(cafe => cafe.products && cafe.products.length > 0);
    }

    setFilteredCafes(result);
  }, [cafes, searchQuery, activeFilter]);

  const handleViewProducts = (cafe) => {
    setSelectedCafe(cafe);
  };

  const handleCloseProducts = () => {
    setSelectedCafe(null);
  };

  const handleAddToCart = (product, cafeName) => {
    const productWithCafe = { ...product, cafeName };
    addToCart(productWithCafe);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md mx-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCoffee className="text-gray-400 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Cafes Available</h2>
          <p className="text-gray-600">Check back later for new cafe openings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent self-center  whitespace-nowrap font-dancing">
            Our Cafés</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg ">
            Discover unique coffee experiences and handcrafted beverages at our carefully curated locations
          </p>
        </motion.div>

        <div className="mb-10 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cafes by name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-xl transition ${activeFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All Cafes
              </button>
              <button
                onClick={() => setActiveFilter("withProducts")}
                className={`px-4 py-2 rounded-xl transition ${activeFilter === "withProducts"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                With Products
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCafes.length}</span> of <span className="font-semibold">{cafes.length}</span> cafes
          </p>
        </div>

        {filteredCafes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FiSearch className="text-gray-300 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No cafes found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCafes.map((cafe) => (
              <motion.div
                key={cafe._id || cafe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cafe.image || "/Logo.PNG"}
                    alt={cafe.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {cafe.products && cafe.products.length > 0 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {cafe.products.length} products
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                      {cafe.name || "Unnamed Cafe"}
                    </h2>
                    <div className="flex items-center text-yellow-400 ml-2">
                      <FiStar className="fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>

                  {cafe.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{cafe.description}</p>
                  )}

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500">
                      <FiMapPin className="mr-2" />
                      {cafe.location ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline truncate"
                        >
                          {cafe.location}
                        </a>
                      ) : (
                        <span className="text-sm">Location not specified</span>
                      )}
                    </div>

                    {cafe.openingHours && (
                      <div className="flex items-center text-gray-500">
                        <FiClock className="mr-2" />
                        <span className="text-sm">{cafe.openingHours}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleViewProducts(cafe)}
                    disabled={!cafe.products || cafe.products.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {cafe.products && cafe.products.length > 0 ? (
                      <>
                        View Products
                        <FiChevronRight />
                      </>
                    ) : (
                      "No Products Available"
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedCafe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={handleCloseProducts}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCafe.name}'s Menu
                    </h2>
                    {selectedCafe.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCafe.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm mt-1 block"
                      >
                        {selectedCafe.location}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={handleCloseProducts}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {selectedCafe.products && selectedCafe.products.length > 0 ? (
                    <div className="grid gap-4">
                      {selectedCafe.products.map((product) => (
                        <motion.div
                          key={product._id || product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {product.productName}
                            </h3>
                            {product.description && (
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            {product.price && (
                              <p className="text-indigo-600 font-bold text-lg mt-2">
                                ${product.price}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCart(product, selectedCafe.name)}
                            className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors ml-4"
                          >
                            <FiShoppingCart size={20} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiCoffee className="text-gray-300 text-4xl mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Available</h3>
                      <p className="text-gray-500">This cafe hasn't added any products yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

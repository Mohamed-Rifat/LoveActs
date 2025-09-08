import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import { FiX, FiCoffee, FiStar, FiSearch, FiChevronRight } from "react-icons/fi";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("name");

  const itemsPerPage = 8;
  const sortedProducts = [...(selectedCafe?.products || [])].sort((a, b) => {
    if (sortOption === "priceAsc") return a.price - b.price;
    if (sortOption === "priceDesc") return b.price - a.price;
    return a.productName.localeCompare(b.productName);
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
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

        <div className="mb-10 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCafes.map((cafe) => (
              <motion.div
                key={cafe._id || cafe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white overflow-hidden transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cafe.image || "/Logo.PNG"}
                    alt={cafe.name}
                    className="w-full h-full "
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
                  </div>
                  <button
                    onClick={() => handleViewProducts(cafe)}
                    disabled={!cafe.products || cafe.products.length === 0}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300
    ${cafe.products && cafe.products.length > 0
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"}`
                    }
                  >
                    {cafe.products && cafe.products.length > 0 ? (
                      <>
                        View Products
                        <FiChevronRight className="transition-transform group-hover:translate-x-1" />
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
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`bg-white shadow-xl overflow-hidden flex flex-col w-full h-full rounded-none sm:max-w-2xl sm:max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedCafe.name}'s Menu
                  </h2>
                  <button
                    onClick={handleCloseProducts}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {selectedCafe.products && selectedCafe.products.length > 0 ? (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">Drinks</h3>

                        <div className="relative inline-block w-48">
                          <select
                            onChange={(e) => setSortOption(e.target.value)}
                            className="appearance-none w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium 
               text-gray-700 shadow-sm cursor-pointer
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               hover:border-gray-300 transition-all duration-200"
                          >
                            <option value="name">Sort by Name</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                          </select>

                          <svg
                            className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-hover:text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                      </div>

                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {paginatedProducts.map((product) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-4 flex flex-col items-center text-center rounded-xl shadow-sm"
                          >
                            <img
                              src={product.image || "/Logo.PNG"}
                              alt={`${product.productName} from ${selectedCafe.name}`}
                              className="w-20 h-20 object-cover rounded-full mb-3 border"
                            />
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate w-full">
                              {product.productName}
                            </h3>
                            {product.price && (
                              <p className="text-indigo-600 font-bold mt-1 text-sm sm:text-base">
                                {product.price} LE
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <img
                        src="/coffee-illustration.png"
                        alt="No drinks illustration"
                        className="w-32 h-32 mx-auto mb-4 opacity-80"
                      />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Drinks Available
                      </h3>
                      <p className="text-gray-500">
                        This cafe hasn't added any drinks yet. Check back later ☕
                      </p>
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

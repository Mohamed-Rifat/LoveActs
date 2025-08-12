import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw, FiMapPin, FiHome, FiStar, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Cafes() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCafe, setSelectedCafe] = useState(null);

  const fetchCafes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("You must log in first");
      }

      const response = await axios.get(
        "https://flowers-vert-six.vercel.app/api/cafe/display-all-cafes",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      const cafesData = response.data?.cafeData || response.data?.data || response.data?.cafes || [];
      if (!Array.isArray(cafesData)) {
        throw new Error("Invalid data format");
      }

      setCafes(cafesData);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "An error occurred on the server. Please try again later.";
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
    fetchCafes();
  }, []);

  const filteredCafes = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return cafes.filter(
      (cafe) =>
        cafe.name?.toLowerCase().includes(search) ||
        cafe.location?.toLowerCase().includes(search) ||
        cafe.address?.toLowerCase().includes(search)
    );
  }, [cafes, searchTerm]);

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

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Discover Cafés</h1>
            <p className="text-gray-600">Find your perfect coffee spot</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="cafe-search"
                name="cafeSearch"
                placeholder="Search by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Search cafes"
              />
            </div>

            <button
              onClick={fetchCafes}
              disabled={loading}
              className="p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-1"
              aria-label="Refresh cafes list"
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
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

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredCafes.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredCafes.map((cafe) => (
                <motion.div
                  key={cafe._id || cafe.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                        {cafe.name || "Unnamed Cafe"}
                      </h2>
                      {cafe.rating && (
                        <span className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          <FiStar className="mr-1" /> {cafe.rating}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-start">
                        <FiMapPin className="flex-shrink-0 mt-1 mr-2 text-gray-400" />
                        <p className="text-sm">{cafe.location || "Location not specified"}</p>
                      </div>

                      <div className="flex items-start">
                        <FiHome className="flex-shrink-0 mt-1 mr-2 text-gray-400" />
                        <p className="text-sm">{cafe.address || "No address provided"}</p>
                      </div>

                      {cafe.openingHours && (
                        <div className="flex items-start">
                          <FiClock className="flex-shrink-0 mt-1 mr-2 text-gray-400" />
                          <p className="text-sm">{cafe.openingHours}</p>
                        </div>
                      )}
                    </div>

                    {cafe.description && (
                      <p className="mt-3 text-gray-500 text-sm line-clamp-2">
                        {cafe.description}
                      </p>
                    )}
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedCafe(cafe)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      View Details
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
            <h3 className="text-lg font-medium text-gray-900">No cafes found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "We couldn't find any cafes matching your search. Try different keywords."
                : "There are currently no cafes available. Please check back later."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Cafe Details Modal */}
      <AnimatePresence>
        {selectedCafe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCafe(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCafe.name || "Unnamed Cafe"}
                  </h2>
                  <button
                    onClick={() => setSelectedCafe(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedCafe.image && (
                    <img
                      src={selectedCafe.image}
                      alt={selectedCafe.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FiMapPin className="mr-2 text-gray-400" />
                      <span className="text-gray-600">{selectedCafe.location || "N/A"}</span>
                    </div>

                    <div className="flex items-center">
                      <FiHome className="mr-2 text-gray-400" />
                      <span className="text-gray-600">{selectedCafe.address || "N/A"}</span>
                    </div>

                    {selectedCafe.rating && (
                      <div className="flex items-center">
                        <FiStar className="mr-2 text-gray-400" />
                        <span className="text-gray-600">{selectedCafe.rating}/5</span>
                      </div>
                    )}

                    {selectedCafe.openingHours && (
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-gray-400" />
                        <span className="text-gray-600">{selectedCafe.openingHours}</span>
                      </div>
                    )}
                  </div>

                  {selectedCafe.description && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">About</h4>
                      <p className="text-gray-600">{selectedCafe.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
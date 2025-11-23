import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import { FiX, FiCoffee, FiStar, FiSearch, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function Cafes() {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { addToCart } = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("name");
  const [drinkFilter, setDrinkFilter] = useState("all");
  const navigate = useNavigate();

  const itemsPerPage = 12;

  const filteredProducts =
    selectedCafe?.products?.filter((product) => {
      const name = product.productName?.toLowerCase() || "";
      if (drinkFilter === "hot") return name.includes("hot");
      if (drinkFilter === "cold") return name.includes("cold");
      return true;
    }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
        const sortedByDate = cafesData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCafes(sortedByDate);
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
      result = result.filter((cafe) =>
        cafe.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter === "withProducts") {
      result = result.filter((cafe) => cafe.products && cafe.products.length > 0);
    }

    setFilteredCafes(result);
  }, [cafes, searchQuery, activeFilter]);

  const handleViewProducts = (cafe) => {
    if (cafe.products && cafe.products.length > 0) {
      setSelectedCafe(cafe);
      setDrinkFilter("all");
      setCurrentPage(1);
    }
  };

  const handleCloseProducts = () => {
    setSelectedCafe(null);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product, cafeName) => {
    const productWithCafe = { ...product, cafeName };
    addToCart(productWithCafe);
  };

  const handleBrowseFlowers = () => {
    setSelectedProduct(null);
    setSelectedCafe(null);
    navigate('/products');
  };

  return (
    <>
      <Helmet>
        <title>Best Cafés & Drinks | Love Acts</title>
        <meta
          name="description"
          content="Discover the best cafés and handcrafted drinks in Egypt, perfectly paired with Love Acts luxury flowers. Complete your gift with a unique café experience."
        />
        <meta
          name="keywords"
          content="cafes, coffee, drinks, pair with flowers, flowers and coffee Egypt, Love Acts"
        />
        <meta
          property="og:title"
          content="Best Cafés & Drinks to Pair with Flowers | Love Acts"
        />
        <meta
          property="og:description"
          content="Explore our curated list of cafés and handcrafted drinks to make your flower gift unforgettable. Love Acts - more than flowers."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {loading ? (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            </div>

            <div className="mb-10 p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="relative w-full md:w-1/3">
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-6 rounded-3xl animate-pulse bg-white shadow-sm"
                >
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gray-200 mb-4"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-40"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-br from-[#CF848A] to-[#A85C68] bg-clip-text text-transparent self-center  whitespace-nowrap font-dancing">
                Our Cafés
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg ">
                Discover unique coffee experiences and handcrafted beverages at
                our carefully curated locations
              </p>
            </motion.div>

            <div className="mb-10 p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-xl transition ${activeFilter === "all"
                      ? "bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    All Cafes
                  </button>
                  <button
                    onClick={() => setActiveFilter("withProducts")}
                    className={`px-4 py-2 rounded-xl transition ${activeFilter === "withProducts"
                      ? "bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white"
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CF848A] focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredCafes.length}</span> of{" "}
                <span className="font-semibold">{cafes.length}</span> cafes
              </p>
            </div>

            {filteredCafes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <FiCoffee className="text-gray-300 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Cafes Available
                </h3>
                <p className="text-gray-500"> Check back later for new cafe openings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {filteredCafes.map((cafe) => {

                  
                  // مؤقت وهيتشال لما يتم التعاقد 
                  const forcedComingSoon = ["vasko", "dukes"].includes(
                    cafe.name?.toLowerCase()
                  );

                  const hasProducts = cafe.products && cafe.products.length > 0 && !forcedComingSoon;

                  return (
                    <motion.div
                      key={cafe._id || cafe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col items-center p-6 transition-all duration-300 relative ${!hasProducts ? 'opacity-70' : ''
                        }`}
                    >
                      {!hasProducts && (
                        <div className="absolute inset-0 bg-opacity-80 rounded-3xl z-10 flex items-center justify-center">
                          <div className="text-center transform -rotate-45">
                          </div>
                        </div>
                      )}

                      <div className="relative group">
                        <div className={`w-40 h-40 rounded-full overflow-hidden border-4 shadow-md transition-all duration-300 group-hover:shadow-xl ${hasProducts
                          ? 'border-gray-100 group-hover:border-[#CF848A]'
                          : 'border-gray-200'
                          }`}>
                          <img
                            src={cafe.image || "/Logo.PNG"}
                            alt={cafe.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/Logo.PNG";
                            }}
                          />
                          {!cafe.image && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CF848A]"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      <h2 className={`mt-4 text-lg font-semibold text-center truncate w-full ${!hasProducts ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                        {cafe.name || "Unnamed Cafe"}
                      </h2>

                      <button
                        onClick={() => handleViewProducts(cafe)}
                        disabled={!hasProducts}
                        className={`mt-4 w-44 flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300 group
                        ${hasProducts
                            ? "bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white shadow-md hover:shadow-lg hover:scale-105"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {hasProducts ? (
                          <>
                            View Products
                            <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                          </>
                        ) : (
                          "Coming Soon"
                        )}
                      </button>
                    </motion.div>
                  );
                })}
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
                          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setDrinkFilter("all")}
                                className={`px-3 py-1.5 rounded-lg text-sm ${drinkFilter === "all"
                                  ? "bg-[#CF848A] text-white"
                                  : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                All
                              </button>
                              <button
                                onClick={() => setDrinkFilter("hot")}
                                className={`px-3 py-1.5 rounded-lg text-sm ${drinkFilter === "hot"
                                  ? "bg-[#CF848A] text-white"
                                  : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                Hot
                              </button>
                              <button
                                onClick={() => setDrinkFilter("cold")}
                                className={`px-3 py-1.5 rounded-lg text-sm ${drinkFilter === "cold"
                                  ? "bg-[#CF848A] text-white"
                                  : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                Cold
                              </button>
                            </div>

                            <div className="relative inline-block w-48">
                              <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="appearance-none w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium 
               text-gray-700 shadow-sm cursor-pointer
               focus:outline-none focus:ring-2 focus:ring-[#CF848A] focus:border-[#CF848A]
               hover:border-gray-300 transition-all duration-200"
                              >
                                <option value="name">Sort by Name</option>
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                              </select>

                              <svg
                                className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-hover:text-[#CF848A]"
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
                                className="bg-white p-4 flex flex-col items-center text-center rounded-xl shadow-sm cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
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
                                  <p className="text-[#CF848A] font-bold mt-1 text-sm sm:text-base">
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

            <AnimatePresence>
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedProduct(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white shadow-xl max-w-md w-full mx-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedProduct.productName}
                      </h2>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-center mb-6">
                        <img
                          src={selectedProduct.image || "/Logo.PNG"}
                          alt={selectedProduct.productName}
                          className="w-48 h-48 object-cover rounded-2xl shadow-md"
                        />
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedProduct.productName}
                          </h3>
                          {selectedProduct.price && (
                            <p className="text-3xl font-bold text-[#CF848A]">
                              {selectedProduct.price} LE
                            </p>
                          )}
                        </div>

                        <div className="bg-amber-50 border border-amber-200 p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <FiStar className="text-amber-600" size={18} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-amber-800 mb-1">
                                Important Note
                              </h4>
                              <p className="text-amber-700 text-sm">
                                To order this drink, you need to purchase a flower product first.
                                Complete your gift with a beautiful bouquet and enjoy your drink!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={handleBrowseFlowers}
                          className="flex-1 py-3 px-4 bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          Browse Flowers
                          <FiChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
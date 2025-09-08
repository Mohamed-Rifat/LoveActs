import { useEffect, useState, useRef } from "react";
import { useCart } from "../../Context/CartContext";
import { FiShoppingCart, FiRefreshCw, FiX, FiSearch, FiChevronDown, FiChevronUp, FiStar, FiChevronRight, FiHeart } from "react-icons/fi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
    <div className="relative h-52 w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white"></div>
    </div>
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  </div>
);

const Shimmer = () => (
  <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
);

export default function Products() {
  const { addToCart, pending, getCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const sortRef = useRef(null);

  const API_BASE = "https://flowers-vert-six.vercel.app/api";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/product/user`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description &&
            p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, sortOption]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseModal = () => setSelectedProduct(null);

  const handleAddToCart = async (productId, quantity) => {
    await addToCart(productId, quantity);
    await getCart();
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Name: A to Z", value: "name-asc" },
    { label: "Name: Z to A", value: "name-desc" },
  ];

  const placeholders = Array.from({ length: 8 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent self-center  whitespace-nowrap font-dancing">
            Discover Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our curated collection of premium products, carefully selected just for you.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-2/5">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="relative w-full md:w-1/4" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 hover:ring-2 hover:ring-indigo-500 transition"
            >
              {sortOptions.find(opt => opt.value === sortOption)?.label}
              {sortOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute left-0 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-50 overflow-hidden"
                >
                  {sortOptions.map(opt => (
                    <motion.li
                      key={opt.value}
                      whileHover={{ backgroundColor: "#f0f4ff" }}
                      onClick={() => { setSortOption(opt.value); setSortOpen(false); }}
                      className="px-4 py-3 cursor-pointer transition"
                    >
                      {opt.label}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {placeholders.map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Shimmer />
                  <ProductSkeleton />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((p) => {
              const id = p._id || p.id;
              const isPending = pending[`add-${id}`];
              const isFavorite = favorites.has(id);
              
              return (
                <motion.div
                  key={id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(id)}
                    className={`absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-sm ${
                      isFavorite 
                        ? "bg-red-500/20 text-red-500" 
                        : "bg-white/80 text-gray-500 hover:bg-white"
                    } transition-colors`}
                  >
                    <FiHeart className={isFavorite ? "fill-current" : ""} />
                  </motion.button>

                  {p.isDeleted && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                      Out of Stock
                    </div>
                  )}

                  <div className="relative overflow-hidden">
                    <div className="h-52 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <motion.img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewDetails(p)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <FiSearch className="text-gray-600" />
                    </motion.button>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{p.name}</h3>
                      <span className="text-lg font-bold text-indigo-600">{p.price} LE</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                      {p.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => handleViewDetails(p)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition"
                      >
                        Details
                        <FiChevronRight className="h-4 w-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(id, 1)}
                        disabled={p.isDeleted || isPending}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <FiRefreshCw className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <FiShoppingCart className="h-4 w-4" />
                        )}
                        {isPending ? "Adding..." : "Add to Cart"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* No Results Message */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mt-6"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiSearch className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any products matching your criteria. Try adjusting your search or filters.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSearchQuery(""); setSortOption("default"); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}

        {/* Product Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Product Image */}
                <div className="md:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseModal}
                    className="self-end text-gray-400 hover:text-gray-600 transition-colors mb-4"
                  >
                    <FiX size={24} />
                  </motion.button>

                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
                  >
                    {selectedProduct.name}
                  </motion.h2>

                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 mb-6 leading-relaxed"
                  >
                    {selectedProduct.description || "No description available for this product."}
                  </motion.p>

                  <div className="mt-auto">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex items-center justify-between mb-6"
                    >
                      <span className="text-3xl font-bold text-indigo-600">{selectedProduct.price} LE</span>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <motion.button
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="px-3 py-2 text-gray-500 transition-colors"
                          >-</motion.button>
                          <span className="px-4 py-2 bg-gray-50 font-medium">{quantity}</span>
                          <motion.button
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="px-3 py-2 text-gray-500 transition-colors"
                          >+</motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(selectedProduct._id || selectedProduct.id, quantity)}
                      disabled={selectedProduct.isDeleted || pending[`add-${selectedProduct._id || selectedProduct.id}`]}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg"
                    >
                      {pending[`add-${selectedProduct._id || selectedProduct.id}`] ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <FiRefreshCw className="h-5 w-5" />
                          </motion.div>
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <FiShoppingCart className="h-5 w-5" />
                          Add to Cart - {(selectedProduct.price * quantity).toFixed(2)} LE
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
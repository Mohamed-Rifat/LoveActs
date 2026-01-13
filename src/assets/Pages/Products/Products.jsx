import { useEffect, useState, useRef } from "react";
import { FiShoppingCart, FiRefreshCw, FiX, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/UseCart";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";

const ProductSkeleton = () => {
  return (
    <div className="group bg-white relative rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[420px] flex flex-col animate-pulse">
      <div className="relative overflow-hidden">
        <div className="h-[260px] w-full bg-gray-200" />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-5 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
        <div className="mt-auto">
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};


const Shimmer = () => (
  <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
);

export default function Products() {
  const { addToCart, pending, getCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [pendingGuestProduct, setPendingGuestProduct] = useState(null);
  const sortRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

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

  const handleGuestAdd = async () => {
    if (!pendingGuestProduct) return;

    setIsCreatingSession(true);
    try {
      const response = await axios.get("https://flowers-vert-six.vercel.app/get-seesion-id");
      const sessionId = response.data.sessionId;
      localStorage.setItem("sessionId", sessionId);

      await addToCart(pendingGuestProduct.productId, pendingGuestProduct.quantity);
      await getCart();

      setShowModal(false);
      setPendingGuestProduct(null);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleAddToCart = async (productId, qty = 1) => {
    const hasSession = localStorage.getItem("sessionId");

    if (token) {
      if (role === "Admin") {
        toast.error("You are an admin, you cannot add products!");
        return;
      }
      try {
        await addToCart(productId, qty);
        await getCart();
      } catch (err) {
        toast.error("Something went wrong while adding!");
      }
    }
    else if (hasSession) {
      try {
        await addToCart(productId, qty);
        await getCart();
      } catch (err) {
        toast.error("Something went wrong while adding!");
      }
    }
    else {
      const product = products.find(p => p._id === productId || p.id === productId);
      if (product) {
        setPendingGuestProduct({ productId, quantity: qty });
        setSelectedProduct(product);
        setShowModal(true);
      }
    }
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
      <Helmet>
        <title>Products | Love Acts</title>
        <meta
          name="description"
          content="Shop Love Acts collection of luxury flowers, romantic bouquets, and elegant floral arrangements. Perfect for weddings, engagements, and special occasions. Same-day delivery available in Egypt."
        />
        <meta
          name="keywords"
          content="flowers, luxury flowers, romantic bouquets, floral arrangements, send flowers Egypt, online flower shop, wedding flowers, Love Acts"
        />
        <meta property="og:title" content="Luxury Flowers & Romantic Bouquets | Love Acts" />
        <meta
          property="og:description"
          content="Discover Love Acts selection of premium flowers, bouquets, and floral gifts. Perfect for expressing love on every occasion."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Love Acts" />
        <meta property="og:url" content="https://loveacts.vercel.app/products" />
      </Helmet>

      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCreatingSession) {
              setShowModal(false);
              setSelectedProduct(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 max-w-sm w-full shadow-2xl text-center relative"
          >
            <button
              onClick={() => !isCreatingSession && (setShowModal(false), setSelectedProduct(null))}
              disabled={isCreatingSession}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 
                    1 0 111.414 1.414L11.414 10l4.293 
                    4.293a1 1 0 01-1.414 1.414L10 
                    11.414l-4.293 4.293a1 1 0 
                    01-1.414-1.414L8.586 10 
                    4.293 5.707a1 1 0 
                    010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="mx-auto flex items-center justify-center mb-4">
              <img className="h-28 w-auto" src="./Logo.PNG" alt="Love Acts Logo" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {isCreatingSession ? "Creating Guest Session..." : "Continue Shopping"}
            </h3>

            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              {isCreatingSession
                ? "Please wait while we set up your guest session..."
                : "To save your cart and checkout, please sign in. You can also continue as a guest."}
            </p>

            {!isCreatingSession ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('pendingProduct', JSON.stringify({
                      productId: selectedProduct._id,
                      name: selectedProduct.name,
                      price: selectedProduct.price,
                      image: selectedProduct.image
                    }));
                    setShowModal(false);
                    window.location.href = "/login";
                  }}
                  className="border-2 border-gray-200 text-gray-700 py-3 px-4 hover:bg-slate-300 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                >
                  Sign In
                </button>

                <button
                  onClick={handleGuestAdd}
                  disabled={isCreatingSession}
                  className="border-2 border-[#CF848A] text-[#CF848A] py-3 px-4 hover:bg-[#fef5f7] transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingSession ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FiRefreshCw className="h-5 w-5" />
                      </motion.div>
                      Setting up Guest Session...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="h-5 w-5" />
                      Continue as Guest
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors duration-300 mt-2"
                >
                  Maybe Later
                </button>
              </div>
            ) : (
              <div className="py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CF848A] mx-auto mb-4"></div>
                <p className="text-sm text-gray-500">Setting up your temporary cart...</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {isCreatingSession
                  ? "Your guest session will allow you to shop now and save items temporarily."
                  : "As a guest, your cart will be saved temporarily. We recommend creating an account to save your cart permanently."}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-br from-[#CF848A] to-[#A85C68] bg-clip-text text-transparent self-center  whitespace-nowrap font-dancing">
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
            className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
                  className="group bg-white relative rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[420px] flex flex-col"
                >

                  {p.isDeleted && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                      Out of Stock
                    </div>
                  )}

                  <div className="relative overflow-hidden">
                    <div className="h-[260px] w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{p.name?.split(" ").slice(0, 2).join(" ")}</h3>
                      <span className="text-lg font-bold text-[#CF848A]">{p.price} LE</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-2 line-clamp-2 min-h-[40px]">
                      {p.description || "No description available"}
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(id, 1)}
                        disabled={p.isDeleted || isPending}
                        className="flex items-center gap-2 bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-6 py-3 bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white rounded-xl hover:bg-[#CF848A] transition-colors font-medium"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedProduct && !showModal && (
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
                      <span className="text-3xl font-bold text-[#CF848A]">{selectedProduct.price} LE</span>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <motion.button
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="px-3 py-2 text-[#A85C68] transition-colors"
                          >-</motion.button>
                          <span className="px-4 py-2 bg-gray-50 text-[#CF848A] font-medium">{quantity}</span>
                          <motion.button
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="px-3 py-2 text-[#A85C68] transition-colors"
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
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#CF848A] to-[#A85C68] text-white px-6 py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg"
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
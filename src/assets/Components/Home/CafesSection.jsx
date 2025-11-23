import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiX, FiStar, FiChevronRight } from "react-icons/fi";

const CafeSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded mt-4"></div>
    </div>
  </div>
);

const ProductPopup = ({ product, onClose, onBrowseFlowers }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onClose}
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
            {product.productName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img
              src={product.image || "/Logo.PNG"}
              alt={product.productName}
              className="w-48 h-48 object-cover rounded-2xl shadow-md"
            />
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h3>
              {product.price && (
                <p className="text-3xl font-bold text-[#EB95A2]">
                  {product.price} LE
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
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onBrowseFlowers}
              className="flex-1 py-3 px-4 bg-gradient-to-br from-[#EB95A2] to-[#CF848A] text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Browse Flowers
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CafeModal = ({ cafe, onClose, onBrowseFlowers }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!cafe) return null;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
  };

  const handleBrowseFlowersFromProduct = () => {
    setSelectedProduct(null);
    onClose();
    onBrowseFlowers();
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-100 shadow-md max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-6">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 flex-shrink-0">
                    <img
                      src={cafe.image || "/Logo.PNG"}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{cafe.name}</h2>
                    <p className="text-gray-600 leading-relaxed flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#EB95A2] text-lg" />
                      {cafe.location ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-amber-700"
                        >
                          {cafe.location}
                        </a>
                      ) : (
                        "No Location available for this cafe."
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2 text-[#EB95A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800">Products</h3>
                  </div>

                  {cafe.products && cafe.products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {cafe.products.map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex flex-col items-center text-center p-6 transition-all duration-200 h-full cursor-pointer hover:scale-105"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleProductClick(item)}
                        >
                          <div className="w-28 h-28 rounded-full overflow-hidden border-2 mb-4">
                            <img
                              src={item.image || "/Logo.PNG"}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <span className="text-gray-800 font-medium text-lg mb-2 min-h-[48px] flex items-center justify-center text-center line-clamp-2">
                            {item.productName}
                          </span>

                          <span className="text-[#EB95A2] font-semibold px-3 py-1 rounded-full">
                            {item.price} LE
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-gray-500">No products available at the moment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            onClose={handleCloseProduct}
            onBrowseFlowers={handleBrowseFlowersFromProduct}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const CafesSection = ({ cafes = [], loading, navigate }) => {
  const [selectedCafe, setSelectedCafe] = useState(null);

  const handleBrowseFlowers = () => {
    setSelectedCafe(null);
    navigate("/products");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Cafes
          </motion.h2>
          <motion.button
            className="text-[#EB95A2] hover:text-[#f88b9b] font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/cafes")}
          >
            View All
          </motion.button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <CafeSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {cafes.slice(0, 6).map(cafe => {
                const id = cafe._id || cafe.id;
                return (
                  <div
                    key={id}
                    className="p-4 flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedCafe(cafe)}
                  >
                    <div className="relative mb-4">
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2">
                        <img
                          src={cafe.image || "/Logo.PNG"}
                          alt={cafe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {cafe.name || "Love Acts Cafe"}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
      <CafeModal
        cafe={selectedCafe}
        onClose={() => setSelectedCafe(null)}
        onBrowseFlowers={handleBrowseFlowers}
      />
    </section>
  );
};

export default CafesSection;
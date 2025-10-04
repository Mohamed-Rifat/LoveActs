import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

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

const FeaturedProducts = ({ products = [], loading, handleAddToCart, pending = {}, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const checkAuthAndAdd = async (id) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    if (token) {
      if (role === "Admin") {
        toast.error("You are an admin, you cannot add products!");
        return;
      }
      try {
        await handleAddToCart(id, 1);
        toast.success("Added to cart 🛒");
      } catch (err) {
        toast.error("Something went wrong while adding!");
      }
    } else {
      setSelectedProduct(id);
      setShowModal(true);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Products
          </motion.h2>
          <motion.button
            className="text-[#EB95A2] hover:text-[#f88b9b] font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/products")}
          >
            View All
          </motion.button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (<ProductSkeleton key={i} />))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {products.slice(0, 6).map((product) => {
              const id = product._id || product.id;
              return (
                <div
                  key={id}
                  className="bg-transparent p-2 shadow-none border-none rounded-none text-center 
             lg:bg-gray-50 lg:rounded-lg lg:hover:shadow-md lg:transition lg:overflow-hidden 
             flex flex-col h-full"
                >
                  <div className="relative overflow-hidden w-28 h-28 mx-auto lg:w-full lg:h-64">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=800&q=80"}
                      alt={`Product image of ${product.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full lg:rounded-none group-hover:scale-100 
                 lg:group-hover:scale-105 lg:transition lg:duration-300"
                    />
                  </div>

                  <div className="p-2 lg:p-6 flex flex-col flex-grow">
                    <div className="flex flex-col items-center gap-1 lg:flex-row lg:justify-between lg:items-center mb-2">
                      <h3 className="text-sm lg:text-xl font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <span className="text-lg lg:text-2xl font-bold text-[#d35d6f]">
                        {product.price} EGP
                      </span>
                    </div>



                    <p className="hidden lg:block text-gray-600 mb-4 line-clamp-2">
                      {product.description || "Premium product from Love Acts"}
                    </p>

                    <div className="mt-auto flex justify-center lg:justify-between items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => checkAuthAndAdd(id)}
                        disabled={Boolean(pending && pending[`add-${id}`])}
                        className=" w-full h-9 bg-[#EB95A2] text-white text-xs px-2 py-1 rounded hover:bg-[#f88b9b] transition 
                   lg:text-base lg:px-4 lg:py-2 flex items-center justify-center lg:w-full 
                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pending && pending[`add-${id}`] ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <FiRefreshCw className="h-4 w-4 mr-1" />
                            </motion.div>
                            Adding...
                          </>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-sm lg:text-xl font-medium">
                            <FiShoppingCart className="h-4 w-4 lg:h-6 lg:w-6" />
                            <span>Add</span>
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
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
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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

            <div className="mx-auto  flex items-center justify-center mb-4">
              <img className="h-28 w-auto" src="./Logo.PNG" alt="Love Acts Logo" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Sign In or Create Account
            </h3>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              To continue with your order, please sign in or create a new account.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/register");
                }}
                className="bg-gradient-to-r from-[#EB95A2] to-[#f88b9b] text-white py-3 px-4 hover:from-[#f88b9b] hover:to-[#EB95A2] transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Create Account
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/login");
                }}
                className="border-2 border-gray-200 text-gray-700 py-3 px-4 hover:bg-slate-300 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                Sign In
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors duration-300 mt-2"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;

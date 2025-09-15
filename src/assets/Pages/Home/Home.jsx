import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';
import { FiShoppingCart, FiCoffee, FiStar, FiSmartphone, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../hooks/UseCart';
import toast from "react-hot-toast";
import bruxies from "./../../../../public/bruxies.png"
import STEEP from "./../../../../public/STEEP_Brand logo-pink.png"
import ZenZoo from "./../../../../public/ZenZoo.jpg"
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const showLoader = !isAnimationDone;
  const { addToCart, pending, getCart } = useCart();
  const navigate = useNavigate();
  const API_BASE = "https://flowers-vert-six.vercel.app/api";



  const handleAddToCart = async (productId, quantity) => {
    await addToCart(productId, quantity);
    await getCart();
  };
  const slides = [
    {
      id: 1,
      title: "Luxury Rose Bouquets",
      description: "Fresh red roses for special occasions",
      buttonText: "Order Roses",
      path: "/products",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bgColor: "bg-gray-400/30 backdrop-blur-md"
    },
    {
      id: 2,
      title: "Unique Cafe Experience",
      description: "Enjoy relaxing atmospheres with premium beverages",
      buttonText: "Explore Cafes",
      path: "/cafes",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bgColor: "bg-gray-400/30 backdrop-blur-md"
    }
  ];

  const partners = [
    {
      name: "Partner 1",
      logo: bruxies,
    },
    {
      name: "Partner 2",
      logo: STEEP
    },
    {
      name: "Partner 3",
      logo: ZenZoo
    },
    // {
    //   name: "Partner 4",
    //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPF2Rzt67PYu_FCqNeHEpMPSVd-xTnr2x2yg&s"
    // },
    // {
    //   name: "Partner 5",
    //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPF2Rzt67PYu_FCqNeHEpMPSVd-xTnr2x2yg&s"
    // }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productsRes = await axios.get(`${API_BASE}/product/user`);
        setProducts(productsRes.data.slice(0, 6));

        const cafesRes = await axios.get(`${API_BASE}/cafe/display-all-cafes`);
        const cafesData = cafesRes.data?.cafeData || cafesRes.data || [];
        setCafes(cafesData.slice(0, 6));

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setIsAnimationDone(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Home | Love Acts</title>
        <meta name="description" content="Welcome to Love Acts - Luxury flowers and unique cafe experiences" />
      </Helmet>

      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-pink-100 z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src="/Logo.PNG"
              alt="Love Acts Logo"
              className="h-80 drop-shadow-xl"
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{
                opacity: 1,
                scale: [0.5, 1.2, 1],
                rotate: [-20, 0, 5, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-96 md:h-screen max-h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`}></div>
            </div>

            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto text-white">
                <motion.h1
                  className="text-3xl md:text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="text-xl mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.description}
                </motion.p>
                <motion.button
                  onClick={() => navigate(slide.path)}
                  className="bg-white text-amber-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {slide.buttonText}
                </motion.button>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-2 rounded-full hover:bg-white/50 transition"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-2 rounded-full hover:bg-white/50 transition"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

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
              className="text-amber-600 hover:text-amber-700 font-medium"
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
              {[...Array(3)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {products.map((product) => {
                const id = product._id || product.id;
                return (
                  <div
                    key={id}
                    className="
                bg-transparent p-2 shadow-none border-none rounded-none text-center
                lg:bg-gray-50 lg:rounded-lg lg:hover:shadow-md lg:transition lg:overflow-hidden
              "
                  >
                    <div className="relative overflow-hidden w-28 h-28 mx-auto lg:w-full lg:h-64">
                      <img
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={product.name}
                        className="
                    w-full h-full object-cover rounded-full lg:rounded-none
                    group-hover:scale-100 lg:group-hover:scale-105 lg:transition lg:duration-300
                  "
                      />
                      {/* <button className="hidden lg:block absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white transition">
                  <FiHeart className="text-gray-600 hover:text-red-500" />
                </button> */}
                    </div>

                    <div className="p-2 lg:p-6">
                      <h3 className="text-sm lg:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">
                        {product.name}
                      </h3>

                      <span className="block text-xs lg:text-lg font-bold text-amber-600 mb-2 lg:mb-0">
                        {product.price} EGP
                      </span>

                      <p className="hidden lg:block text-gray-600 mb-4 line-clamp-2">
                        {product.description || "Premium product from Love Acts"}
                      </p>

                      <div className="flex justify-center lg:justify-between items-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            try {
                              await handleAddToCart(id, 1);
                              toast.success("Added to cart 🛒");
                            } catch (err) {
                              toast.error("Something went wrong while adding!");
                            }
                          }}
                          disabled={pending[`add-${id}`]}
                          className="bg-amber-600 text-white text-xs px-2 py-1 rounded hover:bg-amber-700 transition
             lg:text-base lg:px-4 lg:py-2 flex items-center justify-center w-auto lg:w-full
             disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {pending[`add-${id}`] ? (
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
                            <>
                              <FiShoppingCart className="mr-1" />
                              Add
                            </>
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
      </section>




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
              className="text-amber-600 hover:text-amber-700 font-medium text-sm md:text-base"
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
              {[...Array(3)].map((_, i) => (
                <CafeSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {cafes.map(cafe => {
                  const id = cafe._id || cafe.id;
                  return (

                    <div key={id} className=" p-4 flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2">
                          <img
                            src={cafe.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
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
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-800 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Love Acts?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy & Secure Shopping</h3>
              <p className="text-gray-600">Seamless shopping experience with secure payment and fast delivery</p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCoffee className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Cafe Experience</h3>
              <p className="text-gray-600">Enjoy comfortable atmospheres and specialty drinks at our cafes</p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Premium quality products carefully selected to ensure your satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Featured Partners
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We collaborate with the best brands and suppliers to ensure quality service
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <FiSmartphone className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Our Mobile App
              </h2>
              <p className="text-xl mb-8 ">
                Order flowers, reserve cafe tables, and explore exclusive offers with our easy-to-use app
              </p>

              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className=" font-semibold">Coming Soon</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full font-semibold flex items-center justify-center transition-all duration-300 cursor-not-allowed opacity-80"
                  onClick={(e) => e.preventDefault()}
                >
                  <span>App Store</span>
                </a>
                <a
                  href="#"
                  className="bg-white/20  hover:bg-white/30 px-6 py-3 rounded-full font-semibold flex items-center justify-center transition-all duration-300 cursor-not-allowed opacity-80"
                  onClick={(e) => e.preventDefault()}
                >
                  <span>Google Play</span>
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative max-w-md">
                <div className="absolute -inset-4"></div>
                <div className="relative overflow-hidden">
                  <img
                    src="/Logo.PNG"
                    alt="Love Acts Mobile App"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
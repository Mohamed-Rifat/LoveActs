import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCart } from '../../hooks/UseCart';
import HeroSlider from '../../Components/Home/HeroSlider';
import FeaturedProducts from '../../Components/Home/FeaturedProducts';
import CafesSection from '../../Components/Home/CafesSection';
import Partners from '../../Components/Home/Partners';
import MobileAppSection from '../../Components/Home/MobileAppSection';

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
  const slides = [
    {
      id: 1,
      image: "/Banner1.PNG",
      heading: "Step 1:",
      subheading: "Pick the Flower Bundle",
      description: "Fresh minimal packs like no other!",
      caption: "Love is in every sip.",
      position: "right",
      headingColor: "text-white",
      subheadingColor: "text-[#EB95A2]",
      bgColor: "from-transparent to-gray-900"
    },
    {
      id: 2,
      image: "/Banner2.jpeg",
      heading: "Step 2:",
      subheading: "place your Coffee order",
      description: "Got all your favourite coffee shops in one place!",
      caption: "Delicious memories.",
      position: "right",
      headingColor: "text-white",
      subheadingColor: "text-[#EB95A2]",
      bgColor: "from-transparent to-gray-900"
    },
    {
      id: 3,
      image: "/Banner3.PNG",
      heading: "Step 3:",
      subheading: "Choose pickup or Delivery",
      caption: "Every act of love matters.",
      position: "left",
      headingColor: "text-white",
      subheadingColor: "text-[#EB95A2]",
      bgColor: "from-gray-900 to-transparent"
    }
  ];

  const clients = [
    { name: "Bruxies", logo: "/bruxies.png" },
    { name: "STEEP", logo: "/STEEP_Brand logo-pink.png" },
    { name: "ZenZoo", logo: "/ZenZoo.JPG" },
    { name: "TLap", logo: "/TLap.jpg" },
    { name: "Brewbuzz", logo: "/Brewbuzz.png" },
    { name: "SeelaZ", logo: "/SeelaZ logo -2.png" },
    { name: "IMG", logo: "/IMG_7755.JPG" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productsRes = await axios.get(`${API_BASE}/product/user`);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data.slice(0, 6) : (productsRes.data?.slice ? productsRes.data.slice(0,6) : []));

        const cafesRes = await axios.get(`${API_BASE}/cafe/display-all-cafes`);
        const cafesData = cafesRes.data?.cafeData || cafesRes.data || [];
        setCafes(Array.isArray(cafesData) ? cafesData.slice(0, 6) : []);

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
    if (!isAnimationDone) {
      const timer = setTimeout(() => {
        setIsAnimationDone(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimationDone]);

  const handleAddToCart = async (productId, quantity = 1) => {
    await addToCart(productId, quantity);
    await getCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Home | Love Acts</title>
        <meta name="description"
        content="Love Acts is your destination for luxury flowers, romantic bouquets, and elegant floral arrangements in Egypt. Complete the experience with our curated café selections. Perfect for weddings, engagements, and gifts."
        />
        <meta name="keywords"
          content="Love Acts, luxury flowers, romantic bouquets, floral arrangements, send flowers Egypt, online flower shop, café experiences"
        />
        <meta property="og:title" content="Love Acts | Luxury Flowers & Unique Café Experiences" />
        <meta property="og:description"
          content="Discover Love Acts - where luxury flowers meet unique café experiences. Shop premium bouquets and gifts for every occasion."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Love Acts" />
        <meta property="og:url" content="https://loveacts.vercel.app/" />
        <meta property="og:image" content="https://loveacts.vercel.app/Banner1.PNG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Love Acts | Luxury Flowers & Unique Café Experiences" />
        <meta name="twitter:description" content="Discover Love Acts - where luxury flowers meet unique café experiences. Shop premium bouquets and gifts for every occasion." />
        <meta name="twitter:image" content="https://loveacts.vercel.app/Banner1.PNG" />
        <meta name="robots" content="index, follow" />
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
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <HeroSlider slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <FeaturedProducts products={products} loading={loading} handleAddToCart={handleAddToCart} pending={pending} navigate={navigate} />
      <CafesSection cafes={cafes} loading={loading} navigate={navigate} />
      <Partners clients={clients} />
      <MobileAppSection />
    </div>
  );
}

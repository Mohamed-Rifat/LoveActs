import React, { useState, useEffect } from 'react';

export default function Home() {
  // Mock data for Word section
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: "Luxury Rose Bouquets",
      description: "Fresh red roses for special occasions",
      buttonText: "Order Roses",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bgColor: "bg-gray-400/30 backdrop-blur-md"
    },
    {
      id: 2,
      title: "Elegant White Arrangements",
      description: "Pure white flowers for elegant events",
      buttonText: "View White Collection",
      image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bgColor: "bg-gray-400/30 backdrop-blur-md"
    },
    {
      id: 3,
      title: "Seasonal Flower Mix",
      description: "Vibrant colors for every season",
      buttonText: "Explore All Flowers",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bgColor: "bg-gray-400/30 backdrop-blur-md"
    }
  ];

  // Auto slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);
  const [wordItems, setWordItems] = useState([
    {
      id: 1,
      title: "Word Collection 1",
      description: "Premium quality word products for your needs",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Word Collection 2",
      description: "Elegant and professional word solutions",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Word Collection 3",
      description: "Innovative word designs for modern users",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    }
  ]);

  // Mock data for Cafes section
  const [cafeItems, setCafeItems] = useState([
    {
      id: 101,
      title: "Espresso",
      description: "Strong black coffee",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      category: "Hot Drinks"
    },
    {
      id: 102,
      title: "Iced Latte",
      description: "Refreshing cold coffee",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      category: "Cold Drinks"
    },
    {
      id: 103,
      title: "Croissant",
      description: "Freshly baked pastry",
      price: 6.99,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      category: "Bakery"
    }
  ]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const addToCart = (productId, quantity = 1) => {
    setCart(prev => [...prev, { productId, quantity }]);
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-900 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <div className="relative h-96 md:h-screen max-h-[600px] overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`}></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fadeIn">
                  {slide.title}
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto animate-fadeIn">
                  {slide.description}
                </p>
                <button
                  className="bg-white text-amber-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition animate-fadeIn"
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
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

        {/* Navigation arrows */}
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

      {/* Word Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Word Collections</h2>
            <button className="text-amber-600 hover:text-amber-700 font-medium">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wordItems.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-amber-600">{item.price.toFixed(2)} EG</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cafe Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Cafe Menu</h2>
            <button className="text-amber-600 hover:text-amber-700 font-medium">View All</button>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {["All", "Hot Drinks", "Cold Drinks", "Bakery"].map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === category
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cafeItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                    <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-amber-600">{item.price.toFixed(2)} EG</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-300">Providing high quality word products and premium cafe experience since 2023.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Word Collections</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cafe Menu</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">123 Street, City</p>
              <p className="text-gray-300">info@example.com</p>
              <p className="text-gray-300">+123 456 7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
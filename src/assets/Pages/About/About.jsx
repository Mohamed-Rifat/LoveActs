import React from 'react';
import { LocalFlorist, Favorite, CardGiftcard, Stars } from '@mui/icons-material';
import NatureIcon from '@mui/icons-material/Nature';
export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Love Acts
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Spreading love through flowers and thoughtful gifts
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Founded with a passion for nature's beauty and human connections, Love Acts began as a small flower shop with a big dream - to help people express their feelings through the timeless language of flowers.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              What started as a humble boutique has blossomed into a beloved destination for those seeking to celebrate life's special moments with fresh, exquisite floral arrangements and heartfelt gifts.
            </p>
            <p className="text-lg text-gray-600">
              Today, we continue to honor our roots while innovating new ways to deliver joy through our carefully curated collections.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white p-2 rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Flower shop interior"
                className="rounded-lg object-cover w-full h-96"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quality */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                <Stars className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Exceptional Quality</h3>
              <p className="text-gray-600">
                We source only the freshest, most beautiful flowers from trusted growers to ensure lasting beauty.
              </p>
            </div>

            {/* Passion */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                <Favorite className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Heartfelt Passion</h3>
              <p className="text-gray-600">
                Each arrangement is crafted with love and attention to detail, just as if we were making it for our own loved ones.
              </p>
            </div>

            {/* Creativity */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <CardGiftcard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Creative Expression</h3>
              <p className="text-gray-600">
                Our designs blend classic elegance with contemporary flair to create unique, memorable gifts.
              </p>
            </div>

            {/* Sustainability */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <NatureIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sustainable Practices</h3>
              <p className="text-gray-600">
                We're committed to eco-friendly operations, from responsible sourcing to recyclable packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Our Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fresh Flowers */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Fresh flowers"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Fresh Flower Arrangements</h3>
                <p className="text-white/90">
                  Handcrafted bouquets for all occasions, from romantic roses to cheerful seasonal mixes.
                </p>
              </div>
            </div>

            {/* Gift Packages */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Gift packages"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Thoughtful Gift Packages</h3>
                <p className="text-white/90">
                  Curated combinations of flowers, chocolates, and keepsakes to make your gift extra special.
                </p>
              </div>
            </div>

            {/* Events */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Event flowers"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Event Floral Design</h3>
                <p className="text-white/90">
                  Stunning floral installations for weddings, corporate events, and special celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-green-700 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Spread Some Love?</h2>
          <p className="text-white/90 text-xl mb-6 max-w-3xl mx-auto">
            Whether you're celebrating a special occasion or just want to brighten someone's day, we're here to help you find the perfect floral expression.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-white text-green-700 font-medium rounded-lg hover:bg-gray-100 transition">
              Browse Our Collections
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
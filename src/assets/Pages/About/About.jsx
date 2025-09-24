import React from 'react';
import { Favorite, CardGiftcard, Stars } from '@mui/icons-material';
import { Helmet } from "react-helmet-async";

export default function About() {
  return (
     <>
      <Helmet>
        <title>About Us | Love Acts</title>
        <meta
          name="description"
          content="Learn about Love Acts - our story, passion, and the values behind every flower and coffee experience. Discover why people love Love Acts."
        />
        <meta
          name="keywords"
          content="About Love Acts, our story, flower shop Egypt, luxury flowers, café experiences, gifting Egypt"
        />

        <meta property="og:title" content="About Love Acts | Our Story & Passion" />
        <meta
          property="og:description"
          content="Discover the Love Acts story - bringing together luxury flowers and café experiences to create meaningful moments of love."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Love Acts" />
        <meta property="og:url" content="https://loveacts.vercel.app/about" />
        <meta property="og:image" content="https://loveacts.vercel.app/Banner1.PNG" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Love Acts | Our Story & Passion" />
        <meta name="twitter:description" content="Discover the Love Acts story - bringing together luxury flowers and café experiences to create meaningful moments of love." />
        <meta name="twitter:image" content="https://loveacts.vercel.app/Banner1.PNG" />

        <meta name="robots" content="index, follow" />
      </Helmet>
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        

        <div className="mb-20 flex flex-col md:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Our story begins with a belief — that the smallest acts of love can mean the most.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              We started Love Acts to remind the world that love doesn’t need grand gestures — sometimes, it’s as simple as coffee and flowers, shared with the right person.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              We bring together flowers and your favorite coffee shops to make gifting warmer, easier, and more meaningful.
            </p>
            <p className="text-lg text-gray-600">
              Every cup, every flower, every detail we curate is rooted in one belief: love deserves to be felt in everyday life. That’s the story of Love Acts.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white p-2 rounded-lg shadow-xl">
              <img 
                src="/About.jpeg" 
                alt="Flower shop interior"
                className="rounded-lg object-cover lg:w-full lg:h-96"
              />
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Love Acts Core</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 text-pink-600 mb-4">
                <Stars className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Exceptional Quality</h3>
              <p className="text-gray-600">
                We source only the freshest, most beautiful flowers from trusted growers to ensure lasting beauty.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                <Favorite className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Heartfelt Passion</h3>
              <p className="text-gray-600">
                Each arrangement is crafted with love and attention to detail, just as if we were making it for our own loved ones.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <CardGiftcard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Creative Expression</h3>
              <p className="text-gray-600">
                Our designs blend classic elegance with contemporary flair to create unique, memorable gifts.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why You Love Love Acts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1000&q=80" 
                alt="Sentimental gifts"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Sentimental Gifting Options</h3>
                <p className="text-white/90">
                  Thoughtful ways to show love through meaningful, personal touches.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80" 
                alt="Corporate deals"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Corporate Deals</h3>
                <p className="text-white/90">
                  Strengthen business relationships with curated floral and coffee packages.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80" 
                alt="Event supply"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Event Supply</h3>
                <p className="text-white/90">
                  Beautiful setups and supplies for weddings, events, and celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#EB95A2] rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Spread Some Love?</h2>
          <p className="text-white text-xl mb-6 max-w-3xl mx-auto">
            Whether you're celebrating a special occasion or just want to brighten someone's day, we're here to help you find the perfect floral expression.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-white text-pink-600 font-medium rounded-lg hover:bg-gray-100 transition">
              Browse Our Collections
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
   </>
  );
}

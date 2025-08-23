import React from 'react';
import { FaHome, FaSearch, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mb-8">
            <div className="relative mx-auto w-64 h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-blue-100 rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-8xl font-bold text-gray-800">404</h1>
              </div>
              
              <div className="absolute top-0 left-10 w-12 h-12 bg-red-100 rounded-lg animate-float"></div>
              <div className="absolute top-5 right-12 w-10 h-10 bg-yellow-100 rounded-lg animate-float animation-delay-1000"></div>
              <div className="absolute bottom-8 left-16 w-8 h-8 bg-green-100 rounded-lg animate-float animation-delay-2000"></div>
              <div className="absolute bottom-12 right-8 w-14 h-14 bg-purple-100 rounded-lg animate-float animation-delay-1500"></div>
              
              <div className="absolute top-12 right-20 text-red-500">
                <FaExclamationTriangle className="w-10 h-10" />
              </div>
            </div>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <FaHome className="mr-2 h-5 w-5" />
              Home Page
            </a>
            
            <a
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <FaSearch className="mr-2 h-5 w-5" />
              Browse Products
            </a>
          </div>
          
          <div className="mt-12">
            <h3 className="text-sm font-medium text-gray-500">You might be looking for:</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a href="/about" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                About Us
                <FaArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-5px) rotate(3deg);
          }
          66% {
            transform: translateY(5px) rotate(-3deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
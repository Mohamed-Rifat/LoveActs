'use client'
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ShoppingBag as ProductsIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Inventory as InventoryIcon,
  Star as StarIcon
} from '@mui/icons-material';

// API Base URL
const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api/product';

const fetchUserProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const { data } = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return data.products || [];
  } catch (error) {
    console.error('Error fetching user products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-products'],
    queryFn: fetchUserProducts
  });

  // Extract unique categories
  const categories = React.useMemo(() => {
    const cats = new Set();
    products.forEach(product => {
      if (product.category) {
        cats.add(product.category);
      }
    });
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error loading products</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600">Browse our collection of high-quality products</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CategoryIcon className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all'
                ? "We couldn't find any products matching your criteria."
                : "There are currently no products available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
              >
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <ProductsIcon className="h-16 w-16 text-gray-400" />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {product.name}
                    </h2>
                    {product.isFeatured && (
                      <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        <StarIcon className="mr-1" fontSize="small" /> Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-gray-600 mb-4">
                    {product.description && (
                      <p className="text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center">
                      <PriceIcon className="flex-shrink-0 mr-2 text-gray-400" fontSize="small" />
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center">
                      <InventoryIcon className="flex-shrink-0 mr-2 text-gray-400" fontSize="small" />
                      <span className={product.stock <= 0 ? 'text-red-500' : ''}>
                        {product.stock <= 0 ? 'Out of Stock' : `In Stock: ${product.stock}`}
                      </span>
                    </div>

                    {product.category && (
                      <div className="flex items-center">
                        <CategoryIcon className="flex-shrink-0 mr-2 text-gray-400" fontSize="small" />
                        <span className="text-sm">{product.category}</span>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={product.stock <= 0}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                  >
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

export default function Cafes() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

const fetchCafes = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // 1. جلب التوكن من localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    // 2. إضافة معاملات التأخير وإعادة المحاولة
    const response = await axios.get(
      "https://flowers-vert-six.vercel.app/api/cafe/display-all-cafes",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 10000, // 10 ثانية كحد أقصى
        retry: 3, // عدد المحاولات
        retryDelay: 1000 // تأخير ثانية بين المحاولات
      }
    );

    // 3. معالجة جميع الهياكل المحتملة للبيانات
    const cafesData = response.data?.cafeData || 
                     response.data?.data || 
                     response.data?.cafes || 
                     [];

    if (!Array.isArray(cafesData)) {
      throw new Error("تنسيق البيانات غير صالح");
    }

    setCafes(cafesData);
    
  } catch (err) {
    // 4. معالجة متقدمة للأخطاء
    const errorMessage = err.response?.data?.message || 
                       err.message || 
                       "حدث خطأ في الخادم. يرجى المحاولة لاحقاً";
    
    console.error("تفاصيل الخطأ:", {
      status: err.response?.status,
      data: err.response?.data,
      config: err.config
    });

    setError(errorMessage);
    
    // 5. إعادة توجيه إذا كان الخطأ 401 (غير مصرح)
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCafes();
  }, []);

  const filteredCafes = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return cafes.filter(
      (cafe) =>
        cafe.name?.toLowerCase().includes(search) ||
        cafe.location?.toLowerCase().includes(search) ||
        cafe.address?.toLowerCase().includes(search)
    );
  }, [cafes, searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Cafes</h1>
          <button
            onClick={fetchCafes}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cafes by name, location or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCafes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCafes.map((cafe) => (
              <div
                key={cafe._id || cafe.id}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                <img
                  src={cafe.image || "https://via.placeholder.com/300x200?text=Cafe"}
                  alt={cafe.name}
                  className="h-48 w-full object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Cafe";
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {cafe.name || "Unnamed Cafe"}
                </h2>
                <p className="text-gray-600 mb-1">
                  📍 {cafe.location || "Location not specified"}
                </p>
                <p className="text-gray-500 text-sm">
                  🏠 {cafe.address || "No address provided"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No cafes found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try adjusting your search query"
                : "There are currently no cafes available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
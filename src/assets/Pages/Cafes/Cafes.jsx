import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Cafes() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [credentials, setCredentials] = useState({
    email: 'test@gmail.com',
    password: '123456'
  });

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await axios.get(
          'https://flowers-vert-six.vercel.app/api/cafe/display-all-cafes',
          { data: credentials }
        );
        
        const responseData = response.data;
        
        if (Array.isArray(responseData)) {
          setCafes(responseData);
        } else if (responseData && Array.isArray(responseData.cafes)) {
          setCafes(responseData.cafes);
        } else if (responseData && Array.isArray(responseData.data)) {
          setCafes(responseData.data);
        } else {
          setCafes([]);
          setError('Unexpected response format from server');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch cafes');
        setLoading(false);
      }
    };

    fetchCafes();
  }, [credentials]);

  const filteredCafes = Array.isArray(cafes) 
    ? cafes.filter(cafe => {
        if (!cafe) return false;
        const name = cafe.name || '';
        const location = cafe.location || '';
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Discover Premium Cafés</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <button 
            onClick={() => {
              setLoading(true);
              setError(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {filteredCafes.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {cafes.length === 0 ? 'No cafes available' : 'No cafes match your search'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map((cafe) => (
            <div key={cafe.id || cafe._id || Math.random()} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={cafe.image || 'https://via.placeholder.com/300x200?text=Cafe+Image'} 
                alt={cafe.name || 'Cafe image'}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">{cafe.name || 'Unnamed Cafe'}</h2>
                <p className="text-gray-600 mb-3">{cafe.location || 'Location not specified'}</p>
                <p className="text-gray-700 mb-4">
                  {cafe.description || 'A wonderful coffee experience awaits you.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {cafe.rating || 'N/A'} ★
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
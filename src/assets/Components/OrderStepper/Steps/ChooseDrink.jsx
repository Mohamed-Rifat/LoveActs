import React, { useEffect, useState, useMemo } from "react";
import { FiCoffee, FiX, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

export default function ChooseCafe({ onSelectCafe, onSelectDrink, onNext }) {
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://flowers-vert-six.vercel.app/api/cafe/display-all-cafes"
        );
        const cafesData = data?.cafeData || data || [];
        setCafes(cafesData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load cafes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  const filteredCafes = useMemo(() => {
    if (!searchTerm) return cafes;
    return cafes.filter(cafe => 
      cafe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cafes, searchTerm]);

  const handleSelectCafe = (cafe) => {
    setSelectedCafe(cafe);
    setSelectedDrink(null);
    setOpenPopup(true);
  };

  const handleSelectDrink = (drink) => setSelectedDrink(drink);

  const handleConfirm = () => {
    if (selectedCafe && selectedDrink) {
      onSelectCafe(selectedCafe);
      onSelectDrink(selectedDrink);
      setOpenPopup(false);
      onNext();
    }
  };

  if (loading) return <div className="text-center py-8">Loading cafes...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Choose your favorite café and drink
      </h2>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by café name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FiX className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {searchTerm && (
        <p className="text-gray-600 mb-4">
          {filteredCafes.length} Search results for "{searchTerm}"
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCafes.length > 0 ? (
          filteredCafes.map((cafe) => (
            <motion.div
              key={cafe._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={cafe.image || "/Logo.PNG"}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {cafe.products && cafe.products.length > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {cafe.products.length} Product{cafe.products.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{cafe.name}</h3>
                  <button
                    onClick={() => handleSelectCafe(cafe)}
                    className="mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <FiCoffee />
                    View Products
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No cafés match your search
          </div>
        )}
      </div>

      {openPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <FiCoffee className="mr-2" />
              <h3 className="text-lg font-semibold flex-grow">
                {selectedCafe?.name || "Products"}
              </h3>
              <button
                onClick={() => setOpenPopup(false)}
                className="text-white hover:text-gray-200"
              >
                <FiX />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-grow">
              <p className="text-gray-600 text-sm mb-4">
                Choose your favorite drink from the menu
              </p>
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <div className="space-y-2">
                {selectedCafe?.products?.length ? (
                  selectedCafe.products.map((drink) => {
                    const isSelected = selectedDrink?._id === drink._id;
                    return (
                      <button
                        key={drink._id}
                        onClick={() => handleSelectDrink(drink)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <p className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                              {drink.productName}
                            </p>
                            {drink.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {drink.description}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-blue-600 ml-2">
                            {drink.price} LE
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No drinks available for this café
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setOpenPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedDrink}
                className={`px-6 py-2 rounded-lg ${
                  selectedDrink
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
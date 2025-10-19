import React, { useEffect, useState, useMemo } from "react";
import { FiCoffee, FiX, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

export default function ChooseCafe({ onSelectCafe, onSelectDrink }) {
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drinkFilter, setDrinkFilter] = useState("all");

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

  const filteredDrinks = selectedCafe?.products?.filter((drink) => {
    if (drinkFilter === "all") return true;

    const name = drink.productName?.toLowerCase() || "";
    if (drinkFilter === "hot") return name.includes("hot")
    if (drinkFilter === "cold") return name.includes("cold");

    return true;
  });

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
    }
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-3"></div>
          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  );

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
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF848A] focus:border-[#CF848A]"
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

      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredCafes.length > 0 ? (
            filteredCafes.map((cafe) => (
              <motion.div
                key={cafe._id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <div
                  className="relative w-24 h-24 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer mb-3 border-2 border-white hover:border-[#CF848A] overflow-visible"
                  onClick={() => handleSelectCafe(cafe)}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={cafe.image || "/Logo.PNG"}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {cafe.products && cafe.products.length > 0 && (
                    <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-[#CF848A] text-white text-[0.75rem] font-semibold 
                    w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      {cafe.products.length}
                    </div>
                  )}
                </div>
                <h3 className="text-center font-medium text-sm max-w-full truncate px-1">
                  {cafe.name}
                </h3>
                <button
                  onClick={() => handleSelectCafe(cafe)}
                  className="mt-2 flex items-center justify-center gap-1 bg-[#CF848A] hover:bg-[#A85C68] text-white py-1 px-3 rounded-full transition-colors text-xs"
                >
                  <FiCoffee className="text-xs" />
                  View
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No cafés match your search
            </div>
          )}
        </div>
      )}

      {openPopup && selectedCafe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-white rounded-sm shadow-2xl w-full h-full max-h-[95vh] sm:max-w-4xl sm:max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="bg-[#CF848A] text-white p-4 sm:p-6 flex items-center">
              <FiCoffee className="mr-2 text-xl sm:text-2xl" />
              <h3 className="text-lg md:text-xl font-semibold flex-grow">
                {selectedCafe?.name || "Products"}
              </h3>
              <button
                onClick={() => setOpenPopup(false)}
                className="text-white hover:text-gray-200 p-1"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <p className="text-gray-600 text-sm mb-4 sm:mb-6">
                Choose your favorite drink from <span className="font-semibold text-[#A85C68]">{selectedCafe.name}</span>
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {["all", "hot", "cold"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDrinkFilter(filter)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${drinkFilter === filter
                      ? "bg-[#CF848A] text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-items-center">
                {filteredDrinks && filteredDrinks.length > 0 ? (
                  filteredDrinks.map((drink) => {
                    const isSelected = selectedDrink?._id === drink._id;
                    return (
                      <motion.div
                        key={drink._id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSelectDrink(drink)}
                        className={`cursor-pointer text-center transition-all w-full max-w-[100px] sm:max-w-[120px] ${isSelected ? "scale-105" : ""
                          }`}
                      >
                        <div
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-md border-2 transition-all overflow-hidden mx-auto ${isSelected
                            ? "border-[#A85C68] shadow-lg"
                            : "border-transparent hover:border-[#CF848A]"
                            }`}
                        >
                          <img
                            src={drink.image || "/Logo.PNG"}
                            alt={drink.productName}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#A85C68] bg-opacity-20 rounded-full"></div>
                          )}
                        </div>
                        <p
                          className={`mt-2 text-sm sm:text-sm font-medium w-full text-center leading-snug clamp-2 h-[2.6em] ${isSelected ? "text-[#A85C68] font-bold" : "text-gray-800"
                            }`}
                        >
                          {drink.productName}
                        </p>
                        <p className="text-sm font-bold text-gray-500 mt-1">{drink.price} LE</p>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500 col-span-full flex flex-col items-center justify-center h-64">
                    <FiCoffee className="text-4xl text-gray-300 mb-4" />
                    <p className="text-base sm:text-lg">No drinks available for this café</p>
                    <p className="text-sm text-gray-400 mt-2">Check back later for new additions</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between bg-gray-50">
              <button
                onClick={() => setOpenPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedDrink}
                className={`px-6 py-2 rounded-full font-medium transition ${selectedDrink
                  ? "bg-[#CF848A] hover:bg-[#A85C68] text-white shadow-md transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
import { FiSearch } from "react-icons/fi";

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  showDeleted,
  onShowDeletedChange,
}) => {
  return (
    <div className="px-6 py-6 mb-8 transition-all duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-start md:justify-end mt-2 md:mt-0">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={onShowDeletedChange}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-indigo-200 peer peer-checked:bg-indigo-600 transition-all"></div>
              <div className="absolute top-[3px] left-[3px] bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-6 shadow-sm"></div>
            </div>
            <span className="text-sm font-medium text-gray-800 select-none">
              Show deleted products
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

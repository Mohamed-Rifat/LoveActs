import React from 'react';

const Header = ({ onAddProduct }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className=" py-6 px-2 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-5 w-5 md:h-8 md:w-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h1 className="text-md md:text-3xl font-bold text-white">Products Management Dashboard</h1>
        </div>
        <button
          onClick={onAddProduct}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-200"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Product
        </button>
      </div>
    </header>
  );
};

export default Header;
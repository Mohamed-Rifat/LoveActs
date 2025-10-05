
const Header = ({ onAddCafe }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className=" py-6 px-2 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-5 w-5 md:h-8 md:w-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h1 className="text-md md:text-3xl font-bold text-white">Cafes Management Dashboard</h1>
        </div>
        <button
          onClick={onAddCafe}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-md shadow-md flex items-center transition duration-200"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Cafe
        </button>
      </div>
    </header>
  );
};

export default Header;